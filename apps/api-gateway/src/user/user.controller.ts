import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { GetUser } from "../common/decorators/get-user.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import type { AuthUser } from "../common/interfaces/auth-user.interface";
import { CreateUserDto } from "./dto/create-user.dto";
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
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Get(":id")
  async getUser(@Param() params: UserParamDto) {
    return await this.userService.getUser(params.id);
  }

  @Post("")
  async createUser(@Body() data: CreateUserDto) {
    return await this.userService.createUser(data);
  }

  @Delete(":id")
  async deleteUser(@Param() params: UserParamDto) {
    return await this.userService.deleteUser(params.id);
  }

  /**
   * Endpoint for retrieving the profile of the currently authenticated user.
   * Utilizes the UserService to fetch the profile information based on the authenticated user's context.
   * @returns The profile information of the authenticated user.
   */
  @Get("profile/me")
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: AuthUser) {
    return await this.userService.getUser(user._id as string);
  }
}
