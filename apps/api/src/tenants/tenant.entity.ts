import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tenants')
export class Tenant {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'My Company', description: 'Tenant name' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Active', description: 'Tenant status' })
  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => User, user => user.tenant)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
