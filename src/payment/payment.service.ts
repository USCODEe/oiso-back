import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from 'src/entities/payment-history.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { FundingOption } from 'src/entities/funding-option.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Funding)
    private readonly fundingRepository: Repository<Funding>,
    @InjectRepository(FundingOption)
    private readonly fundingOptionRepository: Repository<FundingOption>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { fundingOptionId, method } = createPaymentDto;

      console.log('[PaymentService] 1. 펀딩옵션 조회 시작:', fundingOptionId);
      const fundingOption = await queryRunner.manager.findOne(FundingOption, {
        where: { id: fundingOptionId },
        relations: ['project'],
      });
      if (!fundingOption) {
        console.error(
          '[PaymentService] 1. 펀딩옵션을 찾을 수 없음:',
          fundingOptionId,
        );
        throw new NotFoundException('Funding option not found');
      }
      console.log('[PaymentService] 1. 펀딩옵션 조회 성공:', fundingOption);

      console.log('[PaymentService] 2. 유저 조회 시작:', userId);
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      if (!user) {
        console.error('[PaymentService] 2. 유저를 찾을 수 없음:', userId);
        throw new NotFoundException('User not found');
      }
      console.log('[PaymentService] 2. 유저 조회 성공:', user);

      // 3. 중복 펀딩 체크
      console.log('[PaymentService] 3. 중복 펀딩 체크');
      const existingFunding = await queryRunner.manager.findOne(Funding, {
        where: {
          user: { id: user.id },
          project: { id: fundingOption.project.id },
        },
      });
      if (existingFunding) {
        console.error('[PaymentService] 3. 중복 펀딩 감지:', existingFunding);
        throw new BadRequestException(
          '중복 참여는 불가능합니다. 결제 취소 후, 다시 이용해주세요',
        );
      }

      // 4. Funding 생성
      console.log('[PaymentService] 4. 펀딩(Funding) 생성 시작');
      const funding = queryRunner.manager.create(Funding, {
        user,
        project: fundingOption.project,
        fundingOption,
        paidAt: new Date(),
      });
      await queryRunner.manager.save(funding);
      console.log(
        '[PaymentService] 4. 펀딩(Funding) 생성 및 저장 성공:',
        funding,
      );

      // 5. 결제(Payment) 생성
      console.log('[PaymentService] 5. 결제(Payment) 생성 시작');
      const payment = this.paymentRepository.create({
        fundingOption,
        funding,
        method,
        amount: fundingOption.amount,
        status: 'success',
        paidAt: new Date(),
        user,
      });
      await queryRunner.manager.save(payment);
      console.log(
        '[PaymentService] 5. 결제(Payment) 생성 및 저장 성공:',
        payment,
      );

      await queryRunner.commitTransaction();
      console.log('[PaymentService] 6. 트랜잭션 커밋 완료');
      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('[PaymentService] 트랜잭션 롤백:', error.message);
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
      console.log('[PaymentService] 쿼리러너 해제');
    }
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
