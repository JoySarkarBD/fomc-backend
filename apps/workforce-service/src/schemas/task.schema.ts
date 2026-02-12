import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo } from "mongoose";

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum TaskStatus {
  PENDING = "PENDING",
  WIP = "WORK_IN_PROGRESS",
  COMPLETED = "COMPLETED",
  BLOCKED = "BLOCKED",
  DELIVERED = "DELIVERED",
}

export type TaskDocument = Task & Document;

/**
 * Task Schema
 *
 * Represents a task in the workforce management system.
 * Includes details such as name, client, project, due date, priority, description, status, creator, and assignees.
 *
 * Options:
 * - timestamps: automatically add `createdAt` and `updatedAt`
 * - versionKey: disables `__v` field
 */
@Schema({ timestamps: true, versionKey: false })
export class Task extends Document {
  @Prop({ required: true })
  name!: string;

  // For now it will be a string but in future it will be a reference to the client collection
  @Prop()
  client!: string | mongo.ObjectId;

  // For now it will be a string but in future it will be a reference to the project collection
  @Prop()
  project!: string | mongo.ObjectId;

  // For now it will be a string but in future it will be a reference to the user collection
  @Prop()
  dueDate!: Date;

  // For now it will be a string but in future it will be a reference to the user collection
  @Prop({ enum: TaskPriority, default: TaskPriority.LOW })
  priority!: TaskPriority;

  // For now it will be a string but in future it will be a reference to the user collection
  @Prop()
  description?: string;

  // For now it will be a string but in future it will be a reference to the user collection
  @Prop({ enum: TaskStatus, default: TaskStatus.PENDING })
  status!: TaskStatus;

  // For now it will be a string but in future it will be a reference to the user collection
  @Prop()
  createdBy!: mongo.ObjectId;

  // For now it will be a string but in future it will be a reference to the user collection
  @Prop()
  assignTo!: mongo.ObjectId[];
}

/**
 * Mongoose schema for the Task class
 */
export const TaskSchema = SchemaFactory.createForClass(Task);
