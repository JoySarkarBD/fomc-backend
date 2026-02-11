import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

/**
 * UserModule
 *
 * Responsible for configuring and providing all user-related
 * dependencies including:
 *  - MongoDB connection
 *  - User Mongoose schema registration
 *  - UserController
 *  - UserService
 *
 * This module encapsulates user domain logic and database interaction.
 */
@Module({
  imports: [
    /**
     * Establish MongoDB connection.
     *
     * Priority order:
     * 1. MONGO_URI (preferred)
     * 2. MONGODB_URI (fallback)
     * 3. Local development default URI
     */
    MongooseModule.forRoot(
      process.env.MONGO_URI ??
        process.env.MONGODB_URI ??
        'mongodb://127.0.0.1:27017/office-management',
    ),

    /**
     * Registers the User schema for dependency injection
     * within this module.
     */
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],

  /**
   * Controllers handling incoming microservice messages.
   */
  controllers: [UserController],

  /**
   * Providers containing business logic.
   */
  providers: [UserService],
})
export class UserModule {}
