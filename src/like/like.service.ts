import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entity/like.entity';
// import { CreateLikeDto } from './dto/create-like.dto';
// import { UpdateLikeDto } from './dto/update-like.dto';

@Injectable()
export class LikeService {
  constructor(@InjectRepository(Like) private likeRepo: Repository<Like>) {}
  // create(createLikeDto: CreateLikeDto) {
  //   return 'This action adds a new like';
  // }

  findAll() {
    return this.likeRepo.find();
  }

  findOne(id: number) {
    return this.likeRepo.findOneBy({ id });
  }

  // update(id: number, updateLikeDto: UpdateLikeDto) {
  //   return `This action updates a #${id} like`;
  // }

  remove(id: number) {
    return this.likeRepo.delete(id);
  }
}
