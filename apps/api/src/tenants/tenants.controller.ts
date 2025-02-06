import { Controller, Post, Body, UseGuards, Request, Get, Param, HttpCode, Patch, Delete } from '@nestjs/common';
import { TenantsService, InvitationResponse } from './tenants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('Tenants')
@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({ 
    status: 201, 
    description: 'Tenant created successfully',
    type: CreateTenantDto 
  })
  async createTenant(
    @Body() createTenantDto: CreateTenantDto,
    @Request() req,
  ) {
    return this.tenantsService.createTenant({
      name: createTenantDto.name,
      adminId: req.user.userId,
    });
  }

  @Post('invite')
  @Roles('admin')
  @ApiOperation({ summary: 'Invite a user to the tenant' })
  @ApiResponse({ 
    status: 201, 
    description: 'Invitation sent successfully',
    schema: {
      properties: {
        message: { type: 'string' },
        invitation: { type: 'object' }
      }
    }
  })
  async inviteUser(
    @Request() req,
    @Body() inviteUserDto: InviteUserDto,
  ) {
    const invitation = await this.tenantsService.createInvitation({
      email: inviteUserDto.email,
      tenantId: req.user.tenantId,
      inviterId: req.user.userId,
    });

    return {
      message: 'Invitation sent successfully',
      invitation: {
        email: invitation.email,
        token: invitation.token,
        expiresAt: invitation.expiresAt
      }
    };
  }

  @Post('accept-invitation/:token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Accept a tenant invitation' })
  @ApiResponse({ 
    status: 200, 
    description: 'Invitation accepted successfully',
    schema: {
      properties: {
        message: { type: 'string' }
      }
    }
  })
  async acceptInvitation(
    @Request() req,
    @Param('token') token: string,
  ) {
    await this.tenantsService.acceptInvitation(token, req.user.userId);
    return { message: 'Invitation accepted successfully' };
  }

  @Get('users')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users in the tenant' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of tenant users',
    schema: {
      properties: {
        users: { 
          type: 'array',
          items: { type: 'object' }
        }
      }
    }
  })
  async getTenantUsers(@Request() req) {
    const users = await this.tenantsService.getTenantUsers(req.user.tenantId);
    return {
      users,
    };
  }

  @Get('validate-invitation/:token')
  @ApiOperation({ summary: 'Validate an invitation token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Invitation details',
    schema: {
      properties: {
        valid: { type: 'boolean' },
        invitation: { type: 'object' }
      }
    }
  })
  async validateInvitation(@Param('token') token: string) {
    return this.tenantsService.validateInvitation(token);
  }

  @Get('invitations')
  @UseGuards(JwtAuthGuard)
  async getPendingInvitations(@Request() req) {
    const user = req.user;
    return this.tenantsService.getPendingInvitations(user.tenantId);
  }

  @Post('invitations/:id/resend')
  @UseGuards(JwtAuthGuard)
  async resendInvitation(
    @Request() req,
    @Param('id') invitationId: string,
  ): Promise<InvitationResponse> {
    const user = req.user;
    return this.tenantsService.resendInvitation(invitationId, user.tenantId);
  }

  @Delete('invitations/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Cancel a pending invitation' })
  @ApiResponse({ 
    status: 200, 
    description: 'Invitation cancelled successfully',
    schema: {
      properties: {
        message: { type: 'string' }
      }
    }
  })
  async cancelInvitation(
    @Request() req,
    @Param('id') invitationId: string,
  ) {
    await this.tenantsService.cancelInvitation(invitationId, req.user.tenantId);
    return { message: 'Invitation cancelled successfully' };
  }

  @Patch('users/:userId/role')
  @Roles('admin')
  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ 
    status: 200, 
    description: 'User role updated successfully',
    schema: {
      properties: {
        message: { type: 'string' }
      }
    }
  })
  async updateUserRole(
    @Request() req,
    @Param('userId') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    await this.tenantsService.updateUserRole(
      req.user.tenantId,
      userId,
      updateUserRoleDto.role,
    );
    return { message: 'User role updated successfully' };
  }

  @Delete('users/:userId')
  @Roles('admin')
  @ApiOperation({ summary: 'Remove user from tenant' })
  @ApiResponse({ 
    status: 200, 
    description: 'User removed successfully',
    schema: {
      properties: {
        message: { type: 'string' }
      }
    }
  })
  async removeUser(
    @Request() req,
    @Param('userId') userId: string,
  ) {
    await this.tenantsService.removeUser(
      req.user.tenantId,
      userId,
      req.user.userId,
    );
    return { message: 'User removed successfully' };
  }
}
