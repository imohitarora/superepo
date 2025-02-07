import { Injectable, NotFoundException, UnauthorizedException, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Invitation } from './invitation.entity';
import { User } from '../users/user.entity';
import { v4 as uuidv4 } from 'uuid';

interface CreateTenantDto {
  name: string;
  adminId: string;
}

interface CreateInvitationDto {
  email: string;
  tenantId: string;
  inviterId: string;
  role?: 'admin' | 'user';
}

export interface InvitationResponse extends Invitation {
  invitationUrl: string;
}

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    @InjectRepository(Invitation)
    private invitationsRepository: Repository<Invitation>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async createTenant(dto: CreateTenantDto): Promise<Tenant> {
    const tenant = this.tenantsRepository.create({
      name: dto.name,
      status: 'active',
    });
    const savedTenant = await this.tenantsRepository.save(tenant);

    // Update the admin user with the tenant ID and admin role
    await this.usersRepository.update(dto.adminId, {
      tenantId: savedTenant.id,
      roles: ['admin']
    });

    return savedTenant;
  }

  async createInvitation(dto: CreateInvitationDto): Promise<InvitationResponse> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email }
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Create invitation with token
    const invitationToken = uuidv4();

    const invitation = this.invitationsRepository.create({
      email: dto.email,
      tenantId: dto.tenantId,
      inviterId: dto.inviterId,
      token: invitationToken,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      role: dto.role || 'user', // Default to 'user' if role is not specified
    });

    const savedInvitation = await this.invitationsRepository.save(invitation);

    // Generate invitation URL using the token
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/register?invitationToken=${invitationToken}`;

    console.log('Invitation URL:', invitationUrl);

    // Return the saved invitation with the URL
    return {
      ...savedInvitation,
      invitationUrl,
    };
  }

  async acceptInvitation(token: string, userId: string): Promise<void> {
    const invitation = await this.invitationsRepository.findOne({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invitation has already been used or expired',
      }, HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user's tenant and role
    user.tenantId = invitation.tenantId;
    user.roles = [invitation.role || 'user'];
    await this.usersRepository.save(user);

    // Mark invitation as completed
    invitation.status = 'completed';
    invitation.acceptedAt = new Date();
    invitation.acceptedBy = userId;
    await this.invitationsRepository.save(invitation);
  }

  async getTenantUsers(tenantId: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { tenantId },
      select: ['id', 'email', 'roles', 'createdAt']
    });
  }

  async validateInvitation(token: string): Promise<boolean> {
    const invitation = await this.invitationsRepository.findOne({
      where: { token }
    });

    return !!(invitation && invitation.status === 'pending' && invitation.expiresAt > new Date());
  }

  async getTenantById(id: string): Promise<Tenant> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async updateUserRole(tenantId: string, userId: string, newRole: 'admin' | 'user'): Promise<void> {
    const users = await this.usersRepository.find({ where: { tenantId } });
    const targetUser = users.find(u => u.id === userId);

    if (!targetUser) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found in tenant',
      }, HttpStatus.NOT_FOUND);
    }

    // If changing from admin to user, ensure there will still be at least one admin
    if (targetUser.roles.includes('admin') && newRole === 'user') {
      const adminCount = users.filter(u => u.roles.includes('admin')).length;
      if (adminCount <= 1) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Cannot remove the last admin from the tenant',
        }, HttpStatus.BAD_REQUEST);
      }
    }

    await this.usersRepository.update(userId, {
      roles: [newRole],
    });
  }

  async removeUser(tenantId: string, userId: string, requestingUserId: string): Promise<void> {
    // Prevent self-removal
    if (userId === requestingUserId) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Cannot remove yourself from the tenant',
      }, HttpStatus.BAD_REQUEST);
    }

    const users = await this.usersRepository.find({ where: { tenantId } });
    const targetUser = users.find(u => u.id === userId);

    if (!targetUser) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found in tenant',
      }, HttpStatus.NOT_FOUND);
    }

    // If removing an admin, ensure there will still be at least one admin
    if (targetUser.roles.includes('admin')) {
      const adminCount = users.filter(u => u.roles.includes('admin')).length;
      if (adminCount <= 1) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Cannot remove the last admin from the tenant',
        }, HttpStatus.BAD_REQUEST);
      }
    }

    // Remove user from tenant by setting tenantId to undefined
    await this.usersRepository.update(userId, {
      tenantId: undefined,
      roles: ['user'], // Reset to basic user role
    });
  }

  async getPendingInvitations(tenantId: string): Promise<Invitation[]> {
    return this.invitationsRepository.find({
      where: {
        tenantId,
        status: 'pending',
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async resendInvitation(invitationId: string, tenantId: string): Promise<InvitationResponse> {
    const invitation = await this.invitationsRepository.findOne({
      where: { id: invitationId, tenantId, status: 'pending' }
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Update expiry and generate new token
    const invitationToken = uuidv4();
    invitation.token = invitationToken;
    invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const savedInvitation = await this.invitationsRepository.save(invitation);

    // Generate invitation URL using the token
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/join?token=${invitationToken}`;

    return {
      ...savedInvitation,
      invitationUrl,
    };
  }

  async cancelInvitation(invitationId: string, tenantId: string): Promise<void> {
    const invitation = await this.invitationsRepository.findOne({
      where: { id: invitationId }
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.tenantId !== tenantId) {
      throw new ForbiddenException('You do not have permission to cancel this invitation');
    }

    await this.invitationsRepository.delete(invitationId);
  }
}
