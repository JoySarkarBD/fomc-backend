/** @fileoverview User service stub. Business logic methods are currently commented out. @module user-service/user.service */
// TODO: Uncomment and implement user service methods once DTOs and schema references are finalised.
import {
  Inject,
  // ConflictException,
  // HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model, Types } from "mongoose";
// import { MongoIdDto } from "../../api-gateway/src/common/dto/mongo-id.dto";
// import config from "../../config/config";
// import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
// import { UserSearchQueryDto } from "./dto/user-query.dto";
import { ClientProxy } from "@nestjs/microservices";
import config from "@shared/config/app.config";
import { DEPARTMENT_COMMANDS } from "@shared/constants";
import { DESIGNATION_COMMANDS } from "@shared/constants/designation-command.constants";
import { MongoIdDto } from "@shared/dto/mongo-id.dto";
import { firstValueFrom } from "rxjs";
import { CreateUserDto } from "./dto/create-user.dto";
import { RoleService } from "./role/role.service";
import { User, UserDocument } from "./schemas/user.schema";

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
    @Inject("WORKFORCE_SERVICE") private readonly workForceClient: ClientProxy,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(RoleService) private readonly roleService: RoleService,
  ) {}

  // /**
  //  * Retrieve all users from the database.
  //  *
  //  * @param {UserRole} myRole - Role of the requesting user to apply role-based access control.
  //  * @param {UserSearchQueryDto} query - Optional search query parameters for filtering users.
  //  * @param {MongoIdDto["id"]} myId - ID of the requesting user.
  //  * @param {Department} myDepartment - Department of the requesting user.
  //  * @returns {Promise<{users: User[]; total: number; totalPages: number}>} Array of user documents with pagination info.
  //  */
  // async getUsers(
  //   myRole: string,
  //   query: UserSearchQueryDto,
  //   myId?: MongoIdDto["id"],
  //   myDepartment?: string,
  // ): Promise<
  //   | { users: User[]; total: number; totalPages: number }
  //   | { message: string; exception: any }
  // > {
  //   const { pageNo, pageSize, searchKey, department, role } = query;

  //   // Build a dynamic filter object based on the presence of search key, department, and role in the query parameters. This allows for flexible querying of users based on different criteria.
  //   const filter: any = {};

  //   // Role-based access control
  //   switch (myRole) {
  //     case UserRole.DIRECTOR:
  //       // Director can see everyone - no restrictions
  //       break;
  //     case UserRole.HR:
  //       // HR can see all users except DIRECTOR
  //       filter.role = {
  //         $in: [
  //           UserRole.EMPLOYEE,
  //           UserRole.TEAM_LEADER,
  //           UserRole.PROJECT_MANAGER,
  //           UserRole.HR,
  //         ],
  //       };
  //       break;
  //     case UserRole.PROJECT_MANAGER:
  //     case UserRole.TEAM_LEADER:
  //       // Managers/Leads can see only users from their department
  //       // Cannot see HR or DIRECTOR
  //       if (!myDepartment) {
  //         return {
  //           message: "Department required for this role",
  //           exception: "HttpException",
  //         };
  //         // throw new HttpException(
  //         //   "Department required for this role",
  //         //   HttpStatus.FORBIDDEN,
  //         // );
  //       }
  //       filter.department = myDepartment;
  //       filter.role = {
  //         $in: [
  //           UserRole.EMPLOYEE,
  //           UserRole.TEAM_LEADER,
  //           UserRole.PROJECT_MANAGER,
  //         ],
  //       };
  //       break;
  //     case UserRole.EMPLOYEE:
  //       // Employee can only see their own record
  //       if (!myId) {
  //         return {
  //           message: "User ID required for this role",
  //           exception: "HttpException",
  //         };
  //         // throw new HttpException(
  //         //   "User ID required for this role",
  //         //   HttpStatus.FORBIDDEN,
  //         // );
  //       }
  //       filter._id = myId;
  //       break;
  //     default:
  //       return {
  //         message: "Invalid role",
  //         exception: "HttpException",
  //       };

  //     // throw new HttpException("Invalid role", HttpStatus.FORBIDDEN);
  //   }

  //   // If a search key is provided, add a case-insensitive regex filter on both the name and email fields to allow searching for users by either their name or email.
  //   if (searchKey) {
  //     filter.$text = { $search: searchKey };
  //   }

  //   // Apply department and role filters from query if provided (Director and HR can use these)
  //   if (
  //     department &&
  //     (myRole === UserRole.DIRECTOR || myRole === UserRole.HR)
  //   ) {
  //     filter.department = department;
  //   }
  //   if (role && (myRole === UserRole.DIRECTOR || myRole === UserRole.HR)) {
  //     // Ensure HR cannot filter for DIRECTOR role
  //     if (myRole === UserRole.HR && role === UserRole.DIRECTOR) {
  //       return {
  //         message: "HR cannot access DIRECTOR role",
  //         exception: "HttpException",
  //       };

  //       // throw new HttpException(
  //       //   "HR cannot access DIRECTOR role",
  //       //   HttpStatus.FORBIDDEN,
  //       // );
  //     }
  //     filter.role = role;
  //   }

  //   // Execute the query to find users based on the constructed filter, applying pagination using skip and limit. Simultaneously, count the total number of documents that match the filter to provide pagination metadata. Finally, return the users along with total count and total pages calculated from the total count and page size.
  //   const [users, total] = await Promise.all([
  //     this.userModel
  //       .find(filter)
  //       .skip((pageNo - 1) * pageSize)
  //       .limit(pageSize)
  //       .exec(),
  //     this.userModel.countDocuments(filter).exec(),
  //   ]);

  //   return {
  //     users,
  //     total,
  //     totalPages: Math.ceil(total / pageSize),
  //   };
  // }

  /**
   * Create a new user.
   *
   * @param {CreateUserDto} data - DTO containing user creation data.
   * @throws {ConflictException} If email already exists (duplicate key error).
   * @returns {Promise<User|{message: string, exception: string}>} Newly created user document or conflict message.
   */
  async createUser(
    data: CreateUserDto,
  ): Promise<User | { message: string; exception: string }> {
    const existing = await this.userModel.findOne({ email: data.email }).exec();

    // If a user with the provided email already exists, return an object indicating the email conflict instead of throwing an exception.
    if (existing) {
      return {
        message: "Email already exists",
        exception: "ConflictException",
      };
    }

    // Hash the user's password before saving it to the database to ensure security.
    const hashedPassword = await bcrypt.hash(
      data.password,
      config.BCRYPT_SALT_ROUNDS,
    );

    const roleExist = await this.roleService.findRoleById(data.role);

    if (!roleExist) {
      return {
        message: "Role not found",
        exception: "NotFoundException",
      };
    }

    (data as any).role = new Types.ObjectId(data.role);

    // Convert role, department, and designation fields from string IDs to MongoDB ObjectId instances before creating the user document. This ensures that the references to related documents in the database are stored correctly as ObjectIds.
    data.password = hashedPassword;

    // Validate department and designation references if provided, by sending messages to the Workforce service to check if the referenced department and designation exist. If they do not exist, return an object indicating the not found error instead of throwing an exception.
    if (data.department) {
      const departmentExist = await firstValueFrom(
        this.workForceClient.send(DEPARTMENT_COMMANDS.GET_DEPARTMENT, {
          id: data.department,
        }),
      );

      if (!departmentExist) {
        return {
          message: "Department not found",
          exception: "NotFoundException",
        };
      }
      (data as any).department = new Types.ObjectId(data.department);
    }

    // Validate designation reference if provided, by sending a message to the Workforce service to check if the referenced designation exists. If it does not exist, return an object indicating the not found error instead of throwing an exception.
    if (data.designation) {
      const designationExist = await firstValueFrom(
        this.workForceClient.send(DESIGNATION_COMMANDS.GET_DESIGNATION, {
          id: data.designation,
        }),
      );

      if (!designationExist) {
        return {
          message: "Designation not found",
          exception: "NotFoundException",
        };
      }

      if (
        data.department &&
        designationExist.departmentId.toString() !== data.department.toString()
      ) {
        return {
          message: "Designation does not belong to the specified department",
          exception: "ConflictException",
        };
      }

      (data as any).designation = new Types.ObjectId(data.designation);
    }

    const createdUser = new this.userModel(data);

    // Save the new user document to the database and return the user data without the password field.
    const newUser = await createdUser.save();
    const userObject = newUser.toObject();
    delete userObject.password;

    return userObject as User;
  }

  /**
   * Retrieve a single user by ID (minimal implementation used by JwtStrategy).
   * Returns a sanitized user object or an object indicating not found.
   */
  async getUser(
    id: MongoIdDto["id"],
  ): Promise<User | { message: string; exception: string }> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return {
        message: "User not found",
        exception: "NotFoundException",
      };
    }
    const userObj: any = user.toObject();
    delete userObj.password;
    delete userObj.otp;
    delete userObj.otpExpiry;
    return userObj as User;
  }

  /**
   * Find user by email (includes password field)
   *
   * @param {string} email - The email of the user to find, used to query the database for a user document that matches the provided email address.
   * @returns {Promise<User | null>} The user document that matches the provided email, including the password field for authentication purposes; returns null if no user is found with the given email.
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel
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
    const res = await this.userModel.findOneAndUpdate(
      { email },
      { otp: otp, otpExpiry: expiry },
      { returnDocument: "after" },
    );
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

  // /**
  //  * Update an existing user by ID.
  //  *
  //  * @param {MongoIdDto} params - Object containing the user ID.
  //  * @param {UpdateUserDto} data - DTO containing fields to update.
  //  * @throws {NotFoundException} If the user does not exist.
  //  * @returns {Promise<User>} Updated user document.
  //  */
  // async updateUser(
  //   id: MongoIdDto["id"],
  //   data: UpdateUserDto,
  // ): Promise<User | null> {
  //   const updatedUser = await this.userModel
  //     .findByIdAndUpdate(id, data, { new: true, runValidators: true })
  //     .exec();
  //   return updatedUser;
  // }

  // /**
  //  * Delete a user by ID.
  //  *
  //  * @param {MongoIdDto} params - Object containing the user ID to be deleted.
  //  * @throws {NotFoundException} If the user does not exist.
  //  * @returns {Promise<User>} Deleted user document.
  //  */
  // async deleteUser(id: MongoIdDto["id"]): Promise<User | null> {
  //   const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
  //   return deletedUser;
  // }

  /**
   *
   */
  async getUsersCountByDesignation(
    designationId: MongoIdDto["id"],
  ): Promise<number> {
    return await this.userModel
      .countDocuments({ designationId: new Types.ObjectId(designationId) })
      .exec();
  }
}
