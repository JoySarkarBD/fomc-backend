import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

/**
 * AppModule is the root module of the API Gateway application.
 * It imports feature modules such as UserModule and AuthModule, which handle user-related and authentication-related functionality, respectively.
 * The AppController is registered as the main controller for handling incoming HTTP requests, and the AppService is registered as a provider for application-level services.
 * This module serves as the entry point for the API Gateway application, orchestrating the various modules and services to provide a cohesive API experience.
 */
@Module({
  /**
   * Imports the UserModule and AuthModule, which are responsible for managing user-related and authentication-related functionality within the API Gateway.
   * The UserModule handles operations related to user management, such as retrieving user information and managing user data, while the AuthModule manages authentication processes, including user registration, login, password reset, and password change.
   * By importing these modules, the AppModule integrates their functionality into the API Gateway, allowing it to provide comprehensive user and authentication services to clients.
   */
  imports: [UserModule, AuthModule],

  /**
   * Controllers responsible for handling incoming HTTP requests. The AppController is registered as the main controller for the API Gateway, defining endpoints and request handling logic for basic operations, such as a health check endpoint at the root ("/") that returns a status message indicating that the API Gateway is running.
   * The AppController can also be expanded in the future to include additional endpoints for other basic functionalities as needed.
   */
  controllers: [AppController],

  /**
   * Providers responsible for implementing application-level services. The AppService is registered as a provider, which can contain methods and logic that support the overall functionality of the API Gateway, such as providing responses for basic endpoints or other utility functions that may be used across different controllers and modules within the application.
   * The AppService can be expanded in the future to include additional methods and logic as the API Gateway's functionality grows and evolves.
   */
  providers: [AppService],
})
export class AppModule {}
