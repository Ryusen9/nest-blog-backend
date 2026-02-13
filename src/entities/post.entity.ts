import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from './tag.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { User } from './user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Column()
  content: string;

  @Column()
  thumbnail: string;

  @Column()
  published: boolean;

  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: true })
  @JoinTable({ name: 'post_tags' })
  tags: Tag[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
