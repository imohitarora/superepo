import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('invitations')
export class Invitation {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'Invited email address' })
  @Column()
  email: string;

  @ApiProperty({ example: 'pending', description: 'Invitation status' })
  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ type: 'uuid' })
  inviterId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inviterId' })
  inviter: User;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
