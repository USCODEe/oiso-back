import { ApiProperty } from '@nestjs/swagger';

export class UploadImageResponseDto {
  @ApiProperty({
    description: '업로드된 이미지의 공개 URL',
    example:
      'https://storage.googleapis.com/oiso-storage/images/uuid-filename.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Google Cloud Storage에 저장된 파일명',
    example: 'images/uuid-filename.jpg',
  })
  filename: string;
}

export class ImageInfoDto {
  @ApiProperty({
    description: '파일명',
    example: 'images/uuid-filename.jpg',
  })
  name: string;

  @ApiProperty({
    description: '이미지 URL',
    example:
      'https://storage.googleapis.com/oiso-storage/images/uuid-filename.jpg',
  })
  url: string;

  @ApiProperty({
    description: '파일 크기 (bytes)',
    example: 1024000,
  })
  size: number;

  @ApiProperty({
    description: '마지막 수정 시간',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated: Date;
}

export class DeleteImageResponseDto {
  @ApiProperty({
    description: '삭제 결과 메시지',
    example: '이미지가 성공적으로 삭제되었습니다.',
  })
  message: string;
}
