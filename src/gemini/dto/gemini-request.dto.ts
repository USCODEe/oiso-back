import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class GeminiTextRequestDto {
  @ApiProperty({
    description: 'Gemini에게 보낼 텍스트 프롬프트',
    example: '안녕하세요! 오늘 날씨에 대해 이야기해주세요.',
  })
  @IsString()
  prompt: string;
}

export class GeminiChatRequestDto {
  @ApiProperty({
    description: 'Gemini에게 보낼 텍스트 프롬프트',
    example: '안녕하세요! 오늘 날씨에 대해 이야기해주세요.',
  })
  @IsString()
  prompt: string;

  @ApiProperty({
    description: '대화 히스토리',
    example: [
      { role: 'user', parts: '안녕하세요' },
      { role: 'model', parts: '안녕하세요! 무엇을 도와드릴까요?' },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  history?: Array<{ role: 'user' | 'model'; parts: string }>;
}

export class GeminiImageRequestDto {
  @ApiProperty({
    description: 'Base64로 인코딩된 이미지 데이터',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
  })
  @IsString()
  imageBase64: string;
}

export class GeminiImageGenerationRequestDto {
  @ApiProperty({
    description: '이미지 생성을 위한 프롬프트',
    example: '3D 렌더링된 날개 달린 돼지가 미래적인 도시 위를 날아가는 모습',
  })
  @IsString()
  prompt: string;
}
