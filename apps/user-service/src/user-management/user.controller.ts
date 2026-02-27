/** @fileoverview User controller stub. All message-pattern handlers are currently commented out.  */

import { Controller } from "@nestjs/common";
// import { UpdateUserMessageDto } from "./dto/update-user.dto";
// import { Department, UserRole } from "./schemas/user.schema";
import { MessagePattern } from "@nestjs/microservices";
import { USER_COMMANDS } from "@shared/constants";
import { MongoIdDto } from "@shared/dto";
import { UserIdDto } from "@shared/dto/mongo-id.dto";
import { WeekEndOff } from "../schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { UserSearchQueryDto } from "./dto/user-search-query.dto";
import { UserService } from "./user.service";

@Controller()
export class UserController {
  /**
   * Creates an instance of UserController.
   *
   * @param {UserService} userService - Service layer responsible for user business logic.
   */
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieve all users.
   *
   * Message Pattern: { cmd: USER_COMMANDS.GET_USERS }
   *
   * @param {UserSearchQueryDto} query - Query parameters for filtering and pagination.
   * @returns {Promise<any>} List of users.
   */
  @MessagePattern(USER_COMMANDS.GET_USERS)
  async getUsers(payload: UserSearchQueryDto) {
    return await this.userService.getUsers(payload);
  }

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
   *
   * Message Pattern: { cmd: USER_COMMANDS.SET_RESET_PASSWORD_OTP }
   *
   * @param {Object} payload - Object containing the user's email, OTP, and expiry time.
   * @param {string} payload.email - The email address of the user.
   * @param {string} payload.otp - The one-time password (OTP) to be set for password reset.
   * @param {string} payload.expiry - The expiry time for the OTP in ISO string format.
   * @returns {Promise<any>} Result of setting the OTP, typically indicating success or failure.
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
   *
   * Message Pattern: { cmd: USER_COMMANDS.RESET_PASSWORD }
   *
   * @param {Object} payload - Object containing the OTP and the new password.
   * @param {string} payload.otp - The one-time password (OTP) provided by the user for password reset.
   * @param {string} payload.newPassword - The new password that the user wants to set.
   * @returns {Promise<any>} Result of the password reset operation, typically indicating success or failure.
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
   *
   * Message Pattern: { cmd: USER_COMMANDS.CHANGE_PASSWORD }
   *
   * @param {Object} payload - Object containing the user ID, current password, and new password.
   * @param {string} payload.id - The ID of the user who wants to change their password.
   * @param {string} payload.currentPassword - The current password of the user, used for verification.
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

  /**
   * Update the authenticated user's profile.
   *
   * Message Pattern: { cmd: USER_COMMANDS.UPDATE_USER_PROFILE }
   *
   * @param {Object} payload - Object containing the user ID and the profile update data.
   * @param {string} payload.id - The ID of the user whose profile is to be updated.
   * @param {UpdateUserProfileDto} payload.data - DTO containing the fields to update (name and/or avatar).
   * @returns {Promise<any>} The updated user object with populated role and designation details, or an object indicating that the user was not found.
   */
  @MessagePattern(USER_COMMANDS.UPDATE_USER_PROFILE)
  async updateUserProfile(payload: {
    id: MongoIdDto["id"];
    data: UpdateUserProfileDto;
  }) {
    return await this.userService.updateUserProfile(payload.id, payload.data);
  }

  /**
   * Update the authenticated user's weekend off.
   *
   * Message Pattern: { cmd: USER_COMMANDS.UPDATE_WEEKEND_OFF }
   *
   * @param {Object} payload - Object containing the user ID and the new weekend off value.
   * @param {string} payload.userId - The ID of the user whose weekend off is to be updated.
   * @param {WeekEndOff} payload.weekEndOff - The new weekend off value to be set for the user.
   * @returns {Promise<any>} The updated user object with the new weekend off value, or an object indicating that the user was not found.
   */
  @MessagePattern(USER_COMMANDS.UPDATE_WEEKEND_OFF)
  async updateWeekendOff(payload: {
    userId: UserIdDto["userId"];
    weekEndOff: WeekEndOff;
  }) {
    return await this.userService.updateWeekendOff(
      payload.userId,
      payload.weekEndOff,
    );
  }
}
