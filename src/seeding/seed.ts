import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { AppModule } from '../app.module';
import { Tag } from 'src/tag/entity/tag.entity';
import { User } from 'src/user/entity/user.entity';
import { Post } from 'src/post/entity/post.entity';
import { Comment } from 'src/comment/entity/comment.entity';
import { Like } from 'src/like/entity/like.entity';

const TOTAL_USERS = 20;
const TOTAL_POSTS = 70;
const TOTAL_TAGS = 8;
const randomInt = (min: number, max: number) => faker.number.int({ min, max });

const slugify = (value: string) =>
  faker.helpers
    .slugify(value)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await dataSource.query(
      'TRUNCATE TABLE "comment", "like", "post_tags", "post", "tag", "user" RESTART IDENTITY CASCADE',
    );

    const tagRepo = dataSource.getRepository(Tag);
    const userRepo = dataSource.getRepository(User);
    const postRepo = dataSource.getRepository(Post);
    const commentRepo = dataSource.getRepository(Comment);
    const likeRepo = dataSource.getRepository(Like);

    const tags = tagRepo.create(
      Array.from({ length: TOTAL_TAGS }, () => ({
        name: faker.word.words({ count: 1 }).toLowerCase(),
      })),
    );
    await tagRepo.save(tags);

    const users = userRepo.create(
      Array.from({ length: TOTAL_USERS }, () => {
        const plainPassword = faker.internet.password({ length: 12 });
        const refreshToken = faker.string.uuid();

        return {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email().toLowerCase(),
          bio: faker.lorem.sentence(),
          avatarUrl: faker.image.avatar(),
          role: faker.helpers.arrayElement(['admin', 'author', 'reader']),
          password: plainPassword,
          hashedRefreshToken: refreshToken,
        };
      }),
    );
    await userRepo.save(users);

    const posts = postRepo.create(
      Array.from({ length: TOTAL_POSTS }, () => {
        const title = faker.lorem.sentence({ min: 3, max: 7 });
        const selectedTags = faker.helpers.arrayElements(tags, randomInt(1, 4));

        return {
          slug: slugify(title),
          title,
          user: faker.helpers.arrayElement(users),
          content: faker.lorem.paragraphs({ min: 2, max: 5 }),
          thumbnail: faker.image.url({ width: 1200, height: 630 }),
          published: faker.datatype.boolean(),
          tags: selectedTags,
        };
      }),
    );
    await postRepo.save(posts);

    const comments = commentRepo.create(
      posts.flatMap((post) =>
        Array.from({ length: randomInt(0, 5) }, () => ({
          post,
          user: faker.helpers.arrayElement(users),
          content: faker.lorem.sentences({ min: 1, max: 3 }),
        })),
      ),
    );
    if (comments.length) {
      await commentRepo.save(comments);
    }

    const likes = likeRepo.create(
      posts.flatMap((post) =>
        Array.from({ length: randomInt(0, 10) }, () => ({
          post,
          user: faker.helpers.arrayElement(users),
        })),
      ),
    );
    if (likes.length) {
      await likeRepo.save(likes);
    }

    console.log(
      `Seeded ${users.length} users, ${posts.length} posts, ${tags.length} tags, ${comments.length} comments, ${likes.length} likes.`,
    );
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
