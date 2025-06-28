import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Space } from 'src/entities/space.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { GetSpaceListtDto } from './dto/get-space-list.dto';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
  ) {}

  create(createSpaceDto: CreateSpaceDto) {
    return 'This action adds a new space';
  }

  async findAll(queryParams: GetSpaceListtDto) {
    const { page, size, column, value } = queryParams;
    const [spaces, total] = await this.spaceRepository.findAndCount({
      skip: Math.max(0, (page - 1) * size),
      take: size,
      where: {
        [column]: value ? Like(`%${value}%`) : undefined,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return { list: spaces, total, page, size };
  }

  async findOne(id: number) {
    const space = await this.spaceRepository.findOne({
      where: { id },
      relations: ['projects'],
    });
    return space;
  }

  update(id: number, updateSpaceDto: UpdateSpaceDto) {
    return `This action updates a #${id} space`;
  }

  remove(id: number) {
    return `This action removes a #${id} space`;
  }
}
