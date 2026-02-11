import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<any> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<any> {
    return await this.userService.getUser(Number(id));
  }

  @Post('')
  async createUser(
    @Body() data: { name: string; email: string },
  ): Promise<any> {
    return await this.userService.createUser(data);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: { name: string; email: string },
  ): Promise<any> {
    return await this.userService.updateUser(Number(id), data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await this.userService.deleteUser(Number(id));
  }
}
