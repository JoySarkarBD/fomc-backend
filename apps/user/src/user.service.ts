import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

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
    if (!user) throw new NotFoundException('User not found');
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
      const createdUser = new this.userModel(data);
      return await createdUser.save();
    } catch (error: any) {
      // MongoDB duplicate key error
      if (error?.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
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

    if (!updatedUser) throw new NotFoundException('User not found');
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
    if (!deletedUser) throw new NotFoundException('User not found');
    return deletedUser;
  }
}
