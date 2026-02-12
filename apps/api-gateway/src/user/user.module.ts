import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

/**
 * User Module responsible for managing user-related functionality within the API Gateway.
 * This module imports the ClientsModule to register a microservice client for the User Service, enabling communication between the API Gateway and the User Service over TCP.
 * It provides the UserController to handle user-related HTTP requests and the UserService to perform the business logic for user operations.
 * The module also exports relevant services and modules for use in other parts of the application.
 */
@Module({
  imports: [
    /**
     * Clients Module configured to register a microservice client for the User Service, enabling communication between the API Gateway and the User Service over TCP.
     * This allows the UserController and UserService to interact with the User Service for operations such as retrieving user information, managing user data, and other user-related functionalities, facilitating a microservices architecture where different services can communicate seamlessly.
     */
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST ?? "127.0.0.1",
          port: Number(process.env.USER_SERVICE_PORT ?? 3001),
        },
      },
    ]),
  ],

  /**
   * Controllers responsible for handling incoming HTTP requests related to user operations, such as retrieving user information, updating user data, and other user-related functionalities.
   * The UserController defines the endpoints and request handling logic for these operations, utilizing the UserService to perform the necessary business logic.
   */

  controllers: [UserController],

  /**
   * Providers responsible for implementing the business logic for user-related operations, such as interacting with the User Service to retrieve and manage user data.
   * The UserService contains methods that communicate with the User Service microservice to perform operations such as fetching user details, updating user information, and other user-related functionalities, allowing for a clean separation of concerns and maintainable code structure within the API Gateway.
   */
  providers: [UserService],
})
export class UserModule {}
