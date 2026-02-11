import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  posts?: any[];
}

@Injectable()
export class UserService {
  constructor(
    @Inject('POST_SERVICE') private readonly postClient: ClientProxy,
  ) {}

  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  async getUsers(): Promise<User[]> {
    const usersWithPosts = await Promise.all(
      this.users.map(async (user) => {
        try {
          const allPosts = await firstValueFrom(
            this.postClient.send({ cmd: 'get_posts_basic' }, {}),
          );
          const userPosts = allPosts.filter(
            (post: any) => post.userId === user.id,
          );
          return { ...user, posts: userPosts };
        } catch (error) {
          return user;
        }
      }),
    );
    return usersWithPosts;
  }

  async getUser(id: number): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;

    try {
      const allPosts = await firstValueFrom(
        this.postClient.send({ cmd: 'get_posts_basic' }, {}),
      );
      const userPosts = allPosts.filter((post: any) => post.userId === id);
      return { ...user, posts: userPosts };
    } catch (error) {
      return user;
    }
  }

  getUsersBasic(): User[] {
    return this.users;
  }

  getUserBasic(id: number): User | null {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }
}
