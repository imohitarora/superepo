import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tenantsService: TenantsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      console.log('Validating user:', email);
      const user = await this.usersService.findByEmail(email);
      console.log('Found user during validation:', { ...user, password: '[REDACTED]' });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password validation result:', isPasswordValid);
      
      if (user && isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error during user validation:', error);
      return null;
    }
  }

  async login(user: any) {
    console.log('Logging in user:', { ...user, password: '[REDACTED]' });
    const payload = {
      email: user.email,
      sub: user.id,
      tenantId: user.tenantId,
      roles: user.roles,
      name: user.name,
      bio: user.bio,
    };
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        tenantId: user.tenantId,
        roles: user.roles,
        name: user.name,
        bio: user.bio,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string, invitationToken?: string) {
    console.log('Registering new user:', email);
    
    // Create user with admin role if no invitation token
    const roles = invitationToken ? ['user'] : ['admin'];
    const user = await this.usersService.create({
      email,
      password,
      roles
    });

    // If no invitation token, create a new tenant for the user
    if (!invitationToken) {
      const tenantName = `${email.split('@')[0]}'s Organization`;
      await this.tenantsService.createTenant({
        name: tenantName,
        adminId: user.id
      });
    }

    // If invitation token exists, accept the invitation
    if (invitationToken) {
      await this.tenantsService.acceptInvitation(invitationToken, user.id);
    }

    console.log('User registered successfully:', { ...user, password: '[REDACTED]' });
    const { password: _, ...result } = user;
    return {
      message: 'Registration successful',
      user: result
    };
  }

  async updateProfile(userId: string, updateData: { name?: string; bio?: string; avatarUrl?: string }) {
    console.log('Updating profile for user:', userId);
    const user = await this.usersService.findOne(userId);
    
    // Update only provided fields
    if (updateData.name !== undefined) user.name = updateData.name;
    if (updateData.bio !== undefined) user.bio = updateData.bio;
    if (updateData.avatarUrl !== undefined) user.avatarUrl = updateData.avatarUrl;
    
    const updatedUser = await this.usersService.update(user);
    console.log('Profile updated successfully:', updatedUser);
    
    const { password: _, ...result } = updatedUser;
    return {
      message: 'Profile updated successfully',
      user: result
    };
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      }, HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Current password is incorrect',
      }, HttpStatus.UNAUTHORIZED);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update({
      ...user,
      password: hashedPassword,
    });
  }
}
