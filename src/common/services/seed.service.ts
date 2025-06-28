import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { Category } from '../../entities/category.entity';
import { Space, SpaceStatus } from '../../entities/space.entity';
import { Project, ProjectStatus } from '../../entities/project.entity';
import * as fs from 'fs';
import * as path from 'path';

interface MockData {
  users: any[];
  categories: any[];
  spaces: any[];
  projects: any[];
}

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async onModuleInit() {
    this.logger.log('시드 데이터 로딩을 시작합니다...');
    await this.seedData();
  }

  private async seedData() {
    try {
      // mock-data.json 파일 읽기
      const mockDataPath = path.join(process.cwd(), 'mock-data.json');
      const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
      const mockData: MockData = JSON.parse(mockDataContent);

      // 카테고리 시드
      await this.seedCategories(mockData.categories);

      // 사용자 시드
      await this.seedUsers(mockData.users);

      // 공간 시드
      await this.seedSpaces(mockData.spaces);

      // 프로젝트 시드
      await this.seedProjects(mockData.projects);

      this.logger.log('시드 데이터 로딩이 완료되었습니다.');
    } catch (error) {
      this.logger.error('시드 데이터 로딩 중 오류가 발생했습니다:', error);
    }
  }

  private async seedCategories(categories: any[]) {
    for (const categoryData of categories) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { value: categoryData.value },
      });

      if (!existingCategory) {
        const category = this.categoryRepository.create({
          name: categoryData.name,
          description: categoryData.description,
          value: categoryData.value,
        });
        await this.categoryRepository.save(category);
        this.logger.log(
          `카테고리 생성: ${categoryData.name} (${categoryData.value})`,
        );
      } else {
        this.logger.log(
          `카테고리 이미 존재: ${categoryData.name} (${categoryData.value})`,
        );
      }
    }
  }

  private async seedUsers(users: any[]) {
    for (const userData of users) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = this.userRepository.create({
          email: userData.email,
          provider: userData.provider,
          providerId: userData.providerId,
          name: userData.name,
          phone: userData.phone,
          role: userData.role as UserRole,
        });
        await this.userRepository.save(user);
        this.logger.log(`사용자 생성: ${userData.name} (${userData.email})`);
      } else {
        this.logger.log(`사용자 이미 존재: ${userData.email}`);
      }
    }
  }

  private async seedSpaces(spaces: any[]) {
    for (const spaceData of spaces) {
      const existingSpace = await this.spaceRepository.findOne({
        where: { name: spaceData.name },
      });

      if (!existingSpace) {
        // 소유자 찾기
        const owner = await this.userRepository.findOne({
          where: { id: spaceData.ownerId },
        });

        if (owner) {
          const space = this.spaceRepository.create({
            name: spaceData.name,
            description: spaceData.description,
            location: spaceData.location,
            address: spaceData.address,
            capacity: spaceData.capacity,
            pricePerHour: spaceData.pricePerHour,
            status: spaceData.status as SpaceStatus,
          });
          await this.spaceRepository.save(space);
          this.logger.log(`공간 생성: ${spaceData.name}`);
        } else {
          this.logger.warn(`소유자를 찾을 수 없음 (ID: ${spaceData.ownerId})`);
        }
      } else {
        this.logger.log(`공간 이미 존재: ${spaceData.name}`);
      }
    }
  }

  private async seedProjects(projects: any[]) {
    for (const projectData of projects) {
      const existingProject = await this.projectRepository.findOne({
        where: { title: projectData.title },
      });

      if (!existingProject) {
        // 생성자 찾기
        const creator = await this.userRepository.findOne({
          where: { id: projectData.creatorId },
        });

        // 공간 찾기 (있는 경우)
        let space = null;
        if (projectData.spaceId) {
          space = await this.spaceRepository.findOne({
            where: { id: projectData.spaceId },
          });
        }

        // 카테고리 찾기
        const category = await this.categoryRepository.findOne({
          where: { id: projectData.categoryId },
        });

        if (creator && category) {
          const project = this.projectRepository.create({
            creator,
            space,
            title: projectData.title,
            subTitle: projectData.subTitle,
            description: projectData.description,
            startDate: new Date(projectData.startDate),
            endDate: new Date(projectData.endDate),
            minBudget: projectData.minBudget,
            thumbnailUrl: projectData.thumbnailUrl,
            expectedParticipantsCount: projectData.expectedParticipantsCount,
            status: projectData.status as ProjectStatus,
            category,
          });
          await this.projectRepository.save(project);
          this.logger.log(`프로젝트 생성: ${projectData.title}`);
        } else {
          this.logger.warn(
            `생성자 또는 카테고리를 찾을 수 없음 (프로젝트: ${projectData.title})`,
          );
        }
      } else {
        this.logger.log(`프로젝트 이미 존재: ${projectData.title}`);
      }
    }
  }
}
