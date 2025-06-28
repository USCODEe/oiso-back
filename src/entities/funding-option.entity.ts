import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { Funding } from './funding.entity';
import { Payment } from './payment-history.entity';

@Entity('funding_option')
export class FundingOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Project, (project) => project.fundingOptions)
  project: Project;

  @OneToMany(() => Funding, (funding) => funding.fundingOption)
  fundings: Funding[];

  @OneToMany(() => Payment, (payment) => payment.fundingOption)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
