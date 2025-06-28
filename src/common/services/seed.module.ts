import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../../entities/user.entity';
import { Category } from '../../entities/category.entity';
import { Space } from '../../entities/space.entity';
import { Project } from '../../entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Space, Project])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
