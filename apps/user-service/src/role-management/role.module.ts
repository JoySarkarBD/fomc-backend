/** @fileoverview Role module. Registers Mongoose schemas, controllers, and providers for role management. @module user-service/role/role.module */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Permission, PermissionSchema } from "../schemas/permission.schema";
import { Role, RoleSchema } from "../schemas/role.schema";
import { User, UserSchema } from "../schemas/user.schema";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

/**
 * Role Module is responsible for managing user roles within the application. It provides the necessary services and controllers to handle role-related operations such as creating, retrieving, updating, and deleting roles. The module is designed to be a self-contained unit that encapsulates all role-related functionality, allowing for modularity and separation of concerns within the microservices architecture. By defining the RoleModule, we can easily manage user roles and their associated permissions, ensuring that users have the appropriate access levels within the application.
 */
@Module({
  imports: [
    /**
     * Mongoose Module configured with the Role schema, defining the structure of role documents in the MongoDB database.
     * This allows the Role Service to perform CRUD operations on role data, ensuring that role documents adhere to the defined schema and enabling efficient data management and retrieval.
     */
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],

  /**
   * Controllers for the Role Module, responsible for handling incoming requests related to role operations and delegating them to the appropriate services for processing. The RoleController defines the endpoints and request handlers for managing roles, allowing clients to interact with the Role Service through defined API routes.
   */
  controllers: [RoleController],

  /**
   * Providers for the Role Module, responsible for implementing the business logic and data access for role-related operations. The RoleService contains methods for creating, retrieving, updating, and deleting roles, as well as any additional logic related to role management. By defining the RoleService as a provider, we can inject it into controllers and other services that require role-related functionality, promoting modularity and separation of concerns within the application.
   */
  providers: [RoleService],
})
export class RoleModule {}
