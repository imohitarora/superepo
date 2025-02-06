import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    console.log('Looking up user by email:', email);
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['tenant'],
    });
    console.log('Found user:', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    console.log('Creating user with email:', userData.email);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);
    console.log('Created user:', { ...savedUser, password: '[REDACTED]' });
    return savedUser;
  }

  async findByTenant(tenantId: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { tenantId },
      select: ['id', 'email', 'roles', 'createdAt'],
    });
  }

  async updateRoles(userId: string, roles: string[]): Promise<User> {
    await this.usersRepository.update(userId, { roles });
    return this.findOne(userId);
  }

  async update(user: User): Promise<User> {
    await this.usersRepository.save(user);
    return this.findOne(user.id);
  }
}
