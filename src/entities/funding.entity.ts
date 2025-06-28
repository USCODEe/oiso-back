import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { FundingOption } from './funding-option.entity';
import { Payment } from './payment-history.entity';

@Entity('funding')
export class Funding {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.fundings)
  user: User;

  @ManyToOne(() => Project, (project) => project.fundings)
  project: Project;

  @ManyToOne(() => FundingOption, (fundingOption) => fundingOption.fundings)
  fundingOption: FundingOption;

  @OneToMany(() => Payment, (payment) => payment.funding)
  payments: Payment[];

  @CreateDateColumn()
  paidAt: Date;
}
