import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Funding } from './funding.entity';
import { FundingOption } from './funding-option.entity';
import { User } from './user.entity';

@Entity('payment_history')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Funding, (funding) => funding.payments)
  funding: Funding;

  @ManyToOne(() => FundingOption, (fundingOption) => fundingOption.payments)
  fundingOption: FundingOption;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Column()
  method: string; // 예: '카드', '계좌이체', '카카오페이' 등

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  transactionId: string; // PG사 거래번호 등

  @Column({ default: 'success' })
  status: string; // 예: 'success', 'fail', 'pending'

  @CreateDateColumn()
  paidAt: Date;
}
