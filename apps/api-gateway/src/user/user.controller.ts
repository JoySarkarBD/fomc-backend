import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "../../../user-service/src/dto/create-user.dto";
import { UserSearchQueryDto } from "../../../user-service/src/dto/user-query.dto";
import { UserRole } from "../../../user-service/src/schemas/user.schema";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { MongoIdDto } from "../common/dto/mongo-id.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import type { AuthUser } from "../common/interfaces/auth-user.interface";
import { UserService } from "./user.service";

/**
 * User Controller responsible for handling HTTP requests related to user operations in the API Gateway.
 * Provides endpoints for creating, retrieving, updating, and deleting users.
 * Utilizes the UserService to perform the necessary business logic for each user-related operation.
 * Includes guards and validation to ensure that incoming requests contain valid data and that only authorized users can perform certain actions.
 */
@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get a list of users based on query parameters for filtering and pagination.
   *
   * @guards RolesGuard - Ensures that only users with specific roles (Director, HR, Project Manager, Team Leader) can access this endpoint.
   * @param query - Query parameters for filtering and pagination of users.
   * @returns A list of users matching the query criteria.
   */
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.DIRECTOR,
    UserRole.HR,
    UserRole.PROJECT_MANAGER,
    UserRole.TEAM_LEADER,
    UserRole.EMPLOYEE,
  )
  @Get()
  async getUsers(
    @GetUser() user: AuthUser,
    @Query() query: UserSearchQueryDto,
  ) {
    return await this.userService.getUsers(
      user.role as UserRole,
      query,
      (user._id ?? user.id) as MongoIdDto["id"],
      user.department,
    );
  }

  /**
   * Get a single user by their unique identifier (ID).
   *
   * @guards RolesGuard - Ensures that only users with specific roles (Director, HR, Project Manager, Team Leader) can access this endpoint.
   * @param {MongoIdDto} params - Object containing the user ID.
   * @returns The user details corresponding to the provided ID.
   */
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.DIRECTOR,
    UserRole.HR,
    UserRole.PROJECT_MANAGER,
    UserRole.TEAM_LEADER,
    UserRole.EMPLOYEE,
  )
  @Get(":id")
  async getUser(@GetUser() user: AuthUser, @Param() params: MongoIdDto) {
    const result = await this.userService.getUser(
      user.role as UserRole,
      params.id as MongoIdDto["id"],
      (user._id ?? user.id) as MongoIdDto["id"],
      user.department,
    );
    return result;
  }

  /**
   * Create a new user with the provided data.
   *
   * @param data - An object containing the necessary information to create a new user (e.g., name, email, password).
   * @returns The details of the newly created user.
   */
  @Post("")
  async createUser(@Body() data: CreateUserDto) {
    return await this.userService.createUser(data);
  }

  /**
   * Delete a user by their unique identifier (ID).
   *
   * @guards RolesGuard - Ensures that only users with the HR role can access this endpoint.
   * @param {MongoIdDto} params - Object containing the user ID.
   * @returns A success message or the details of the deleted user.
   */
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.HR)
  // @Delete(":id")
  // async deleteUser(@Param() params: MongoIdDto) {
  //   return await this.userService.deleteUser(params.id);
  // }

  /**
   * Endpoint for retrieving the profile of the currently authenticated user.
   * Utilizes the UserService to fetch the profile information based on the authenticated user's context.
   * @returns The profile information of the authenticated user.
   */
  @Get("profile/me")
  async getProfile(@GetUser() user: AuthUser) {
    return await this.userService.getUser(
      user.role as UserRole,
      (user._id ?? user.id) as MongoIdDto["id"],
      (user._id ?? user.id) as MongoIdDto["id"],
      user.department,
    );
  }
}
