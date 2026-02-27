/**
 * @fileoverview Attendance Module
 *
 * Configures the Attendance feature module within the Workforce microservice.
 * Registers the User Service TCP client, Mongoose schemas for attendance,
 * and wires up the attendance controller and service.
 */
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import config from "@shared/config/app.config";
import { Attendance, AttendanceSchema } from "../schemas/attendance.schema";
import {
  WeekendExchange,
  WeekendExchangeSchema,
} from "../schemas/weekend-exchange.schema";
import { SellsShiftManagementModule } from "../sells-shift-management/sells-shift-management.module";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";

@Module({
  imports: [
    /**
     * Mongoose Module configured with the Attendance and Weekend Exchange schemas, defining the structure of attendance and weekend exchange documents in the MongoDB database.
     * This allows the Attendance Service to perform CRUD operations on attendance and weekend exchange data, ensuring that documents adhere to the defined schemas and enabling efficient data management and retrieval.
     * By defining the schemas for attendance and weekend exchange, we can ensure that the data stored in the MongoDB database is consistent and follows the expected structure, allowing for effective management of attendance records and weekend exchange information within the Workforce Service.
     */
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: WeekendExchange.name, schema: WeekendExchangeSchema },
    ]),

    /**
     * Clients Module configured to register a microservice client for the User Service, enabling communication between the API Gateway and the User Service over TCP.
     * This allows the UserController and UserService to interact with the User Service for operations such as retrieving user information, managing user data, and other user-related functionalities, facilitating a microservices architecture where different services can communicate seamlessly.
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

    SellsShiftManagementModule,
  ],

  /**
   * Controllers are Attendance Module, responsible for handling incoming requests related to attendance operations and returning appropriate responses. The AttendanceController defines the routes and endpoints for attendance-related operations, allowing clients to interact with the Workforce Service to manage attendance effectively.
   */
  controllers: [AttendanceController],

  /**
   * Providers for the Attendance Module, responsible for implementing the business logic and data access for attendance-related operations. The AttendanceService contains methods for creating, retrieving, updating, and deleting attendance records, as well as any additional logic required to manage attendance data effectively within the Workforce Service.
   */
  providers: [AttendanceService],
})
export class AttendanceModule {}
