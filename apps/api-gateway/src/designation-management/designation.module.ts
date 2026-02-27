/**
 * @fileoverview Designation gateway module.
 *
 * Registers a TCP client for the Workforce micro-service (which owns
 * designations) and wires DesignationController + DesignationService.
 */

import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import config from "@shared/config/app.config";
import { DesignationController } from "./designation.controller";
import { DesignationService } from "./designation.service";

@Module({
  imports: [
    /**
     * Clients Module configured to register a microservice client for the Workforce Service, enabling communication between the API Gateway and the Workforce Service over TCP. This allows the DesignationController and DesignationService to interact with the Workforce Service for operations such as retrieving designation information, managing designation data, and other designation-related functionalities, facilitating a microservices architecture where different services can communicate seamlessly.
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
   * Controllers responsible for handling incoming HTTP requests related to designation operations, such as creating, retrieving, updating, and deleting designations. The DesignationController defines the endpoints and request handling logic for these operations, utilizing the DesignationService to perform the necessary business logic and interact with the Workforce microservice to manage designation data effectively.
   */
  controllers: [DesignationController],

  /**
   * Providers responsible for implementing the business logic for designation-related operations, such as interacting with the Workforce Service to retrieve and manage designation data. The DesignationService contains methods that communicate with the Workforce Service microservice to perform operations such as fetching designation details, updating designation information, and other designation-related functionalities, allowing for a clean separation of concerns and maintainable code structure within the API Gateway.
   */
  providers: [DesignationService],
})
export class DesignationModule {}
