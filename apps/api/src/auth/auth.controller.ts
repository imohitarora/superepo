import { Controller, Post, Body, UseGuards, Get, Request, HttpException, HttpStatus, Query, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiQuery({ name: 'invitationToken', required: false, description: 'Invitation token for joining existing tenant' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        message: 'Registration successful',
        user: {
          id: 1,
          email: 'user@example.com',
          tenantId: 'uuid',
          roles: ['user'],
        },
        access_token: 'jwt_token',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async register(
    @Body() registerDto: RegisterDto,
    @Query('invitationToken') invitationToken?: string,
  ) {
    try {
      const result = await this.authService.register(
        registerDto.email,
        registerDto.password,
        invitationToken
      );
      return {
        ...result,
        message: 'Registration successful'
      };
    } catch (error) {
      if (error.message === 'Email already exists') {
        throw new HttpException({
          status: HttpStatus.CONFLICT,
          message: 'Email already exists',
        }, HttpStatus.CONFLICT);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Registration failed',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      example: {
        message: 'Login successful',
        user: {
          id: 1,
          email: 'user@example.com',
          tenantId: 'uuid',
          roles: ['user'],
        },
        access_token: 'jwt_token',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req) {
    try {
      const result = await this.authService.login(req.user);
      return {
        ...result,
        message: 'Login successful'
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      }, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'user@example.com',
          name: 'John Doe',
          bio: 'Software engineer',
          avatarUrl: 'https://example.com/avatar.jpg',
          tenantId: 'uuid',
          roles: ['user'],
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return {
      user: {
        id: req.user.userId,
        email: req.user.email,
        name: req.user.name,
        bio: req.user.bio,
        avatarUrl: req.user.avatarUrl,
        tenantId: req.user.tenantId,
        roles: req.user.roles,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      example: {
        message: 'Profile updated successfully',
        user: {
          id: 1,
          email: 'user@example.com',
          name: 'John Doe',
          bio: 'Software engineer',
          avatarUrl: 'https://example.com/avatar.jpg',
          tenantId: 'uuid',
          roles: ['user'],
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    try {
      return await this.authService.updateProfile(req.user.userId, updateProfileDto);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to update profile',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
