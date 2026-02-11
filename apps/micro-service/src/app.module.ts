import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

/**
 * AppModule
 *
 * Root module of the API Gateway application.
 *
 * Responsibilities:
 * - Import feature modules (e.g., UserModule)
 * - Register global controllers
 * - Provide application-level services
 *
 * This module acts as the main entry point
 * for the HTTP API Gateway.
 */
@Module({
  /**
   * Feature modules imported into the application.
   */
  imports: [
    /**
     * UserModule
     *
     * Handles user-related API routes
     * and communicates with the User microservice.
     */
    UserModule,
  ],

  /**
   * Root-level controllers.
   */
  controllers: [AppController],

  /**
   * Root-level providers (services).
   */
  providers: [AppService],
})
export class AppModule {}
