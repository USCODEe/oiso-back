import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetSpaceListtDto extends PaginationDto {
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
