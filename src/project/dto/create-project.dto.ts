import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { CreateFundingOptionDto } from './create-funding-option.dto';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({ description: '프로젝트 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '카테고리' })
  @IsNotEmpty()
  @IsNumber()
  category: number;

  @ApiProperty({ description: '프로젝트 소제목' })
  @IsString()
  @IsNotEmpty()
  subTitle: string;

  @ApiProperty({ description: '프로젝트 설명' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: '프로젝트 시작일', example: '2024-12-31 20:00' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: '프로젝트 종료일', example: '2025-01-01 06:00' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: '예상 참가자 수', example: 150 })
  @IsNumber()
  @Type(() => Number)
  expectedParticipantsCount: number;

  @ApiProperty({ description: '최소 예산', example: 500000 })
  @IsNumber()
  @Type(() => Number)
  minBudget: number;

  @ApiProperty({
    description: '썸네일 URL',
    example: 'https://example.com/thumbnail.png',
  })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({
    type: [CreateFundingOptionDto],
    description: '펀딩 옵션 목록',
  })
  @IsArray()
  fundingOptions: CreateFundingOptionDto[];
}
