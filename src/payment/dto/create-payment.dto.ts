import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: '펀딩 옵션 ID', example: 1 })
  @IsNumber()
  fundingOptionId: number;

  @ApiProperty({ description: '결제 방법', example: 'card' })
  @IsString()
  method: string;
}
