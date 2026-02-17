import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import config from "../../../config/config";
import { DepartmentController } from "./department.controller";
import { DepartmentService } from "./department.service";

/**
 * Department Module responsible for handling all department-related operations, including creating, retrieving, updating, and deleting departments. It imports the DepartmentController to manage HTTP requests and the DepartmentService to perform business logic and interact with the Department microservice via ClientProxy. This module serves as a central point for managing department-related functionality within the API Gateway.
 * The DepartmentController defines endpoints for department operations, while the DepartmentService contains methods that communicate with the Department microservice to perform the necessary actions, ensuring a clean separation of concerns and maintainable code structure within the API Gateway.
 */
@Module({
  imports: [
    /**
     * Clients Module configured to register a microservice client for the Department Service, enabling communication between the API Gateway and the Department Service over TCP. This allows the DepartmentController and DepartmentService to interact with the Department Service for operations such as retrieving department information, managing department data, and other department-related functionalities, facilitating a microservices architecture where different services can communicate seamlessly.
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
   * Controllers responsible for handling incoming HTTP requests related to department operations, such as creating, retrieving, updating, and deleting departments. The DepartmentController defines the endpoints and request handling logic for these operations, utilizing the DepartmentService to perform the necessary business logic and interact with the Department microservice to manage department data effectively.
   */
  controllers: [DepartmentController],

  /**
   * Providers responsible for implementing the business logic for department-related operations, such as interacting with the Department Service to retrieve and manage department data. The DepartmentService contains methods that communicate with the Department Service microservice to perform operations such as fetching department details, updating department information, and other department-related functionalities, allowing for a clean separation of concerns and maintainable code structure within the API Gateway.
   */
  providers: [DepartmentService],
})
export class DepartmentModule {}
