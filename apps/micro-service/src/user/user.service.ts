import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async getUsers(): Promise<any> {
    return firstValueFrom(this.userClient.send({ cmd: 'get_users' }, {}));
  }

  async getUser(id: number): Promise<any> {
    return firstValueFrom(this.userClient.send({ cmd: 'get_user' }, id));
  }

  async createUser(data: { name: string; email: string }): Promise<any> {
    return firstValueFrom(this.userClient.send({ cmd: 'create_user' }, data));
  }

  async updateUser(
    id: number,
    data: { name: string; email: string },
  ): Promise<any> {
    return firstValueFrom(
      this.userClient.send({ cmd: 'update_user' }, { id, ...data }),
    );
  }

  async deleteUser(id: number): Promise<any> {
    return firstValueFrom(this.userClient.send({ cmd: 'delete_user' }, id));
  }
}
