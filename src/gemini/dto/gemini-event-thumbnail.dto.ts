import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class GeminiEventThumbnailRequestDto {
  @ApiProperty({
    description: '카테고리',
    example: '카테고리',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Gemini에게 보낼 타이틀',
    example: '안녕하세요! 오늘 날씨에 대해 이야기해주세요.',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Gemini에게 보낼 설명',
    example: '안녕하세요! 오늘 날씨에 대해 이야기해주세요.',
  })
  @IsString()
  description: string;
}
