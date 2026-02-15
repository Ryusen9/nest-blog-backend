import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PAGE_SIZE, DEFAULT_SKIP } from 'src/constants/constant';
import { PaginationDto } from 'src/global-dto/pagination.dto';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQueryDto } from './dto/query.dto';
import { SortingDataDto } from './dto/sortingdata.dto';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}
  create(createPostDto: CreatePostDto) {
    const post = this.postRepo.create(createPostDto);
    return this.postRepo.save(post);
  }

  findAll(
    paginationDto: PaginationDto,
    queryDto?: PostQueryDto,
    sortingDataDto?: SortingDataDto,
  ) {
    const sortColumns: Record<string, string> = {
      id: 'post.id',
      slug: 'post.slug',
      title: 'post.title',
      published: 'post.published',
      createdAt: 'post.createdAt',
      updatedAt: 'post.updatedAt',
    };

    const query = this.postRepo
      .createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoinAndSelect('post.tags', 'tag')

      // Count likes instead of loading them
      .loadRelationCountAndMap('post.likesCount', 'post.likes')

      // Count comments instead of loading them
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')

      // Select only needed user fields
      .select(['post', 'tag', 'user.id', 'user.email', 'user.firstName'])
      .skip(paginationDto.skip ?? DEFAULT_SKIP)
      .take(paginationDto.take ?? DEFAULT_PAGE_SIZE);

    if (queryDto?.published !== undefined) {
      query.andWhere('post.published = :published', {
        published: queryDto.published,
      });
    }
    if (queryDto?.selectedTag) {
      query.andWhere('tag.name = :tagName', { tagName: queryDto.selectedTag });
    }
    const sortBy = sortingDataDto?.sortBy;
    const sortOrder = sortingDataDto?.sortOrder ?? 'DESC';
    const sortColumn = sortBy ? sortColumns[sortBy] : undefined;

    const typeOrmSortOrder: 'ASC' | 'DESC' =
      sortOrder === 'ASC' ? 'ASC' : 'DESC';

    if (sortColumn) {
      query.orderBy(sortColumn, typeOrmSortOrder);
    } else {
      query.orderBy('post.createdAt', 'DESC');
    }
    return query.getMany();
  }

  findOne(slug: string) {
    return this.postRepo.findOne({
      where: { slug },
      relations: {
        user: true,
        tags: true,
        likes: true,
        comments: true,
      },
    });
  }

  PostCount() {
    return this.postRepo.count();
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postRepo.update(id, updatePostDto);
  }

  remove(id: number) {
    return this.postRepo.delete(id);
  }
}
