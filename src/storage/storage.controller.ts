import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import {
  UploadImageResponseDto,
  ImageInfoDto,
  DeleteImageResponseDto,
} from './dto/upload-image.dto';

@ApiTags('Storage')
@Controller('storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({ summary: '이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '업로드할 이미지 파일',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '이미지 업로드 성공',
    type: UploadImageResponseDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|gif|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadImageResponseDto> {
    return this.storageService.uploadImage(file);
  }

  @Get('images')
  @ApiOperation({ summary: '이미지 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '이미지 목록 조회 성공',
    type: [ImageInfoDto],
  })
  async listImages(): Promise<ImageInfoDto[]> {
    return this.storageService.listImages();
  }

  @Get('images/:filename')
  @ApiOperation({ summary: '이미지 URL 조회 (서명된 URL)' })
  @ApiResponse({
    status: 200,
    description: '이미지 URL 조회 성공',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example:
            'https://storage.googleapis.com/oiso-storage/images/uuid-filename.jpg?X-Goog-Algorithm=...',
        },
      },
    },
  })
  async getImageUrl(
    @Param('filename') filename: string,
  ): Promise<{ url: string }> {
    const url = await this.storageService.getImageUrl(filename);
    return { url };
  }

  @Get('public/images/:filename')
  @ApiOperation({ summary: '공개 이미지 URL 조회' })
  @ApiResponse({
    status: 200,
    description: '공개 이미지 URL 조회 성공',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example:
            'https://storage.googleapis.com/oiso-storage/images/uuid-filename.jpg',
        },
      },
    },
  })
  async getPublicImageUrl(
    @Param('filename') filename: string,
  ): Promise<{ url: string }> {
    const url = await this.storageService.getPublicImageUrl(filename);
    return { url };
  }

  @Delete('images/:filename')
  @ApiOperation({ summary: '이미지 삭제' })
  @ApiResponse({
    status: 200,
    description: '이미지 삭제 성공',
    type: DeleteImageResponseDto,
  })
  async deleteImage(
    @Param('filename') filename: string,
  ): Promise<DeleteImageResponseDto> {
    return this.storageService.deleteImage(filename);
  }

  @Post()
  create(@Body() createStorageDto: CreateStorageDto) {
    return this.storageService.create(createStorageDto);
  }

  @Get()
  findAll() {
    return this.storageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStorageDto: UpdateStorageDto) {
    return this.storageService.update(+id, updateStorageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageService.remove(+id);
  }
}
