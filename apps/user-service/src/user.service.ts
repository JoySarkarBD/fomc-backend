import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import { MongoIdDto } from "../../api-gateway/src/common/dto/mongo-id.dto";
import config from "../../config/config";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserSearchQueryDto } from "./dto/user-query.dto";
import { User, UserDocument, UserRole } from "./schemas/user.schema";

/**
 * UserService
 *
 * Handles all business logic related to User management.
 * Responsible for database interaction using Mongoose model.
 */
@Injectable()
export class UserService {
  /**
   * Creates an instance of UserService.
   *
   * @param {Model<UserDocument>} userModel - Injected Mongoose model for User schema.
   */
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Retrieve all users from the database.
   *
   * @param {UserRole} myRole - Role of the requesting user to apply role-based access control.
   * @param {UserSearchQueryDto} query - Optional search query parameters for filtering users.
   * @returns {Promise<{users: User[]; total: number; totalPages: number}>} Array of user documents with pagination info.
   */
  async getUsers(
    myRole: UserRole,
    query: UserSearchQueryDto,
  ): Promise<{ users: User[]; total: number; totalPages: number }> {
    const { pageNo, pageSize, searchKey, department, role } = query;

    // Build a dynamic filter object based on the presence of search key, department, and role in the query parameters. This allows for flexible querying of users based on different criteria.
    const filter: any = {};

    // Role-based access control
    switch (myRole) {
      case UserRole.DIRECTOR:
        // Director can see everyone
        break;
      case UserRole.HR:
        // HR can see all employees and team leads
        filter.role = {
          $in: [
            UserRole.EMPLOYEE,
            UserRole.TEAM_LEADER,
            UserRole.PROJECT_MANAGER,
          ],
        };
        break;
      case UserRole.PROJECT_MANAGER:
      case UserRole.TEAM_LEADER:
        // Managers/Leads can see only their department/team members
        if (department) {
          filter.department = department;
        }
        filter.role = { $in: [UserRole.EMPLOYEE, UserRole.TEAM_LEADER] };
        break;
      default:
        throw new HttpException("Invalid role", HttpStatus.FORBIDDEN);
    }

    // If a search key is provided, add a case-insensitive regex filter on both the name and email fields to allow searching for users by either their name or email.
    if (searchKey) {
      filter.$or = [
        { name: { $regex: searchKey, $options: "i" } },
        { email: { $regex: searchKey, $options: "i" } },
      ];
    }

    // Apply department and role filters from query if provided (Director can use these)
    if (department && myRole === UserRole.DIRECTOR)
      filter.department = department;
    if (role && myRole === UserRole.DIRECTOR) filter.role = role;

    // Execute the query to find users based on the constructed filter, applying pagination using skip and limit. Simultaneously, count the total number of documents that match the filter to provide pagination metadata. Finally, return the users along with total count and total pages calculated from the total count and page size.
    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return {
      users,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Retrieve a single user by ID.
   *
   * @param {UserRole} myRole - Role of the requesting user to apply role-based access control.
   * @param {MongoIdDto["id"]} id - Unique identifier of the user.
   * @throws {NotFoundException} If the user does not exist.
   * @returns {Promise<User>} The found user document.
   */
  async getUser(myRole: UserRole, id: MongoIdDto["id"]): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();

    if (!user) throw new NotFoundException("User not found");

    // Role-based access control
    switch (myRole) {
      case UserRole.DIRECTOR:
        return user;
      case UserRole.HR:
        if (
          [
            UserRole.EMPLOYEE,
            UserRole.TEAM_LEADER,
            UserRole.PROJECT_MANAGER,
          ].includes(user.role)
        ) {
          return user;
        }
        break;
      case UserRole.PROJECT_MANAGER:
      case UserRole.TEAM_LEADER:
        if (
          user.department === user.department &&
          [UserRole.EMPLOYEE, UserRole.TEAM_LEADER].includes(user.role)
        ) {
          return user;
        }
        break;
      case UserRole.EMPLOYEE:
        if (user._id.equals(id)) return user;
        break;
    }

    throw new HttpException("Access denied", HttpStatus.FORBIDDEN);
  }

  /**
   * Create a new user.
   *
   * @param {CreateUserDto} data - DTO containing user creation data.
   * @throws {ConflictException} If email already exists (duplicate key error).
   * @returns {Promise<User|{emailExist: boolean, message: string}>} Newly created user document or conflict message.
   */
  async createUser(
    data: CreateUserDto,
  ): Promise<User | { emailExist: boolean; message: string }> {
    try {
      const existing = await this.userModel
        .findOne({ email: data.email })
        .exec();

      // If a user with the provided email already exists, return an object indicating the email conflict instead of throwing an exception.
      if (existing) {
        return { emailExist: true, message: "Email already exists" };
      }

      // Hash the user's password before saving it to the database to ensure security.
      const hashedPassword = await bcrypt.hash(
        data.password,
        config.BCRYPT_SALT_ROUNDS,
      );

      // Create a new user document using the Mongoose model and save it to the database. After saving, convert the Mongoose document to a plain JavaScript object and remove the password field before returning the user data.
      data.password = hashedPassword;
      const createdUser = new this.userModel(data);

      // Save the new user document to the database and return the user data without the password field.
      const newUser = await createdUser.save();
      const userObject = newUser.toObject();
      delete userObject.password;

      return userObject as User;
    } catch (error: any) {
      // MongoDB duplicate key error
      if (error?.code === 11000) {
        return { emailExist: true, message: "Email already exists" };
      }
      throw error;
    }
  }

  /**
   * Find user by email (includes password field)
   *
   * @param {string} email - The email of the user to find, used to query the database for a user document that matches the provided email address.
   * @returns {Promise<User | null>} The user document that matches the provided email, including the password field for authentication purposes; returns null if no user is found with the given email.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email })
      .select("+password +otp +otpExpiry")
      .exec();
  }

  /**
   * Set OTP and expiry for a user identified by email
   *
   * @param {string} email - The email of the user for whom the OTP is being set, used to identify the user in the database.
   * @param {string} otp - The one-time password (OTP) that is generated and will be sent to the user's email for password reset verification.
   * @param {Date} expiry - The expiration time for the OTP, indicating how long the OTP will be valid for before it expires and can no longer be used for password reset.
   * @returns {Promise<boolean>} A boolean value indicating whether the OTP was successfully set for the user (true) or if there was an issue such as the user not being found (false).
   */
  async setResetPasswordOtp(
    email: string,
    otp: string,
    expiry: Date,
  ): Promise<boolean> {
    const res = await this.userModel
      .findOneAndUpdate(
        { email },
        { otp: otp, otpExpiry: expiry },
        { returnDocument: "after" },
      )
      .exec();
    return !!res;
  }

  /**
   * Reset password using a valid OTP
   *
   * @param {string} otp - The one-time password sent to the user's email for password reset verification.
   * @param {string} newPassword - The new password that the user wants to set after verifying the OTP.
   * @returns {Promise<boolean>} A boolean value indicating whether the password reset was successful (true) or if it failed due to an invalid or expired OTP (false).
   */
  async resetPassword(otp: string, newPassword: string): Promise<boolean> {
    const user = await this.userModel
      .findOne({ otp: otp, otpExpiry: { $gt: new Date() } })
      .exec();

    // If no user is found with the provided OTP or if the OTP has expired, return false to indicate that the password reset operation cannot proceed.
    if (!user) return false;

    // Hash the new password and update the user's password field, while also clearing the OTP and its expiry to prevent reuse. Finally, save the updated user document to the database and return true to indicate a successful password reset.
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear OTP fields, then save the document to the database.
    user.password = hashed;
    user.otp = null as any;
    user.otpExpiry = null as any;

    await user.save();
    return true;
  }

  /**
   * Change password given user id and current password
   *
   * @param {MongoIdDto} params - Object containing the user ID.
   * @param {string} currentPassword - The user's current password for verification.
   * @param {string} newPassword - The new password to be set for the user.
   * @returns {Promise<{ success: boolean; message: string }>} An object indicating the success status and a message describing the result of the password change operation.
   */
  async changePassword(
    id: MongoIdDto["id"],
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findById(id).select("+password").exec();

    // If the user with the provided ID does not exist, throw a NotFoundException to indicate that the user cannot be found in the database.
    if (!user) throw new NotFoundException("User not found");
    const match = await bcrypt.compare(
      currentPassword,
      user.password as string,
    );

    // If the provided current password does not match the stored hashed password, return an object indicating that the current password is incorrect instead of throwing an exception.
    if (!match)
      return {
        success: false,
        message: "Current password is incorrect",
      };

    // Hash the new password and update the user's password field, then save the updated user document to the database. Finally, return an object indicating that the password change was successful.
    user.password = await bcrypt.hash(newPassword, config.BCRYPT_SALT_ROUNDS);
    await user.save();

    return {
      success: true,
      message: "Password changed successfully",
    };
  }

  /**
   * Update an existing user by ID.
   *
   * @param {MongoIdDto} params - Object containing the user ID.
   * @param {UpdateUserDto} data - DTO containing fields to update.
   * @throws {NotFoundException} If the user does not exist.
   * @returns {Promise<User>} Updated user document.
   */
  async updateUser(
    id: MongoIdDto["id"],
    data: UpdateUserDto,
  ): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
    return updatedUser;
  }

  /**
   * Delete a user by ID.
   *
   * @param {MongoIdDto} params - Object containing the user ID to be deleted.
   * @throws {NotFoundException} If the user does not exist.
   * @returns {Promise<User>} Deleted user document.
   */
  async deleteUser(id: MongoIdDto["id"]): Promise<User | null> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    return deletedUser;
  }
}
