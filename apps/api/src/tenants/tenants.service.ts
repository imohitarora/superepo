import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
  ) {}

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

  async createInvitation(dto: CreateInvitationDto): Promise<Invitation> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email }
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Create invitation
    const invitationToken = uuidv4();
    console.log('Creating invitation with token:', invitationToken);
    
    const invitation = this.invitationsRepository.create({
      email: dto.email,
      tenantId: dto.tenantId,
      inviterId: dto.inviterId,
      token: invitationToken,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    const savedInvitation = await this.invitationsRepository.save(invitation);
    console.log('Created invitation:', savedInvitation);
    return savedInvitation;
  }

  async acceptInvitation(token: string, userId: string): Promise<void> {
    const invitation = await this.invitationsRepository.findOne({
      where: { token, status: 'pending' }
    });

    if (!invitation || invitation.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired invitation');
    }

    // Update user with tenant ID
    await this.usersRepository.update(userId, {
      tenantId: invitation.tenantId,
      roles: ['user']
    });

    // Update invitation status
    await this.invitationsRepository.update(invitation.id, {
      status: 'accepted'
    });
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
}
