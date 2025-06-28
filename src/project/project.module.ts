import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { FundingOption } from 'src/entities/funding-option.entity';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, FundingOption]), StorageModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
