/**
 * @fileoverview Leave Module
 *
 * Configures the Leave feature module within the Workforce microservice.
 * Registers Mongoose schemas for Department, Leave and User across
 */
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import config from "@shared/config/app.config";
import { Leave, LeaveSchema } from "../schemas/leave.schema";
import { LeaveController } from "./leave.controller";
import { LeaveService } from "./leave.service";

@Module({
  imports: [
    /**
     * Mongoose Module configured with the Leave schema, defining the structure of leave documents in the MongoDB database.
     * This allows the Leave Service to perform CRUD operations on leave data, ensuring that leave documents adhere to the defined schema and enabling efficient data management and retrieval.
     */
    MongooseModule.forFeature([
      {
        name: Leave.name,
        schema: LeaveSchema,
      },
    ]),

    /**
     * Clients Module configured to register a microservice client for the User Service and Notification Service, enabling communication between the Workforce Service and these services over TCP.
     * This allows the Leave Service to interact with the User Service and Notification Service microservices, facilitating operations such as retrieving user information and sending notifications related to leave management activities, while maintaining a decoupled architecture and promoting scalability within the API Gateway.
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
          port: Number(config.NOTIFICATION_SERVICE_PORT ?? 3002),
        },
      },
    ]),
  ],

  /**
   * Controllers are Leave Module, responsible for handling incoming requests related to leave operations and returning appropriate responses. The LeaveController defines the routes and endpoints for leave-related operations, allowing clients to interact with the Workforce Service to manage leaves effectively.
   */
  controllers: [LeaveController],

  /**
   * Providers for the Leave Module, responsible for implementing the business logic and data access for leave-related operations. The LeaveService contains methods for creating, retrieving, updating, and deleting leaves, as well as any additional logic required to manage leave data effectively within the Workforce Service.
   */
  providers: [LeaveService],
})
export class LeaveModule {}
