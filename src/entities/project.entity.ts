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
import { Space } from './space.entity';
import { Reservation } from './reservation.entity';
import { Review } from './review.entity';
import { Funding } from './funding.entity';
import { Category } from './category.entity';
import { FundingOption } from './funding-option.entity';

export enum ProjectStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.projects)
  creator: User;

  @ManyToOne(() => Space, (space) => space.projects, { nullable: true })
  space: Space;

  @Column()
  title: string;

  @Column()
  subTitle: string;

  @Column('text')
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  expectedParticipantsCount: number;

  @Column()
  minBudget: number;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.DRAFT })
  status: ProjectStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.project)
  reservations: Reservation[];

  @OneToMany(() => Review, (review) => review.project)
  reviews: Review[];

  @OneToMany(() => Funding, (funding) => funding.project)
  fundings: Funding[];

  @OneToMany(() => FundingOption, (fundingOption) => fundingOption.project)
  fundingOptions: FundingOption[];

  @ManyToOne(() => Category, (category) => category.projects)
  category: Category;
}
