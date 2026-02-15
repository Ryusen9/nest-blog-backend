import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    const comparePasswordsFn = compare as (
      data: string | Buffer,
      encrypted: string,
    ) => Promise<boolean>;
    return comparePasswordsFn(plainText, hashed);
  }

  async findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async setCurrentRefreshToken(userId: number, refreshToken: string) {
    // Store only a hashed refresh token to reduce credential leakage risk.
    const hashed = await hash(refreshToken, 10);
    await this.userRepo.update(userId, { hashedRefreshToken: hashed });
  }

  async removeRefreshToken(userId: number) {
    await this.userRepo.update(userId, { hashedRefreshToken: undefined });
  }

  async isRefreshTokenValid(userId: number, refreshToken: string) {
    const user = await this.findById(userId);
    if (!user?.hashedRefreshToken) return false;
    return compare(refreshToken, user.hashedRefreshToken);
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  userCount() {
    return this.userRepo.count();
  }

  findOne(id: number) {
    return this.userRepo.findOne({
      where: { id },
      relations: {
        posts: true,
        likes: true,
        comments: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }
}
