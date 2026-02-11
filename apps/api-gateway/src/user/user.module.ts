import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { UserService } from './user.service';

/**
 * UserModule (API Gateway)
 *
 * Responsible for:
 * - Registering the USER_SERVICE microservice client
 * - Handling incoming HTTP requests related to users
 * - Forwarding requests to the User microservice via TCP transport
 *
 * This module acts as a bridge between the HTTP layer
 * and the User microservice.
 */
@Module({
  imports: [
    /**
     * Registers a microservice client for the User Service.
     *
     * Transport: TCP
     * Used for internal service-to-service communication.
     *
     * Environment Variables:
     * - USER_SERVICE_HOST
     * - USER_SERVICE_PORT
     *
     * Defaults:
     * - Host: 127.0.0.1
     * - Port: 3001
     */
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST ?? '127.0.0.1',
          port: Number(process.env.USER_SERVICE_PORT ?? 3001),
        },
      },
    ]),
  ],

  /**
   * HTTP controllers handling user-related API routes.
   */
  controllers: [UserController],

  /**
   * Providers containing gateway-level business logic.
   */
  providers: [UserService],
})
export class UserModule {}
