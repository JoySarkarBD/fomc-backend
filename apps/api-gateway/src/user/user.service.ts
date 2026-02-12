import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { buildResponse } from "../common/response.util";
import { USER_COMMANDS } from "./constants/user.constants";
import { CreateUserDto } from "./dto/create-user.dto";

/**
 * UserService
 *
 * Handles communication with the User microservice via ClientProxy.
 * Provides methods for CRUD operations on users.
 */
@Injectable()
export class UserService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
  ) {}

  /**
   * Fetch all users.
   *
   * @returns Promise resolving to an array of users
   */
  async getUsers() {
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS, {}),
    );
    return buildResponse("Users fetched successfully", users);
  }

  /**
   * Fetch a single user by ID.
   *
   * @param id - User ID
   * @returns Promise resolving to the user object
   * @throws NotFoundException if the user does not exist
   */
  async getUser(id: string) {
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, id),
    );
    if (!user) throw new NotFoundException("User not found");
    return buildResponse("User fetched successfully", user);
  }

  /**
   * Create a new user.
   *
   * @param data - Data transfer object containing user creation fields
   * @returns Promise resolving to the created user object
   */
  async createUser(data: CreateUserDto) {
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.CREATE_USER, data),
    );
    return buildResponse("User created successfully", user);
  }

  /**
   * Delete a user by ID.
   *
   * @param id - User ID
   * @returns Promise resolving to the deleted user object
   * @throws NotFoundException if the user does not exist
   */
  async deleteUser(id: string) {
    const deletedUser = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.DELETE_USER, id),
    );
    if (!deletedUser) throw new NotFoundException("User not found");
    return buildResponse("User deleted successfully", deletedUser);
  }
}
