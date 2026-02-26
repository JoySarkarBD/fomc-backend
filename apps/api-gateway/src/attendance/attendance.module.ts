/**
 * @fileoverview Attendance gateway module.
 *
 * Registers a TCP client for the Workforce micro-service and wires
 * AttendanceController + AttendanceService.
 *
 * @module api-gateway/attendance
 */

import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import config from "@shared/config/app.config";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          host: config.USER_SERVICE_HOST ?? "127.0.0.1",
          port: Number(config.USER_SERVICE_PORT ?? 3001),
        },
      },
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
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
