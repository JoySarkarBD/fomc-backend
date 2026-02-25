/**
 * @fileoverview Attendance Module
 *
 * Configures the Attendance feature module within the Workforce microservice.
 * Registers the User Service TCP client, Mongoose schemas for attendance,
 * and wires up the attendance controller and service.
 */
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import config from "@shared/config/app.config";
import { Attendance, AttendanceSchema } from "../schemas/attendance.schema";
import {
  WeekendExchange,
  WeekendExchangeSchema,
} from "../schemas/weekend-exchange.schema";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";

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
          host: config.USER_SERVICE_HOST ?? "127.0.0.1",
          port: Number(config.USER_SERVICE_PORT ?? 3001),
        },
      },
    ]),

    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: WeekendExchange.name, schema: WeekendExchangeSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
