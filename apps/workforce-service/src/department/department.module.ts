import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConnectionsModule } from "../../../common/mongoose-connections.module";
import {
  User,
  UserSchema,
} from "../../../user-service/src/schemas/user.schema";
import { Department, DepartmentSchema } from "../schemas/department.schema";
import { Designation, DesignationSchema } from "../schemas/designation.schema";
import { DepartmentController } from "./department.controller";
import { DepartmentService } from "./department.service";

/**
 * Department Module is responsible for managing department-related functionality within the Workforce Service. It provides the necessary services and controllers to handle department-related operations such as creating, retrieving, updating, and deleting departments. The module is designed to be a self-contained unit that encapsulates all department-related functionality, allowing for modularity and separation of concerns within the microservices architecture. By defining the DepartmentModule, we can easily manage departments and their associated data, ensuring that the Workforce Service can effectively handle department-related operations.
 */
@Module({
  imports: [
    /**
     * Mongoose Module configured to connect to the MongoDB database using the connection string provided in the environment variables.
     * This allows the Role Service to interact with the MongoDB database for storing and retrieving role data, enabling persistence and data management for role-related operations.
     */
    MongooseConnectionsModule,

    /**
     * Mongoose Module configured with the Department schema, defining the structure of department documents in the MongoDB database.
     * This allows the Department Service to perform CRUD operations on department data, ensuring that department documents adhere to the defined schema and enabling efficient data management and retrieval.
     */
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Department.name, schema: DepartmentSchema },
      { name: Designation.name, schema: DesignationSchema },
    ]),
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Department.name, schema: DepartmentSchema },
        { name: Designation.name, schema: DesignationSchema },
      ],
      "PRIMARY_DB",
    ),
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          schema: UserSchema,
        },
        { name: Department.name, schema: DepartmentSchema },
        { name: Designation.name, schema: DesignationSchema },
      ],
      "SECONDARY_DB",
    ),
  ],

  /**
   * Controllers are Department Module, responsible for handling incoming requests related to department operations and returning appropriate responses. The DepartmentController defines the routes and endpoints for department-related operations, allowing clients to interact with the Workforce Service to manage departments effectively.
   */
  controllers: [DepartmentController],

  /**
   * Providers for the Department Module, responsible for implementing the business logic and data access for department-related operations. The DepartmentService contains methods for creating, retrieving, updating, and deleting departments, as well as any additional logic required to manage department data effectively within the Workforce Service.
   */
  providers: [DepartmentService],
})
export class DepartmentModule {}
