/**
 * @fileoverview Task gateway module.
 *
 * Registers a TCP client for the Workforce micro-service and wires
 * TaskController + TaskService.
 */
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import config from "@shared/config/app.config";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";

@Module({
  imports: [
    /**
     * Clients Module configured to register a microservice client for the Workforce Service, enabling communication between the API Gateway and the Workforce Service over TCP.
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
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
