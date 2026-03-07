/**
 * @fileoverview Project Schema
 *
 * Mongoose schema definition for projects within the workforce management
 * system. Tracks project lifecycle, client mood history, department transfers,
 * work progress, and other relevant project details.
 */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
export type ProjectDocument = Project & Document;

export type ClientDocument = Client & Document;

export type ProfileDocument = Profile & Document;

/**
 * Enum for project status within the workforce management system.
 */
export enum ProjectStatus {
  NULL = "NULL",
  NRA = "NRA",
  WIP = "WIP",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REVISION = "REVISION",
}

/**
 * Client Schema
 *
 * Represents a client within the workforce management system.
 *
 * Features:
 * - Stores client name with trimming for clean data.
 * - Automatically tracks creation and update timestamps.
 *
 * Options:
 * - timestamps: Adds createdAt and updatedAt automatically.
 * - versionKey: Disables __v field for cleaner documents.
 */
@Schema({
  timestamps: true,
  versionKey: false,
})
export class Client extends Document {
  @Prop({ required: true, trim: true })
  name!: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

/**
 * Profile Schema
 *
 * Represents a profile within the workforce management system.
 *
 * Features:
 * - Stores profile name with trimming for clean data.
 * - Automatically tracks creation and update timestamps.
 *
 * Options:
 * - timestamps: Adds createdAt and updatedAt automatically.
 * - versionKey: Disables __v field for cleaner documents.
 */
@Schema({
  timestamps: true,
  versionKey: false,
})
export class Profile extends Document {
  @Prop({ required: true, trim: true })
  name!: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

/**
 * Project Schema
 *
 * Represents a project within the workforce management.
 *
 * Features:
 * - Supports mixed client reference (string | ObjectId)
 * - Tracks work progress history
 * - Tracks client mood history
 * - Maintains department assignment and transfer history
 * - Stores lifecycle status and rating
 *
 * Options:
 * - timestamps: Adds createdAt and updatedAt automatically
 * - versionKey: Disables __v field
 */
@Schema({
  timestamps: true,
  versionKey: false,
})
export class Project extends Document {
  // Name of the project.
  @Prop({ required: true, trim: true })
  name!: string;

  // Client associated with the project.
  @Prop({
    type: Types.ObjectId,
    ref: "Client",
    required: false,
  })
  client?: Types.ObjectId;

  // External order identifier associated with the project.
  @Prop({ required: true })
  orderId!: string;

  // For now it will be a string but in future it will be a reference to the user collection
  @Prop({
    type: Types.ObjectId,
    ref: "Profile",
    required: false,
  })
  profile?: Types.ObjectId;

  // Reference to the user collection
  @Prop({
    type: Types.ObjectId,
    required: false,
  })
  salesMember?: Types.ObjectId;

  // Departments currently assigned to handle the project. (Transfer history not required as we will maintain)
  @Prop({
    type: Types.ObjectId,
    required: false,
  })
  assignedDepartment?: Types.ObjectId;

  // List of associated project file URLs or storage paths.
  @Prop({ type: [String], default: [] })
  projectFiles?: string[];

  // Internal remarks or notes about the project.
  @Prop()
  projectRemarks?: string;

  // Project due date.
  @Prop({ required: false })
  dueDate?: Date;

  // Actual delivery date of the project.
  @Prop()
  deliveryDate?: Date;

  // Project status
  @Prop({ enum: ProjectStatus, default: ProjectStatus.NULL })
  status!: ProjectStatus;

  @Prop({ type: Types.ObjectId, required: true })
  createdBy!: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ name: "text", orderId: "text" });
ClientSchema.index({ name: "text" });
ProfileSchema.index({ name: "text" });
