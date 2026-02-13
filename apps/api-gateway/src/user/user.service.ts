import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { USER_COMMANDS } from "../../../user-service/src/constants/user.constants";
import { CreateUserDto } from "../../../user-service/src/dto/create-user.dto";
import { UserSearchQueryDto } from "../../../user-service/src/dto/user-query.dto";
import { UserRole } from "../../../user-service/src/schemas/user.schema";
import { MongoIdDto } from "../common/dto/mongo-id.dto";
import { buildResponse } from "../common/response.util";

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
  async getUsers(myRole: UserRole, query: UserSearchQueryDto) {
    const { users, total, totalPages } = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS, { ...query, myRole }),
    );
    return buildResponse("Users fetched successfully", {
      users,
      total,
      totalPages,
    });
  }

  /**
   * Fetch a single user by ID.
   *
   * @param {MongoIdDto} params - Object containing the user ID.
   * @returns Promise resolving to the user object
   * @throws NotFoundException if the user does not exist
   */
  async getUser(myRole: UserRole, id: MongoIdDto["id"]) {
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, { id, myRole }),
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
    // If the email already exists, throw a ConflictException with the message from the User Service response
    if (user?.emailExist) {
      throw new ConflictException(user.message);
    }
    return buildResponse("User created successfully", user);
  }

  /**
   * Delete a user by ID.
   *
   * @param {MongoIdDto} params - Object containing the user ID.
   * @returns Promise resolving to the deleted user object
   * @throws NotFoundException if the user does not exist
   */
  async deleteUser(id: MongoIdDto["id"]) {
    const deletedUser = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.DELETE_USER, id),
    );
    if (!deletedUser) throw new NotFoundException("User not found");
    return buildResponse("User deleted successfully", deletedUser);
  }
}
