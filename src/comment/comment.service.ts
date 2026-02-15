import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}
  create(createCommentDto: CreateCommentDto) {
    const comment = this.commentRepo.create(createCommentDto);
    return this.commentRepo.save(comment);
  }

  findAll() {
    return this.commentRepo.find();
  }

  commentCount() {
    return this.commentRepo.count();
  }

  findOne(id: number) {
    return this.commentRepo.findOne({
      where: { id },
      relations: {
        user: true,
        post: true,
      },
      select: {
        user: {
          id: true,
          firstName: true,
          email: true,
        },
        post: {
          id: true,
          title: true,
        },
      },
    });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentRepo.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentRepo.delete(id);
  }
}
