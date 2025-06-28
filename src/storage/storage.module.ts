import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: undefined, // 메모리에 저장 (Google Cloud Storage로 직접 업로드)
    }),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
