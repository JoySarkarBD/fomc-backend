/**
 * @fileoverview Task Schema
 *
 * Mongoose schema definition for tasks in the workforce management system.
 * Defines enums for task priorities (low through critical) and statuses
 * (pending, WIP, completed, blocked, delivered), with user references for
 * creator and assignees.
 */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";
export type TaskDocument = Task & Document;

/**
 * Enum for task priorities within the workforce management system.
 */
export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

/**
 * Enum for task statuses within the workforce management system.
 */
export enum TaskStatus {
  PENDING = "PENDING",
  WIP = "WORK_IN_PROGRESS",
  COMPLETED = "COMPLETED",
  BLOCKED = "BLOCKED",
  DELIVERED = "DELIVERED",
}

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

  // Reference to the client collection
  @Prop({
    type: Types.ObjectId,
    ref: "Client",
    required: true,
  })
  client!: Types.ObjectId;

  // Reference to the project collection
  @Prop({
    type: Types.ObjectId,
    ref: "Project",
    required: true,
  })
  project!: Types.ObjectId;

  // Due date for the task
  @Prop()
  dueDate!: Date;

  // Priority of the task (e.g., low, medium, high)
  @Prop({ enum: TaskPriority, default: TaskPriority.LOW })
  priority!: TaskPriority;

  // Optional description of the task
  @Prop()
  description?: string;

  // Status of the task (e.g., pending, work in progress, completed)
  @Prop({ enum: TaskStatus, default: TaskStatus.PENDING })
  status!: TaskStatus;

  // Reference to the user collection
  @Prop({ type: Types.ObjectId, required: true })
  createdBy!: Types.ObjectId;

  // Reference to the user collection
  @Prop({ type: [{ type: Types.ObjectId, required: true }] })
  assignTo!: Types.ObjectId[];
}

/**
 * Mongoose schema for the Task class
 */
export const TaskSchema = SchemaFactory.createForClass(Task);
