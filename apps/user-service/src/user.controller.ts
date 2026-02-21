/** @fileoverview User controller stub. All message-pattern handlers are currently commented out. @module user-service/user.controller */
// TODO: Uncomment and implement user message-pattern handlers once DTOs and service methods are finalised.
import { Controller } from "@nestjs/common";
// import { UpdateUserMessageDto } from "./dto/update-user.dto";
// import { Department, UserRole } from "./schemas/user.schema";
import { MessagePattern } from "@nestjs/microservices";
import { USER_COMMANDS } from "@shared/constants";
import { MongoIdDto } from "@shared/dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

/**
 * User Controller
 *
 * Handles all user-related microservice message patterns.
 * Communicates through message-based transport (e.g., TCP, RMQ, Kafka).
 */
@Controller()
export class UserController {
  /**
   * Creates an instance of UserController.
   *
   * @param {UserService} userService - Service layer responsible for user business logic.
   */
  constructor(private readonly userService: UserService) {}

  // /**
  //  * Retrieve all users.
  //  *
  //  * Message Pattern: { cmd: USER_COMMANDS.GET_USERS }
  //  *
  //  * @param {UserSearchQueryDto} query - Query parameters for filtering and pagination.
  //  * @returns {Promise<any>} List of users.
  //  */
  // @MessagePattern(USER_COMMANDS.GET_USERS)
  // async getUsers(
  //   payload: UserSearchQueryDto & {
  //     myRole: UserRole;
  //     myId?: string;
  //     myDepartment?: Department;
  //   },
  // ) {
  //   const { myRole, myId, myDepartment, ...query } = payload ?? {};
  //   return await this.userService.getUsers(
  //     myRole,
  //     query as UserSearchQueryDto,
  //     myId,
  //     myDepartment,
  //   );
  // }

  /**
   * Retrieve a single user by ID.
   *
   * Message Pattern: { cmd: USER_COMMANDS.GET_USER }
   *
   * @param {MongoIdDto} params - Object containing the user ID.
   * @returns {Promise<any>} User details.
   */
  @MessagePattern(USER_COMMANDS.GET_USER)
  async getUser(payload: { id: MongoIdDto["id"] }) {
    return await this.userService.getUser(payload.id);
  }

  /**
   * Create a new user.
   *
   * Message Pattern: { cmd: USER_COMMANDS.CREATE_USER }
   *
   * @param {CreateUserDto} data - Data transfer object containing user creation payload.
   * @returns {Promise<any>} Newly created user.
   */
  @MessagePattern(USER_COMMANDS.CREATE_USER)
  async createUser(data: CreateUserDto) {
    return await this.userService.createUser(data);
  }

  // /**
  //  * Update an existing user.
  //  *
  //  * Message Pattern: { cmd: USER_COMMANDS.UPDATE_USER }
  //  *
  //  * @param {UpdateUserMessageDto} data - Object containing user ID and update payload.
  //  * @returns {Promise<any>} Updated user data.
  //  */
  // @MessagePattern(USER_COMMANDS.UPDATE_USER)
  // async updateUser(data: UpdateUserMessageDto) {
  //   const { id, ...payload } = data;
  //   return await this.userService.updateUser(id, payload);
  // }

  // /**
  //  * Delete a user by ID.
  //  *
  //  * Message Pattern: { cmd: USER_COMMANDS.DELETE_USER }
  //  *
  //  * @param {MongoIdDto} params - Object containing the user ID to be deleted.
  //  * @returns {Promise<any>} Deletion result.
  //  */
  // @MessagePattern(USER_COMMANDS.DELETE_USER)
  // async deleteUser(id: MongoIdDto["id"]) {
  //   return await this.userService.deleteUser(id);
  // }

  /**
   * Find user by email
   * Message Pattern: { cmd: USER_COMMANDS.FIND_BY_EMAIL }
   */
  @MessagePattern(USER_COMMANDS.FIND_BY_EMAIL)
  async findByEmail(email: string) {
    return await this.userService.findByEmail(email);
  }

  /**
   * Set a password reset token for a user
   * Message Pattern: { cmd: USER_COMMANDS.SET_RESET_PASSWORD_OTP }
   */
  @MessagePattern(USER_COMMANDS.SET_RESET_PASSWORD_OTP)
  async setResetPasswordOtp(payload: {
    email: string;
    otp: string;
    expiry: string;
  }) {
    const { email, otp, expiry } = payload;
    return await this.userService.setResetPasswordOtp(
      email,
      otp,
      new Date(expiry),
    );
  }

  /**
   * Reset password using token
   * Message Pattern: { cmd: USER_COMMANDS.RESET_PASSWORD }
   */
  @MessagePattern(USER_COMMANDS.RESET_PASSWORD)
  async resetPassword(payload: { otp: string; newPassword: string }) {
    return await this.userService.resetPassword(
      payload.otp,
      payload.newPassword,
    );
  }

  /**
   * Change password given user id and current password
   * Message Pattern: { cmd: USER_COMMANDS.CHANGE_PASSWORD }
   */
  @MessagePattern(USER_COMMANDS.CHANGE_PASSWORD)
  async changePassword(payload: {
    id: MongoIdDto["id"];
    currentPassword: string;
    newPassword: string;
  }) {
    const { id, currentPassword, newPassword } = payload;
    return await this.userService.changePassword(
      id,
      currentPassword,
      newPassword,
    );
  }
  /**
   * Get users count by designation ID.
   * Message Pattern: { cmd: USER_COMMANDS.GET_USERS_COUNT_BY_DESIGNATION }
   *
   * @param {MongoIdDto} payload - Object containing the designation ID.
   * @returns {Promise<number>} Count of users with the specified designation.
   */
  @MessagePattern(USER_COMMANDS.GET_USERS_COUNT_BY_DESIGNATION)
  async getUsersCountByDesignation(designationId: MongoIdDto["id"]) {
    return await this.userService.getUsersCountByDesignation(designationId);
  }
}
