import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Space } from './space.entity';
import { Project } from './project.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviews)
  author: User;

  @ManyToOne(() => Space, (space) => space.reviews)
  space: Space;

  @ManyToOne(() => Project, (project) => project.reviews, { nullable: true })
  project: Project;

  @Column()
  rating: number;

  @Column('text')
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
