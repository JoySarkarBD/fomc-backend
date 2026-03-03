/**
 * @fileoverview Leave gateway module.
 *
 * Registers a TCP client for the Workforce micro-service and wires
 * LeaveController + LeaveService.
 */

import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import config from "@shared/config/app.config";
import { LeaveController } from "./leave.controller";
import { LeaveService } from "./leave.service";

@Module({
  imports: [
    /**
     * Clients Module configured to register microservice clients for both the Workforce Service, enabling communication between the API Gateway and the Workforce Service over TCP. This allows the LeaveController and LeaveService to interact with the Workforce Service for leave-related operations, facilitating a microservices architecture where different services can communicate seamlessly to manage leave data effectively.
     */
    ClientsModule.register([
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
   * Controllers responsible for handling incoming HTTP requests related to leave operations, such as marking leave, retrieving leave records, and other leave-related functionalities. The LeaveController defines the endpoints and request handling logic for these operations, utilizing the LeaveService to perform the necessary business logic and interact with the User Service and Workforce Service to manage leave data effectively.
   */
  controllers: [LeaveController],

  /**
   * Providers responsible for implementing the business logic for leave-related operations, such as interacting with the User Service and Workforce Service to retrieve and manage leave data. The LeaveService contains methods that communicate with these microservices to perform operations such as marking leave, fetching leave records, and other leave-related functionalities, allowing for a clean separation of concerns and maintainable code structure within the API Gateway.
   */
  providers: [LeaveService],
})
export class LeaveModule {}
