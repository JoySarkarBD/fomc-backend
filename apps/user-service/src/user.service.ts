import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
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
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Retrieve all users from the database.
   *
   * @returns {Promise<User[]>} Array of user documents.
   */
  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * Retrieve a single user by ID.
   *
   * @param {string} id - Unique identifier of the user.
   * @throws {NotFoundException} If the user does not exist.
   * @returns {Promise<User>} The found user document.
   */
  async getUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  /**
   * Create a new user.
   *
   * @param {CreateUserDto} data - DTO containing user creation data.
   * @throws {ConflictException} If email already exists (duplicate key error).
   * @returns {Promise<User>} Newly created user document.
   */
  async createUser(data: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
      const createdUser = new this.userModel(data);
      const newUser = await createdUser.save();
      const userObject = newUser.toObject();
      delete userObject.password;
      return userObject as User;
    } catch (error: any) {
      // MongoDB duplicate key error
      if (error?.code === 11000) {
        throw new ConflictException("Email already exists");
      }
      throw error;
    }
  }

  /**
   * Find user by email (includes password field)
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email })
      .select("+password +otp +otpExpiry")
      .exec();
  }

  /**
   * Set OTP and expiry for a user identified by email
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
   */
  async resetPassword(otp: string, newPassword: string): Promise<boolean> {
    const user = await this.userModel
      .findOne({ otp: otp, otpExpiry: { $gt: new Date() } })
      .exec();
    if (!user) return false;
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.otp = null as any;
    user.otpExpiry = null as any;
    await user.save();
    return true;
  }

  /**
   * Change password given user id and current password
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.userModel.findById(id).select("+password").exec();
    if (!user) throw new NotFoundException("User not found");
    const match = await bcrypt.compare(
      currentPassword,
      user.password as string,
    );
    if (!match) return false;
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return true;
  }

  /**
   * Update an existing user by ID.
   *
   * @param {string} id - Unique identifier of the user.
   * @param {UpdateUserDto} data - DTO containing fields to update.
   * @throws {NotFoundException} If the user does not exist.
   * @returns {Promise<User>} Updated user document.
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();

    if (!updatedUser) throw new NotFoundException("User not found");
    return updatedUser;
  }

  /**
   * Delete a user by ID.
   *
   * @param {string} id - Unique identifier of the user.
   * @throws {NotFoundException} If the user does not exist.
   * @returns {Promise<User>} Deleted user document.
   */
  async deleteUser(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException("User not found");
    return deletedUser;
  }
}
