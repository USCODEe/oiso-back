import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { Reservation } from './reservation.entity';
import { Review } from './review.entity';
import { SpaceType } from './space-type.entity';

export enum SpaceStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  HIDDEN = 'hidden',
  CLOSED = 'closed',
}

@Entity('space')
export class Space {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column()
  address: string;

  @Column()
  capacity: number;

  @Column({ default: false })
  isBooked: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerHour: number;

  @Column({ type: 'enum', enum: SpaceStatus, default: SpaceStatus.AVAILABLE })
  status: SpaceStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.space)
  projects: Project[];

  @OneToMany(() => Reservation, (reservation) => reservation.space)
  reservations: Reservation[];

  @OneToMany(() => Review, (review) => review.space)
  reviews: Review[];

  @ManyToOne(() => SpaceType, (type) => type.spaces, { nullable: true })
  type: SpaceType;
}
