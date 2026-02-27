/**
 * @fileoverview Task Module
 *
 * Configures the Task feature module within the Workforce microservice.
 * Registers Mongoose schemas for Task across default, PRIMARY_DB, and
 * SECONDARY_DB connections.
 */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "../schemas/task.schema";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
