/**
 * @fileoverview Notification Service module. Registers Mongoose schemas, controllers, and providers for notification management.
 */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConnectionsModule } from "@shared/database/mongoose-connections.module";
import { NotificationServiceController } from "./notification-service.controller";
import { NotificationServiceService } from "./notification-service.service";
import { Notification, NotificationSchema } from "./schema/notification.schema";

/**
 * NotificationServiceModule is responsible for managing notification-related functionality within the Notification Service.
 * This module imports necessary dependencies such as MongoDB connection and schema definitions.
 * It provides the NotificationServiceController to handle notification-related microservice messages and the NotificationServiceService to perform the business logic for notification operations.
 * The module also exports relevant services and modules for use in other parts of the application.
 * The Notification Service Module is designed to be a self-contained unit that encapsulates all notification-related functionality, allowing for modularity and separation of concerns within the microservices architecture.
 * The module establishes a connection to MongoDB using Mongoose, defines the Notification schema, and sets up the necessary controllers and providers to handle notification-related operations such as creating notifications, retrieving user notifications, and marking notifications as read or unread.
 */
@Module({
  imports: [
    /**
     * Mongoose Module configured to connect to the MongoDB database using the connection string provided in the environment variables.
     * This allows the Notification Service to interact with the MongoDB database for storing and retrieving notification data, enabling persistence and data management for notification-related operations.
     */
    MongooseConnectionsModule,

    /**
     * Mongoose Module configured with the Notification schema, defining the structure of notification documents in the MongoDB database.
     * This allows the Notification Service to perform CRUD operations on notification data, ensuring that notification documents adhere to the defined schema and enabling efficient data management and retrieval.
     */
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],

  /**
   * Controllers for the Notification Service. The NotificationServiceController is responsible for handling incoming message patterns related to notifications and delegating business logic to the NotificationServiceService.
   */
  controllers: [NotificationServiceController],

  /**
   * Providers for the Notification Service. The NotificationServiceService contains the business logic for managing notifications, including creating notifications, retrieving user notifications, and marking notifications as read or unread.
   */
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
