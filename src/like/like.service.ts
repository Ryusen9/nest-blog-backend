import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entity/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(@InjectRepository(Like) private likeRepo: Repository<Like>) {}
  create(createLikeDto: CreateLikeDto) {
    const like = this.likeRepo.create(createLikeDto);
    return this.likeRepo.save(like);
  }

  findAll() {
    return this.likeRepo.find();
  }

  findOne(id: number) {
    return this.likeRepo.findOne({
      where: { id },
      relations: { post: true, user: true },
      select: {
        post: {
          id: true,
        },
        user: { id: true },
      },
    });
  }

  remove(id: number) {
    return this.likeRepo.delete(id);
  }
}
