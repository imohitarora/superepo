import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '../tenants/tenant.entity';

@Entity('users')
export class User {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User display name' })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({ example: 'Software engineer passionate about...', description: 'User bio' })
  @Column({ type: 'text', nullable: true })
  bio: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'User avatar URL' })
  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @ApiProperty({ example: ['admin'], description: 'User roles' })
  @Column({ type: 'json', nullable: true })
  roles: string[];

  @Column({ name: 'tenant_id', nullable: true })
  tenantId: string;

  @ManyToOne(() => Tenant, tenant => tenant.users)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    if (!this.roles) {
      this.roles = ['user'];
    }
  }
}
