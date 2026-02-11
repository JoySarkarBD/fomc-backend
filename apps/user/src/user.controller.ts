import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_users' })
  getUsers() {
    return this.userService.getUsers();
  }

  @MessagePattern({ cmd: 'get_users_basic' })
  getUsersBasic() {
    return this.userService.getUsersBasic();
  }

  @MessagePattern({ cmd: 'get_user' })
  getUser(id: number) {
    return this.userService.getUser(id);
  }

  @MessagePattern({ cmd: 'get_user_basic' })
  getUserBasic(id: number) {
    return this.userService.getUserBasic(id);
  }
}
