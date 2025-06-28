import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Space } from './space.entity';
import { Project } from './project.entity';
import { Reservation } from './reservation.entity';
import { Review } from './review.entity';
import { Funding } from './funding.entity';
import { IsOptional } from 'class-validator';
import { Payment } from './payment-history.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  provider: string;

  @Column()
  providerId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.creator)
  projects: Project[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @OneToMany(() => Review, (review) => review.author)
  reviews: Review[];

  @OneToMany(() => Funding, (funding) => funding.user)
  fundings: Funding[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
