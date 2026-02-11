import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  user?: any;
}

@Injectable()
export class PostService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  private posts: Post[] = [
    { id: 1, title: 'First Post', content: 'This is my first post', userId: 1 },
    { id: 2, title: 'Second Post', content: 'Another post here', userId: 2 },
  ];

  async getPosts(): Promise<Post[]> {
    const postsWithUsers = await Promise.all(
      this.posts.map(async (post) => {
        try {
          const user = await firstValueFrom(
            this.userClient.send({ cmd: 'get_user_basic' }, post.userId),
          );
          return { ...post, user };
        } catch (error) {
          return post;
        }
      }),
    );
    return postsWithUsers;
  }

  async getPost(id: number): Promise<Post | null> {
    const post = this.posts.find((p) => p.id === id);
    if (!post) return null;

    try {
      const user = await firstValueFrom(
        this.userClient.send({ cmd: 'get_user_basic' }, post.userId),
      );
      return { ...post, user };
    } catch (error) {
      return post;
    }
  }

  getPostsBasic(): Post[] {
    return this.posts;
  }

  getPostBasic(id: number): Post | null {
    const post = this.posts.find((p) => p.id === id);
    return post || null;
  }
}
