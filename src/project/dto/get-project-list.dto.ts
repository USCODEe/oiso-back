import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetProjecListtDto extends PaginationDto {
  @ApiProperty({
    description: '카테고리',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: '검색 컬럼',
    required: false,
  })
  @IsOptional()
  @IsString()
  column?: string;

  @ApiProperty({
    description: '검색 값',
    required: false,
  })
  @IsOptional()
  @IsString()
  value?: string;
}
