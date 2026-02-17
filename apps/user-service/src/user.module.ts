import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConnectionsModule } from "../../common/mongoose-connections.module";
import { RoleModule } from "./role/role.module";
import { Permission, PermissionSchema } from "./schemas/permission.schema";
import { Role, RoleSchema } from "./schemas/role.schema";
import { User, UserSchema } from "./schemas/user.schema";
import { SeedRollAndPermissionModule } from "./seed/seed-role-and-permission.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

/**
 * User Module responsible for managing user-related functionality within the User Service.
 * This module imports necessary dependencies such as MongoDB connection and schema definitions.
 * It provides the UserController to handle user-related microservice messages and the UserService to perform the business logic for user operations.
 * The module also exports relevant services and modules for use in other parts of the application.
 * The User Module is designed to be a self-contained unit that encapsulates all user-related functionality, allowing for modularity and separation of concerns within the microservices architecture.
 * The module establishes a connection to MongoDB using Mongoose, defines the User schema, and sets up the necessary controllers and providers to handle user-related operations such as creating, retrieving, updating, and deleting users.
 */
@Module({
  imports: [
    /**
     * Mongoose Module configured to connect to the MongoDB database using the connection string provided in the environment variables.
     * This allows the User Service to interact with the MongoDB database for storing and retrieving user data, enabling persistence and data management for user-related operations.
     */
    MongooseConnectionsModule,

    /**
     * Mongoose Module configured with the User schema, defining the structure of user documents in the MongoDB database.
     * This allows the User Service to perform CRUD operations on user data, ensuring that user documents adhere to the defined schema and enabling efficient data management and retrieval.
     */
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        {
          name: Role.name,
          schema: RoleSchema,
        },
        {
          name: Permission.name,
          schema: PermissionSchema,
        },
      ],
      "PRIMARY_DB",
    ),
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        {
          name: Role.name,
          schema: RoleSchema,
        },
        {
          name: Permission.name,
          schema: PermissionSchema,
        },
      ],
      "SECONDARY_DB",
    ),
    RoleModule,
    SeedRollAndPermissionModule,
  ],

  /**
   * Controllers responsible for handling incoming microservice messages related to user operations, such as creating, retrieving, updating, and deleting users.
   * The UserController defines the message patterns and handling logic for these operations, utilizing the UserService to perform the necessary business logic.
   */
  controllers: [UserController],

  /**
   * Providers containing business logic for user-related operations.
   * The UserService encapsulates the core functionality for managing users,
   * including creating, retrieving, updating, and deleting user records.
   */
  providers: [UserService],
})
export class UserModule {}
