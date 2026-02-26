/**
 * @fileoverview Sells Shift Management Module
 *
 * Register a TCP client for the Workforce micro-service (which owns sells shift management) and wires SellsShiftManagementController + SellsShiftManagementService.
 *
 * @module api-gateway/sells-shift-management
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
  controllers: [SellsShiftManagementController],
  providers: [SellsShiftManagementService],
})
export class SellsShiftManagementModule {}
