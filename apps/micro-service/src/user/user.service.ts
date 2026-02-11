import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async getUsers(): Promise<any> {
    return firstValueFrom(this.userClient.send({ cmd: 'get_users' }, {}));
  }

  async getUser(id: string): Promise<any> {
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'get_user' }, id),
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(data: CreateUserDto): Promise<any> {
    return firstValueFrom(this.userClient.send({ cmd: 'create_user' }, data));
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<any> {
    const updatedUser = await firstValueFrom(
      this.userClient.send({ cmd: 'update_user' }, { id, ...data }),
    );
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async deleteUser(id: string): Promise<any> {
    const deletedUser = await firstValueFrom(
      this.userClient.send({ cmd: 'delete_user' }, id),
    );
    if (!deletedUser) throw new NotFoundException('User not found');
    return deletedUser;
  }
}
