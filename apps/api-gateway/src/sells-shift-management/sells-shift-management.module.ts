/**
 * @fileoverview Sells Shift Management Module
 *
 * Register a TCP client for the Workforce micro-service (which owns sells shift management) and wires SellsShiftManagementController + SellsShiftManagementService.
 */

import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import config from "@shared/config/app.config";
import { SellsShiftManagementController } from "./sells-shift-management.controller";
import { SellsShiftManagementService } from "./sells-shift-management.service";

@Module({
  imports: [
    /**
     * Clients Module configured to register a microservice client for the Workforce Service, enabling communication between the API Gateway and the Workforce Service over TCP.
     * This allows the SellsShiftManagementController and SellsShiftManagementService to interact with the Workforce Service for operations such as retrieving workforce information, managing workforce data, and other workforce-related functionalities, facilitating a microservices architecture where different services can communicate seamlessly.
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
   * Controllers responsible for handling incoming HTTP requests related to sells shift management operations, such as retrieving sells shift information, updating sells shift data, and other sells shift-related functionalities.
   * The SellsShiftManagementController defines the endpoints and request handling logic for these operations, utilizing the SellsShiftManagementService to perform the necessary business logic.
   */
  controllers: [SellsShiftManagementController],

  /**
   * Providers responsible for implementing the business logic for sells shift management operations, such as interacting with the Workforce Service to retrieve and manage workforce data related to sells shifts.
   * The SellsShiftManagementService contains methods that communicate with the Workforce Service microservice to perform operations such as fetching workforce details, updating workforce information, and other workforce-related functionalities, allowing for a clean separation of concerns and maintainable code structure within the API Gateway.
   */
  providers: [SellsShiftManagementService],
})
export class SellsShiftManagementModule {}
