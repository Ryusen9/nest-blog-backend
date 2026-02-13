import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PAGE_SIZE, DEFAULT_SKIP } from 'src/constants/constant';
import { PaginationDto } from 'src/global-dto/pagination.dto';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}
  // create(createPostDto: CreatePostDto) {
  //   return 'This action adds a new post';
  // }

  findAll(paginationDto: PaginationDto) {
    return (
      this.postRepo
        .createQueryBuilder('post')
        .leftJoin('post.user', 'user')
        .leftJoinAndSelect('post.tags', 'tag')

        // Count likes instead of loading them
        .loadRelationCountAndMap('post.likesCount', 'post.likes')

        // Count comments instead of loading them
        .loadRelationCountAndMap('post.commentsCount', 'post.comments')

        // Select only needed user fields
        .select(['post', 'tag', 'user.id', 'user.email'])

        .skip(paginationDto.skip ?? DEFAULT_SKIP)
        .take(paginationDto.take ?? DEFAULT_PAGE_SIZE)

        .getMany()
    );
  }

  findOne(id: number) {
    return this.postRepo.findOne({
      where: { id },
      relations: {
        user: true,
        tags: true,
        likes: true,
        comments: true,
      },
    });
  }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  remove(id: number) {
    return this.postRepo.delete(id);
  }
}
