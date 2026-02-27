/**
 * @fileoverview Attendance gateway module.
 *
 * Registers a TCP client for the Workforce micro-service and wires
 * AttendanceController + AttendanceService.
 */

import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import config from "@shared/config/app.config";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";

@Module({
  imports: [
    /**
     * Clients Module configured to register microservice clients for both the User Service and Workforce Service, enabling communication between the API Gateway and these services over TCP. This allows the AttendanceController and AttendanceService to interact with the User Service for user-related operations and the Workforce Service for attendance-related operations, facilitating a microservices architecture where different services can communicate seamlessly to manage attendance data effectively.
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
        name: "WORKFORCE_SERVICE",
        transport: Transport.TCP,
        options: {
          host: config.WORKFORCE_SERVICE_HOST ?? "127.0.0.1",
          port: Number(config.WORKFORCE_SERVICE_PORT ?? 3002),
        },
      },
    ]),
  ],

  /**
   * Controllers responsible for handling incoming HTTP requests related to attendance operations, such as marking attendance, retrieving attendance records, and other attendance-related functionalities. The AttendanceController defines the endpoints and request handling logic for these operations, utilizing the AttendanceService to perform the necessary business logic and interact with the User Service and Workforce Service to manage attendance data effectively.
   */
  controllers: [AttendanceController],

  /**
   * Providers responsible for implementing the business logic for attendance-related operations, such as interacting with the User Service and Workforce Service to retrieve and manage attendance data. The AttendanceService contains methods that communicate with these microservices to perform operations such as marking attendance, fetching attendance records, and other attendance-related functionalities, allowing for a clean separation of concerns and maintainable code structure within the API Gateway.
   */
  providers: [AttendanceService],
})
export class AttendanceModule {}
