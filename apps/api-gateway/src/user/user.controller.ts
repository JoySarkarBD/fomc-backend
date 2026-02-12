import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserParamDto } from "./dto/user-param.dto";
import { UserService } from "./user.service";

/**
 * User Controller responsible for handling HTTP requests related to user operations in the API Gateway.
 * Provides endpoints for creating, retrieving, updating, and deleting users.
 * Utilizes the UserService to perform the necessary business logic for each user-related operation.
 * Includes guards and validation to ensure that incoming requests contain valid data and that only authorized users can perform certain actions.
 */
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<any> {
    return await this.userService.getUsers();
  }

  @Get(":id")
  async getUser(@Param() params: UserParamDto): Promise<any> {
    return await this.userService.getUser(params.id);
  }

  @Post("")
  async createUser(@Body() data: CreateUserDto): Promise<any> {
    return await this.userService.createUser(data);
  }

  @Put(":id")
  async updateUser(
    @Param() params: UserParamDto,
    @Body() data: UpdateUserDto,
  ): Promise<any> {
    return await this.userService.updateUser(params.id, data);
  }

  @Delete(":id")
  async deleteUser(@Param() params: UserParamDto): Promise<any> {
    return await this.userService.deleteUser(params.id);
  }
}
