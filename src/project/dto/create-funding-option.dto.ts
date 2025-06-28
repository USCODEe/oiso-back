import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFundingOptionDto {
  @ApiProperty({ description: '펀딩 옵션명' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '펀딩 옵션 설명' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: '금액' })
  @IsNumber()
  amount: number;
}
