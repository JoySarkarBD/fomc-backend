/** @fileoverview Permission Mongoose schema. Defines the Permission document structure, permission names enum, and properties for the MongoDB collection. @module user-service/schemas/permission.schema */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo, Types } from "mongoose";

export enum PermissionName {
  USER = "USER MANAGEMENT", // User management permissions (create, read, update, delete users)
  DEPARTMENT = "DEPARTMENT MANAGEMENT", // Department management permissions (create, read, update, delete departments)
  ROLE = "ROLE MANAGEMENT", // Role management permissions (create, read, update, delete roles)
  DESIGNATION = "DESIGNATION MANAGEMENT", // Designation management permissions (create, read, update, delete designations)
  PERMISSION = "PERMISSION MANAGEMENT", // Permission management permissions (create, read, update, delete permissions)
  ATTENDANCE = "ATTENDANCE MANAGEMENT", // Attendance management permissions (mark attendance, view attendance records)
  LEAVE = "LEAVE MANAGEMENT", // Leave management permissions (apply for leave, approve/reject leave, view leave records)
  TASK = "TASK MANAGEMENT", // Task management permissions (create, read, update, delete tasks, assign tasks)
  PROJECT = "PROJECT MANAGEMENT", // Project management permissions (create, read, update, delete projects, assign projects)
  DCR = "DCR MANAGEMENT", // Daily Call Report management permissions (create, read, update, delete DCRs)
  SHIFT = "SHIFT MANAGEMENT", // Shift scheduling and management permissions (create, read, update, delete shifts, assign shifts)
  LEARNING = "LEARNING MANAGEMENT", // Training and development management permissions (create, read, update, delete training programs, assign training)
}

/**
 * Mongoose document type for Permission.
 */
export type PermissionDocument = Permission & Document;

/**
 * Permission Schema
 *
 * Represents a specific permission within the organization.
 * Includes the name of the permission and its description.
 *
 * Options:
 * - timestamps: automatically add `createdAt` and `updatedAt`
 * - versionKey: disables `__v` field
 */
@Schema({ timestamps: true, versionKey: false })
export class Permission extends Document {
  // Reference to the role associated with this permission
  @Prop({ type: Types.ObjectId, ref: "Role", required: true })
  role!: Types.ObjectId;

  @Prop({ required: true, enum: PermissionName })
  name!: PermissionName;

  @Prop({ default: null })
  description?: string;

  @Prop({ default: false })
  isSystem!: boolean; // System permissions cannot be modified or deleted through the application

  @Prop({ default: false })
  canCreate!: boolean;

  @Prop({ default: false })
  canRead!: boolean;

  @Prop({ default: false })
  canUpdate!: boolean;

  @Prop({ default: false })
  canDelete!: boolean;

  @Prop({ default: null })
  createdBy?: mongo.ObjectId; // Reference to the user who created the permission
}

/**
 * Mongoose document type for Permission.
 */
export const PermissionSchema = SchemaFactory.createForClass(Permission);
