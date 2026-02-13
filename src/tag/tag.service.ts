import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entity/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepo: Repository<Tag>) {}
  create(createTagDto: CreateTagDto) {
    const tag = this.tagRepo.create(createTagDto);
    return this.tagRepo.save(tag);
  }

  findAll() {
    return this.tagRepo.find();
  }

  findOne(id: number) {
    return this.tagRepo.findOneBy({ id });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.tagRepo.update(id, updateTagDto);
  }

  remove(id: number) {
    return this.tagRepo.delete(id);
  }
}
