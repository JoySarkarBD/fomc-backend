import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument, UserRole } from './entities/user.entity';

/**
 * Service for managing users.
 * Provides methods for creating, retrieving, updating, and deleting users.
 * @class UserService
 */
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {} // Injecting User model

  /**
   * Map a Mongoose document into the public User shape.
   *
   * @param {UserDocument} doc - Mongoose user document.
   * @returns {User} Mapped user object.
   */
  private mapToUser(doc: UserDocument): User {
    return {
      id: doc._id.toString(),
      employeeId: doc.employeeId ?? null,
      name: doc.name,
      email: doc.email,
      role: doc.role ?? UserRole.EMPLOYEE,
      department: doc.department ?? null,
    } as User;
  }

  /**
   * Creates a new user.
   * @param {CreateUserInput} createUserInput - Input data for creating a user.
   * @returns {Promise<User>} The created user.
   */
  async create(createUserInput: CreateUserInput): Promise<User> {
    // Find if a user with the same email already exists
    const existingUser = await this.userModel.findOne({
      email: createUserInput.email,
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email ${createUserInput.email} already exists`,
      );
    }
    // Create a new user document in the database
    const created = await this.userModel.create(createUserInput);
    // Return the user with the id field mapped from _id
    return this.mapToUser(created);
  }

  /**
   * Retrieves all users.
   * @returns {Promise<User[]>} List of all users.
   */
  async findAll(): Promise<User[]> {
    // Retrieve all user documents from the database
    const docs = await this.userModel.find().exec();
    //  Map Mongoose documents to User objects
    return docs.map((doc) => this.mapToUser(doc));
  }

  /**
   * Retrieves a user by ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<User | null>} The user if found, otherwise null.
   */
  async findOne(id: string): Promise<User | null> {
    // Find a user document by its ID
    const doc = await this.userModel.findById(id).exec();
    // Convert the Mongoose document to a plain JavaScript object
    if (!doc) return null;
    // Return the user with the id field mapped from _id
    return this.mapToUser(doc);
  }

  /**
   * Updates an existing user.
   * @param {string} id - The ID of the user to update.
   * @param {UpdateUserInput} updateUserInput - Input data for updating a user.
   * @returns {Promise<User>} The updated user.
   */
  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    // Find and update the user document by its ID
    const doc = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserInput }, { new: true })
      .exec();
    // Convert the Mongoose document to a plain JavaScript object
    if (!doc) throw new NotFoundException(`User ${id} not found`);
    // Return the user with the id field mapped from _id
    return this.mapToUser(doc);
  }

  /**
   * Removes a user by ID.
   * @param {string} id - The ID of the user to remove.
   * @returns {Promise<User>} The removed user.
   */
  async remove(id: string): Promise<User> {
    // Find and delete the user document by its ID
    const doc = await this.userModel.findByIdAndDelete(id).exec();
    // Convert the Mongoose document to a plain JavaScript object
    if (!doc) throw new NotFoundException(`User ${id} not found`);
    // Return the user with the id field mapped from _id
    return this.mapToUser(doc);
  }
}
