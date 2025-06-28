import { ApiProperty } from '@nestjs/swagger';

export class GeminiResponseDto {
  @ApiProperty({
    description: 'Gemini의 응답 텍스트',
    example: '안녕하세요! 오늘 날씨에 대해 이야기해드릴게요...',
  })
  text: string;

  @ApiProperty({
    description: '응답 생성 시간',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;
}

export class GeminiImageGenerationResponseDto {
  @ApiProperty({
    description: 'Gemini의 응답 텍스트',
    example: '요청하신 이미지를 생성했습니다.',
  })
  text: string;

  @ApiProperty({
    description: '생성된 이미지의 Base64 데이터',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  imageBase64: string;

  @ApiProperty({
    description: '응답 생성 시간',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;
}

export class GeminiEventThumbnailResponseDto {
  @ApiProperty({
    description: 'Gemini의 응답 텍스트',
    example: '요청하신 이미지를 생성했습니다.',
  })
  text: string;

  @ApiProperty({
    description: '생성된 이미지의 Base64 데이터',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  imageBase64: string;

  @ApiProperty({
    description: '생성된 이미지의 URL',
    example:
      'https://oiso-storage.storage.googleapis.com/thumbnails/1234567890.png',
  })
  imageUrl: string;

  @ApiProperty({
    description: '응답 생성 시간',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;
}

export class GeminiErrorResponseDto {
  @ApiProperty({
    description: '에러 메시지',
    example: 'Gemini API 오류: API 키가 유효하지 않습니다.',
  })
  message: string;

  @ApiProperty({
    description: '에러 발생 시간',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;
}
