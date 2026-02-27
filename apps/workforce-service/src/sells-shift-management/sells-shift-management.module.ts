/**
 * @fileoverview Sells Shift Management Module
 *
 * This module encapsulates the functionality related to managing sells shift management records in the Workforce service. It includes the controller and service responsible for handling operations such as creating new sells shift management records for users and retrieving existing records based on user ID.
 */

import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import config from "@shared/config/app.config";
import { Department, DepartmentSchema } from "../schemas/department.schema";
import {
  SalesShiftAssignment,
  SalesShiftAssignmentSchema,
} from "../schemas/sales-shift-assignment.schema";
import {
  ShiftExchange,
  ShiftExchangeSchema,
} from "../schemas/shift-exchange.schema";
import { SellsShiftManagementController } from "./sells-shift-management.controller";
import { SellsShiftManagementService } from "./sells-shift-management.service";

@Module({
  imports: [
    /**
     * Mongoose Module configured with the Sales shift management schema, defining the structure of department documents in the MongoDB database.
     * This allows the Sells Shift Management Service to perform CRUD operations on the data, ensuring that department documents adhere to the defined schema and enabling efficient data management and retrieval.
     */
    MongooseModule.forFeature([
      {
        name: SalesShiftAssignment.name,
        schema: SalesShiftAssignmentSchema,
      },
      {
        name: ShiftExchange.name,
        schema: ShiftExchangeSchema,
      },
      {
        name: Department.name,
        schema: DepartmentSchema,
      },
    ]),

    /**
     * Clients Module configured to register microservice clients, enabling communication between the Workforce Service and other services over TCP.
     * This allows the Sells Shift Management Service to interact with the User Service and Notification Service microservices, facilitating operations such as retrieving user information and sending notifications related to sells shift management activities, while maintaining a decoupled architecture and promoting scalability within the API Gateway.
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
      {
        name: "NOTIFICATION_SERVICE",
        transport: Transport.TCP,
        options: {
          host: config.NOTIFICATION_SERVICE_HOST ?? "127.0.0.1",
          port: Number(config.NOTIFICATION_SERVICE_PORT ?? 3004),
        },
      },
    ]),
  ],

  /**
   * Controllers responsible for handling incoming HTTP requests related to sells shift management operations, such as retrieving sells shift information, updating sells shift data, and other sells shift-related functionalities.
   * The SellsShiftManagementController defines the endpoints and request handling logic for these operations, utilizing the SellsShiftManagementService to perform the necessary business logic.
   */
  controllers: [SellsShiftManagementController],

  /**
   * Providers responsible for implementing the business logic for sells shift management operations, such as interacting with the Workforce Service to retrieve and manage workforce data related to sells shifts.
   * The SellsShiftManagementService contains methods that communicate with the Workforce Service microservice to perform operations such as fetching workforce details, updating workforce information, and other workforce-related functionalities, allowing for a clean separation of concerns and maintainable code structure within the API Gateway.
   */
  providers: [SellsShiftManagementService],
  exports: [SellsShiftManagementService],
})
export class SellsShiftManagementModule {}
