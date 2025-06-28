import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment-history.entity';
import { Funding } from 'src/entities/funding.entity';
import { FundingOption } from 'src/entities/funding-option.entity';
import { User } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Funding, FundingOption, User])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
