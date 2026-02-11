import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getPosts(): Promise<any> {
    return await this.postService.getPosts();
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<any> {
    return await this.postService.getPost(Number(id));
  }

  @Post('')
  async createPost(
    @Body() data: { title: string; content: string; userId: number },
  ): Promise<any> {
    return await this.postService.createPost(data);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() data: { title: string; content: string },
  ): Promise<any> {
    return await this.postService.updatePost(Number(id), data);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<any> {
    return await this.postService.deletePost(Number(id));
  }
}
