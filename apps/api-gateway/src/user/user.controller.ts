import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserParamDto } from './dto/user-param.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<any> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  async getUser(@Param() params: UserParamDto): Promise<any> {
    return await this.userService.getUser(params.id);
  }

  @Post('')
  async createUser(@Body() data: CreateUserDto): Promise<any> {
    return await this.userService.createUser(data);
  }

  @Put(':id')
  async updateUser(
    @Param() params: UserParamDto,
    @Body() data: UpdateUserDto,
  ): Promise<any> {
    return await this.userService.updateUser(params.id, data);
  }

  @Delete(':id')
  async deleteUser(@Param() params: UserParamDto): Promise<any> {
    return await this.userService.deleteUser(params.id);
  }
}
