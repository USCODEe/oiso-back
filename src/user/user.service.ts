import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, provider, providerId } = createUserDto;

    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newUser = this.usersRepository.create({
      email,
      name,
      provider,
      providerId,
    });

    await this.usersRepository.save(newUser);
    return newUser;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: [
        'projects',
        'reservations',
        'reviews',
        'fundings',
        'fundings.payments',
        'projects.fundings',
        'projects.fundings.payments',
        'fundings.project',
      ],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
