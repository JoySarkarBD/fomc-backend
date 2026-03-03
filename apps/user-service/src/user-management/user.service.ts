/**
 * @fileoverview User service stub. Business logic methods are currently commented out.
 */
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import config from "@shared/config/app.config";
import { DEPARTMENT_COMMANDS } from "@shared/constants";
import { DESIGNATION_COMMANDS } from "@shared/constants/designation-command.constants";
import { SELLS_SHIFT_MANAGEMENT_COMMANDS } from "@shared/constants/sells-shift-management.constants";
import {
  MongoIdDto,
  SalesDeptIdDto,
  UserIdDto,
} from "@shared/dto/mongo-id.dto";
import { convertToBDDate } from "@shared/utils/convert-to-db-date";
import { getSignedUrl } from "@shared/utils/minio.client";
import * as bcrypt from "bcrypt";
import { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { RoleService } from "../role-management/role.service";
import { Role } from "../schemas/role.schema";
import { User, UserDocument, WeekEndOff } from "../schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { UserSearchQueryDto } from "./dto/user-search-query.dto";

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
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @Inject(RoleService) private readonly roleService: RoleService,
  ) {}

  /**
   * Retrieve all users from the database.
   *
   * @param {UserRole} myRole - Role of the requesting user to apply role-based access control.
   * @param {UserSearchQueryDto} query - Optional search query parameters for filtering users.
   * @param {MongoIdDto["id"]} myId - ID of the requesting user.
   * @param {Department} myDepartment - Department of the requesting user.
   * @returns {Promise<{users: User[]; total: number; totalPages: number}>} Array of user documents with pagination info.
   */
  async getUsers(
    query: UserSearchQueryDto,
  ): Promise<
    | { users: any[]; total: number; totalPages: number }
    | { message: string; exception: any }
  > {
    const { role, department, designation, pageNo, pageSize } = query;
    const searchKey =
      typeof query.searchKey === "string" ? query.searchKey : "";

    const filter: any = {};

    if (role?.length) {
      filter.role = {
        $in: role.map((id) => new Types.ObjectId(id)),
      };
    }

    if (department?.length) {
      filter.department = {
        $in: department.map((id) => new Types.ObjectId(id)),
      };
    }

    if (designation?.length) {
      filter.designation = {
        $in: designation.map((id) => new Types.ObjectId(id)),
      };
    }

    if (searchKey) {
      filter.$or = [
        { name: { $regex: searchKey, $options: "i" } },
        { email: { $regex: searchKey, $options: "i" } },
        { employeeId: { $regex: searchKey, $options: "i" } },
      ];
    }

    const skip = (pageNo - 1) * pageSize;

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .skip(skip)
        .limit(pageSize)
        .populate("role", "name")
        .lean()
        .exec(),
      this.userModel.countDocuments(filter),
    ]);

    if (!users.length) {
      return {
        users: [],
        total: 0,
        totalPages: 0,
      };
    }

    const designationIds = Array.from(
      new Set(
        users
          .map((user: any) => user.designation?.toString())
          .filter((id): id is string => Boolean(id)),
      ),
    );

    const designationMap = new Map<string, any>();

    if (designationIds.length) {
      const designations = await firstValueFrom(
        this.workForceClient.send(
          DESIGNATION_COMMANDS.GET_DESIGNATIONS_BY_IDS,
          { ids: designationIds },
        ),
      );

      if (Array.isArray(designations)) {
        designations.forEach((item: any) => {
          designationMap.set(item?._id?.toString(), item);
        });
      }
    }

    const formattedUsers = await Promise.all(
      users.map(async (user: any) => {
        const designationData = user.designation
          ? designationMap.get(user.designation.toString())
          : null;

        delete user.password;
        delete user.otp;
        delete user.otpExpiry;

        return {
          _id: user._id,
          name: user.name,
          avatar: user.avatar
            ? await getSignedUrl(
                user.avatar,
                config.MINIO_OBJECT_EXPIRATION_SECONDS_FOR_AVATAR,
              )
            : null,
          employeeId: user.employeeId,
          phoneNumber: user.phoneNumber,
          email: user.email,
          secondaryEmail: user.secondaryEmail ?? null,
          role: user.role?.name || null,
          department: designationData?.departmentId?.name || null,
          designation: designationData?.name || null,
          isBlocked: user.isBlocked,
          employmentStatus: user.employmentStatus,
          resignedDates: user.resignedDates || [],
          reJoiningDates: user.reJoiningDates || [],
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }),
    );

    return {
      users: formattedUsers,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

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
  async getUser(id: MongoIdDto["id"]): Promise<any> {
    const user = await this.userModel
      .findById(id)
      .populate({
        path: "role",
        select: "name",
      })
      .exec();

    if (!user) {
      return {
        message: "User not found",
        exception: "NotFoundException",
      };
    }

    // Fetch designation details if designation reference exists, to include the designation name in the returned user object for easier access in authorization checks.
    const designation = await firstValueFrom(
      this.workForceClient.send(DESIGNATION_COMMANDS.GET_DESIGNATION, {
        id: user.designation,
      }),
    );

    const userObj: any = user.toObject();
    delete userObj.password;
    delete userObj.otp;
    delete userObj.otpExpiry;

    // Replace the role field with the role name for easier access in the JwtStrategy, since we only need the role name for authorization checks and not the entire role document.
    userObj.role =
      typeof userObj.role === "object" && "name" in userObj.role
        ? userObj.role.name
        : null;
    userObj.designation = designation?.name || null;
    userObj.department = designation?.departmentName || null;
    userObj.avatar = userObj.avatar
      ? await getSignedUrl(
          userObj.avatar,
          config.MINIO_OBJECT_EXPIRATION_SECONDS_FOR_AVATAR,
        )
      : null;

    return userObj;
  }

  /**
   * Retrieve admin and project manager users for sales shift management.
   */
  async getAdminAndSellsProjectManagerUser(
    salesDeptId: SalesDeptIdDto["salesDeptId"],
  ): Promise<any> {
    const [superAdminRole, projectManagerRole] = await Promise.all([
      this.roleModel.findOne({ name: "SUPER ADMIN" }).lean(),
      this.roleModel.findOne({ name: "PROJECT MANAGER" }).lean(),
    ]);

    const roleIds = [superAdminRole?._id, projectManagerRole?._id].filter(
      Boolean,
    );

    // Users should have to be SUPER ADMIN or PROJECT MANGER - He should also belong to sales department
    const users = await this.userModel
      .find({
        role: { $in: roleIds.filter((id): id is Types.ObjectId => !!id) },
        department: salesDeptId,
      })
      .select("_id")
      .lean();

    return users;
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
   * Get the count of users associated with a specific designation.
   *
   * @param {MongoIdDto} params - Object containing the designation ID.
   * @returns {Promise<number>} The count of users that have the specified designation ID in their user document's designation field, which is used to determine how many users are assigned to that particular designation in the system.
   */
  async getUsersCountByDesignation(
    designationId: MongoIdDto["id"],
  ): Promise<number> {
    return await this.userModel
      .countDocuments({ designationId: new Types.ObjectId(designationId) })
      .exec();
  }

  /**
   * Get the count of users associated with a specific department.
   *
   * @param {MongoIdDto} params - Object containing the department ID.
   * @returns {Promise<number>} The count of users that have the specified department ID in their user document's department field, which is used to determine how many users are assigned to that particular department in the system.
   */
  async getUsersCountByDepartment(userId: MongoIdDto["id"]): Promise<number> {
    return await this.userModel
      .countDocuments({ department: new Types.ObjectId(userId) })
      .exec();
  }

  /**
   * Update the authenticated user's profile (name and avatar only).
   *
   * @param {MongoIdDto} params - Object containing the user ID.
   * @param {UpdateUserProfileDto} data - DTO containing the fields to update (name and/or avatar).
   * @returns {Promise<any>} The updated user object with populated role and designation details, or an object indicating that the user was not found.
   */
  async updateUserProfile(
    id: MongoIdDto["id"],
    data: UpdateUserProfileDto,
  ): Promise<any> {
    const update: Partial<Pick<User, "name" | "avatar">> = {};

    if (data.name !== undefined) update.name = data.name;
    if (data.avatar !== undefined) update.avatar = data.avatar;

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .exec();

    if (!updatedUser) {
      return {
        message: "User not found",
        exception: "NotFoundException",
      };
    }

    const userObj = (await this.getUser(updatedUser._id.toString())) as any;

    return userObj;
  }

  /**
   * Update the authenticated user's weekend off.
   *
   * @param {MongoIdDto} params - Object containing the user ID.
   * @param {WeekEndOff} weekEndOff - The new weekend off value to be set for the user.
   * @returns {Promise<any>} The updated user object with the new weekend off value, or an object indicating that the user was not found.
   */
  async updateWeekendOff(
    userId: UserIdDto["userId"],
    weekEndOff: WeekEndOff,
  ): Promise<any> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        new Types.ObjectId(userId),
        { weekEndOff },
        {
          returnDocument: "after",
          runValidators: true,
        },
      )
      .exec();

    if (!updatedUser) {
      return {
        message: "User not found",
        exception: "NotFoundException",
      };
    }

    // Notify the Workforce service about the user's weekend off update, so that any necessary adjustments can be made to the user's shift assignments or schedules based on the new weekend off value.
    await firstValueFrom(
      this.workForceClient.send(
        SELLS_SHIFT_MANAGEMENT_COMMANDS.USER_WEEKEND_UPDATE,
        {
          userId,
          weekEndOff,
          today: convertToBDDate(new Date()),
        },
      ),
    );
    const userObj = (await this.getUser(updatedUser._id.toString())) as any;

    delete userObj.password;
    delete userObj.otp;
    delete userObj.otpExpiry;

    return userObj;
  }
}
