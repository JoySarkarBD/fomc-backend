import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import config from "../../../config/config";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

/**
 * Role Module responsible for managing role-related functionality within the API Gateway.
 * This module imports the ClientsModule to register a microservice client for the Role Service, enabling communication between the API Gateway and the Role Service over TCP.
 * It provides the RoleController to handle role-related HTTP requests and the RoleService to perform the business logic for role operations.
 * The module also exports relevant services and modules for use in other parts of the application.
 */
@Module({
  imports: [
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
   * Controllers responsible for handling incoming HTTP requests related to role operations, such as retrieving role information, updating role data, and other role-related functionalities.
   * The RoleController defines the endpoints and request handling logic for these operations, utilizing the RoleService to perform the necessary business logic.
   */
  controllers: [RoleController],

  /**
   * Providers responsible for implementing the business logic for role-related operations, such as interacting with the Role Service to retrieve and manage role data.
   * The RoleService contains methods that communicate with the Role Service microservice to perform operations such as fetching role details, updating role information, and other role-related functionalities, allowing for a clean separation of concerns and maintainable code structure within the API Gateway.
   */
  providers: [RoleService],
})
export class RoleModule {}
