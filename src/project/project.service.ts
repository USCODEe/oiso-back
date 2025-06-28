import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from 'src/entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { GetProjecListtDto } from './dto/get-project-list.dto';
import { StorageService } from 'src/storage/storage.service';
import { FundingOption } from 'src/entities/funding-option.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private storageService: StorageService,
    @InjectRepository(FundingOption)
    private fundingOptionRepository: Repository<FundingOption>,
    private dataSource: DataSource,
  ) {}
  async create(createProjectDto: CreateProjectDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 프로젝트 생성
      const { fundingOptions, ...projectData } = createProjectDto;

      const project = this.projectRepository.create({
        ...projectData,
        creator: user,
        category: { id: createProjectDto.category },
      });
      const savedProject = await queryRunner.manager.save(project);

      // 2. 펀딩 옵션 생성
      if (fundingOptions && fundingOptions.length > 0) {
        for (const option of fundingOptions) {
          const fundingOption = this.fundingOptionRepository.create({
            ...option,
            project: savedProject,
          });
          await queryRunner.manager.save(fundingOption);
        }
      }

      console.log(savedProject);
      await queryRunner.commitTransaction();
      return savedProject;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('프로젝트 생성 중 오류 발생');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(queryParams: GetProjecListtDto) {
    const { page, size, category, column, value } = queryParams;
    const [projects, total] = await this.projectRepository.findAndCount({
      skip: Math.max(0, (page - 1) * size),
      take: size,
      where: {
        category: category ? { value: category } : undefined,
        [column]: value ? Like(`%${value}%`) : undefined,
      },
      relations: ['fundings', 'fundings.payments', 'fundings.user', 'category'],
      order: {
        createdAt: 'DESC',
      },
    });

    // 각 프로젝트별로 fundingCount, totalAmount 계산
    const list = projects.map((project) => {
      const fundingCount = project.fundings.length;
      const totalAmount = project.fundings.reduce((sum, funding) => {
        if (funding.payments && funding.payments.length > 0) {
          return (
            sum +
            funding.payments.reduce(
              (paySum, payment) => paySum + Number(payment.amount ?? 0),
              0,
            )
          );
        }
        return sum;
      }, 0);

      return {
        ...project,
        fundingCount,
        totalAmount,
      };
    });

    return { list, total, page, size };
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: [
        'fundingOptions',
        'fundings',
        'fundings.user',
        'fundings.payments',
        'category',
      ],
    });

    if (!project) {
      throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
    }
    // fundings.payments의 amount 합계 구하기
    const totalAmount = project.fundings.reduce((sum, funding) => {
      if (funding.payments && funding.payments.length > 0) {
        // 각 펀딩의 모든 결제내역의 amount를 합산
        const paymentsSum = funding.payments.reduce(
          (paySum, payment) => paySum + Number(payment.amount ?? 0),
          0,
        );
        return sum + paymentsSum;
      }
      return sum;
    }, 0);
    // fundings의 개수 구하기
    const fundingCount = project.fundings.length;

    return {
      ...project,
      totalAmount,
      fundingCount,
    };
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
