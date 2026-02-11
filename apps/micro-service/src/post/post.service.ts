import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_SERVICE') private readonly postClient: ClientProxy,
  ) {}

  async getPosts(): Promise<any> {
    return firstValueFrom(this.postClient.send({ cmd: 'get_posts' }, {}));
  }

  async getPost(id: number): Promise<any> {
    return firstValueFrom(this.postClient.send({ cmd: 'get_post' }, id));
  }

  async createPost(data: {
    title: string;
    content: string;
    userId: number;
  }): Promise<any> {
    return firstValueFrom(this.postClient.send({ cmd: 'create_post' }, data));
  }

  async updatePost(
    id: number,
    data: { title: string; content: string },
  ): Promise<any> {
    return firstValueFrom(
      this.postClient.send({ cmd: 'update_post' }, { id, ...data }),
    );
  }

  async deletePost(id: number): Promise<any> {
    return firstValueFrom(this.postClient.send({ cmd: 'delete_post' }, id));
  }
}
