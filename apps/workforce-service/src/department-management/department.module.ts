/**
 * @fileoverview Department Module
 *
 * Configures the Department feature module within the Workforce microservice.
 * Registers Mongoose schemas for Department, Designation and User across
 */
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import config from "@shared/config/app.config";
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
     * Mongoose Module configured with the Department schema, defining the structure of department documents in the MongoDB database.
     * This allows the Department Service to perform CRUD operations on department data, ensuring that department documents adhere to the defined schema and enabling efficient data management and retrieval.
     */
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: Designation.name, schema: DesignationSchema },
    ]),

    /**
     * Clients Module configured to register a microservice client for the Role Service, enabling communication between the API Gateway and the Role Service over TCP.
     * This allows the RoleController and RoleService to interact with the Role Service for operations such as retrieving role information, managing role data, and other role-related functionalities, facilitating a microservices architecture where different services can communicate seamlessly.
     */
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          host: config.USER_SERVICE_HOST ?? "127.0.0.1",
          port: Number(config.USER_SERVICE_PORT ?? 3001),
        },
      },
    ]),
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
