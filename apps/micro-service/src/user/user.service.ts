import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_COMMANDS } from './constants/user.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async getUsers(): Promise<any> {
    return firstValueFrom(this.userClient.send(USER_COMMANDS.GET_USERS, {}));
  }

  async getUser(id: string): Promise<any> {
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, id),
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(data: CreateUserDto): Promise<any> {
    return firstValueFrom(
      this.userClient.send(USER_COMMANDS.CREATE_USER, data),
    );
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<any> {
    const updatedUser = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.UPDATE_USER, { id, ...data }),
    );
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async deleteUser(id: string): Promise<any> {
    const deletedUser = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.DELETE_USER, id),
    );
    if (!deletedUser) throw new NotFoundException('User not found');
    return deletedUser;
  }
}
