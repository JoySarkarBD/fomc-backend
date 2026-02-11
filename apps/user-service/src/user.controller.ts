import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { USER_COMMANDS } from "./constants/user.constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserMessageDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

/**
 * UserController
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

  /**
   * Retrieve all users.
   *
   * Message Pattern: { cmd: 'get_users' }
   *
   * @returns {Promise<any>} List of users.
   */
  @MessagePattern(USER_COMMANDS.GET_USERS)
  getUsers() {
    return this.userService.getUsers();
  }

  /**
   * Retrieve a single user by ID.
   *
   * Message Pattern: { cmd: 'get_user' }
   *
   * @param {string} id - Unique identifier of the user.
   * @returns {Promise<any>} User details.
   */
  @MessagePattern(USER_COMMANDS.GET_USER)
  getUser(id: string) {
    return this.userService.getUser(id);
  }

  /**
   * Create a new user.
   *
   * Message Pattern: { cmd: 'create_user' }
   *
   * @param {CreateUserDto} data - Data transfer object containing user creation payload.
   * @returns {Promise<any>} Newly created user.
   */
  @MessagePattern(USER_COMMANDS.CREATE_USER)
  createUser(data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  /**
   * Update an existing user.
   *
   * Message Pattern: { cmd: 'update_user' }
   *
   * @param {UpdateUserMessageDto} data - Object containing user ID and update payload.
   * @returns {Promise<any>} Updated user data.
   */
  @MessagePattern(USER_COMMANDS.UPDATE_USER)
  updateUser(data: UpdateUserMessageDto) {
    const { id, ...payload } = data;
    return this.userService.updateUser(id, payload);
  }

  /**
   * Delete a user by ID.
   *
   * Message Pattern: { cmd: 'delete_user' }
   *
   * @param {string} id - Unique identifier of the user.
   * @returns {Promise<any>} Deletion result.
   */
  @MessagePattern(USER_COMMANDS.DELETE_USER)
  deleteUser(id: string) {
    return this.userService.deleteUser(id);
  }

  /**
   * Find user by email
   * Message Pattern: { cmd: 'find_user_by_email' }
   */
  @MessagePattern(USER_COMMANDS.FIND_BY_EMAIL)
  findByEmail(email: string) {
    return this.userService.findByEmail(email);
  }

  /**
   * Set a password reset token for a user
   * Message Pattern: { cmd: 'set_reset_token' }
   */
  @MessagePattern(USER_COMMANDS.SET_RESET_PASSWORD_OTP)
  setResetPasswordOtp(payload: { email: string; otp: string; expiry: string }) {
    const { email, otp, expiry } = payload;
    return this.userService.setResetPasswordOtp(email, otp, new Date(expiry));
  }

  /**
   * Reset password using token
   * Message Pattern: { cmd: 'reset_password' }
   */
  @MessagePattern(USER_COMMANDS.RESET_PASSWORD)
  resetPassword(payload: { otp: string; newPassword: string }) {
    return this.userService.resetPassword(payload.otp, payload.newPassword);
  }

  /**
   * Change password given user id and current password
   * Message Pattern: { cmd: 'change_password' }
   */
  @MessagePattern({ cmd: "change_password" })
  changePassword(payload: {
    id: string;
    currentPassword: string;
    newPassword: string;
  }) {
    const { id, currentPassword, newPassword } = payload;
    return this.userService.changePassword(id, currentPassword, newPassword);
  }
}
