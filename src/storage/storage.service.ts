import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { buffer } from 'stream/consumers';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });
    this.bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || 'oiso-storage';
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ url: string; filename: string }> {
    try {
      if (!file) {
        throw new BadRequestException('파일이 제공되지 않았습니다.');
      }

      // 파일 타입 검증
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('이미지 파일만 업로드 가능합니다.');
      }

      // 파일 크기 검증 (10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException('파일 크기는 10MB를 초과할 수 없습니다.');
      }

      const bucket = this.storage.bucket(this.bucketName);
      const filename = `images/${uuidv4()}-${file.originalname}`;
      const fileBuffer = file.buffer;

      const fileUpload = bucket.file(filename);
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
          reject(new BadRequestException(`파일 업로드 실패: ${error.message}`));
        });

        stream.on('finish', async () => {
          // 파일을 공개로 설정 (Uniform Bucket-Level Access가 OFF일 때만 동작)
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filename}`;
          resolve({
            url: publicUrl,
            filename: filename,
          });
        });

        stream.end(fileBuffer);
      });
    } catch (error) {
      throw new BadRequestException(`이미지 업로드 실패: ${error.message}`);
    }
  }

  async getImageUrl(filename: string): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filename);

      const [exists] = await file.exists();
      if (!exists) {
        throw new NotFoundException('파일을 찾을 수 없습니다.');
      }

      // 서명된 URL 생성 (1시간 유효)
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 1시간
      });

      return signedUrl;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`이미지 URL 조회 실패: ${error.message}`);
    }
  }

  async getPublicImageUrl(filename: string): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filename);

      const [exists] = await file.exists();
      if (!exists) {
        throw new NotFoundException('파일을 찾을 수 없습니다.');
      }

      // 공개 URL 반환 (버킷이 공개로 설정되어 있어야 함)
      return `https://storage.googleapis.com/${this.bucketName}/${filename}`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`이미지 URL 조회 실패: ${error.message}`);
    }
  }

  async uploadBase64Image(
    base64: string,
  ): Promise<{ url: string; fileName: string }> {
    const fileName = `thumbnails/${uuidv4()}.png`;
    const file = this.storage.bucket(this.bucketName).file(fileName);
    const buffer = Buffer.from(base64, 'base64');
    await file.save(buffer, {
      contentType: 'image/png',
      public: true, // 버킷이 공개라면 이 옵션만으로도 공개됨
      resumable: false,
    });
    const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    return { url: publicUrl, fileName };
  }

  async uploadBase64ImageAndGetSignedUrl(
    base64: string,
  ): Promise<{ signedUrl: string; fileName: string }> {
    const storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });
    const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || 'oiso-storage';
    const buffer = Buffer.from(base64, 'base64');
    const fileName = `thumbnails/${uuidv4()}.png`;
    const file = storage.bucket(bucketName).file(fileName);

    await file.save(buffer, {
      contentType: 'image/png',
      resumable: false,
    });

    // 서명된 URL 생성 (예: 1시간 유효)
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1시간
    });

    return { signedUrl, fileName };
  }

  async deleteImage(filename: string): Promise<{ message: string }> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filename);

      const [exists] = await file.exists();
      if (!exists) {
        throw new NotFoundException('파일을 찾을 수 없습니다.');
      }

      await file.delete();

      return { message: '이미지가 성공적으로 삭제되었습니다.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`이미지 삭제 실패: ${error.message}`);
    }
  }

  async listImages(
    prefix: string = 'images/',
  ): Promise<{ name: string; url: string; size: number; updated: Date }[]> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const [files] = await bucket.getFiles({ prefix });

      const imageFiles = await Promise.all(
        files.map(async (file) => {
          const [metadata] = await file.getMetadata();
          return {
            name: file.name,
            url: `https://storage.googleapis.com/${this.bucketName}/${file.name}`,
            size: parseInt(String(metadata.size || '0')),
            updated: new Date(metadata.updated),
          };
        }),
      );

      return imageFiles;
    } catch (error) {
      throw new BadRequestException(`이미지 목록 조회 실패: ${error.message}`);
    }
  }

  // 기존 CRUD 메서드들 (필요시 수정)
  create(createStorageDto: CreateStorageDto) {
    return 'This action adds a new storage';
  }

  findAll() {
    return `This action returns all storage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storage`;
  }

  update(id: number, updateStorageDto: UpdateStorageDto) {
    return `This action updates a #${id} storage`;
  }

  remove(id: number) {
    return `This action removes a #${id} storage`;
  }
}
