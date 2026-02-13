import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
// import { CreateCommentDto } from './dto/create-comment.dto';
// import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}
  // create(createCommentDto: CreateCommentDto) {
  //   return 'This action adds a new comment';
  // }

  findAll() {
    return this.commentRepo.find();
  }

  findOne(id: number) {
    return this.commentRepo.findOneBy({ id });
  }

  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
