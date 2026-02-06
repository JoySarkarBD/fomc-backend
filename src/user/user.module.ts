import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

/**
 * UserModule is responsible for managing user-related functionalities,
 * including GraphQL resolvers and Mongoose model integration.
 * @module UserModule
 * @requires UserService
 * @requires UserResolver
 * @requires MongooseModule
 * @exports UserService
 * @exports UserResolver
 * @description
 * This module imports the MongooseModule to register the User model with its schema.
 * It provides the UserService and UserResolver for handling user operations
 * and GraphQL queries/mutations respectively.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Registering User model
  ],
  providers: [UserResolver, UserService], // Providing resolver and service
  exports: [UserService, UserResolver], // Exporting for use in other modules
})
export class UserModule {}
