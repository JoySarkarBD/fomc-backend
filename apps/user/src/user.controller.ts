import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserMessageDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_users' })
  getUsers() {
    return this.userService.getUsers();
  }

  @MessagePattern({ cmd: 'get_user' })
  getUser(id: string) {
    return this.userService.getUser(id);
  }

  @MessagePattern({ cmd: 'create_user' })
  createUser(data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'update_user' })
  updateUser(data: UpdateUserMessageDto) {
    const { id, ...payload } = data;
    return this.userService.updateUser(id, payload);
  }

  @MessagePattern({ cmd: 'delete_user' })
  deleteUser(id: string) {
    return this.userService.deleteUser(id);
  }
}
