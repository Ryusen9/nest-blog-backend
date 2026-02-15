import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Post } from 'src/post/entity/post.entity';
import { Like } from 'src/like/entity/like.entity';
import { Comment } from 'src/comment/entity/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  bio: string;

  @Column()
  avatarUrl: string;

  @Column()
  role: string;

  @Column()
  password: string;

  // Refresh token hash is stored only while a session is active.
  @Column({ nullable: true })
  hashedRefreshToken?: string;

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user, { cascade: true })
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
