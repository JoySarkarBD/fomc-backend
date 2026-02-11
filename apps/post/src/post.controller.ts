import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern({ cmd: 'get_posts' })
  getPosts() {
    return this.postService.getPosts();
  }

  @MessagePattern({ cmd: 'get_posts_basic' })
  getPostsBasic() {
    return this.postService.getPostsBasic();
  }

  @MessagePattern({ cmd: 'get_post' })
  getPost(id: number) {
    return this.postService.getPost(id);
  }

  @MessagePattern({ cmd: 'get_post_basic' })
  getPostBasic(id: number) {
    return this.postService.getPostBasic(id);
  }
}
