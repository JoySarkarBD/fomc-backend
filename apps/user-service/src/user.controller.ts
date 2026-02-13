import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { MongoIdDto } from "../../api-gateway/src/common/dto/mongo-id.dto";
import { USER_COMMANDS } from "./constants/user.constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserMessageDto } from "./dto/update-user.dto";
import { UserSearchQueryDto } from "./dto/user-query.dto";
import { UserRole } from "./schemas/user.schema";
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
   * Message Pattern: { cmd: USER_COMMANDS.GET_USERS }
   *
   * @param {UserSearchQueryDto} query - Query parameters for filtering and pagination.
   * @returns {Promise<any>} List of users.
   */
  @MessagePattern(USER_COMMANDS.GET_USERS)
  getUsers(payload: UserSearchQueryDto & { myRole: UserRole }) {
    const { myRole, ...query } = payload ?? {};
    return this.userService.getUsers(myRole, query as UserSearchQueryDto);
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
  getUser(payload: { id: MongoIdDto["id"]; myRole: UserRole }) {
    const { id, myRole } = payload ?? {};
    return this.userService.getUser(myRole, id);
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
  createUser(data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  /**
   * Update an existing user.
   *
   * Message Pattern: { cmd: USER_COMMANDS.UPDATE_USER }
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
   * Message Pattern: { cmd: USER_COMMANDS.DELETE_USER }
   *
   * @param {MongoIdDto} params - Object containing the user ID to be deleted.
   * @returns {Promise<any>} Deletion result.
   */
  @MessagePattern(USER_COMMANDS.DELETE_USER)
  deleteUser(id: MongoIdDto["id"]) {
    return this.userService.deleteUser(id);
  }

  /**
   * Find user by email
   * Message Pattern: { cmd: USER_COMMANDS.FIND_BY_EMAIL }
   */
  @MessagePattern(USER_COMMANDS.FIND_BY_EMAIL)
  findByEmail(email: string) {
    return this.userService.findByEmail(email);
  }

  /**
   * Set a password reset token for a user
   * Message Pattern: { cmd: USER_COMMANDS.SET_RESET_PASSWORD_OTP }
   */
  @MessagePattern(USER_COMMANDS.SET_RESET_PASSWORD_OTP)
  setResetPasswordOtp(payload: { email: string; otp: string; expiry: string }) {
    const { email, otp, expiry } = payload;
    return this.userService.setResetPasswordOtp(email, otp, new Date(expiry));
  }

  /**
   * Reset password using token
   * Message Pattern: { cmd: USER_COMMANDS.RESET_PASSWORD }
   */
  @MessagePattern(USER_COMMANDS.RESET_PASSWORD)
  resetPassword(payload: { otp: string; newPassword: string }) {
    return this.userService.resetPassword(payload.otp, payload.newPassword);
  }

  /**
   * Change password given user id and current password
   * Message Pattern: { cmd: USER_COMMANDS.CHANGE_PASSWORD }
   */
  @MessagePattern(USER_COMMANDS.CHANGE_PASSWORD)
  changePassword(payload: {
    id: MongoIdDto["id"];
    currentPassword: string;
    newPassword: string;
  }) {
    const { id, currentPassword, newPassword } = payload;
    return this.userService.changePassword(id, currentPassword, newPassword);
  }
}
