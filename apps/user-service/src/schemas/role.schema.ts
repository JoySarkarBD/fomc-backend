import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo } from "mongoose";

/**
 * Mongoose document type for Role.
 */
export type RoleDocument = Role & Document;

/**
 * Role Schema
 *
 * Represents a role within the organization.
 * Includes the name of the role and its associated permissions.
 *
 * Options:
 * - timestamps: automatically add `createdAt` and `updatedAt`
 * - versionKey: disables `__v` field
 */
@Schema({ timestamps: true, versionKey: false })
export class Role extends Document {
  // Name of the role (e.g., "DIRECTOR", "HR", "PROJECT MANAGER", "EMPLOYEE")
  @Prop({ required: true, unique: true, uppercase: true })
  name!: string;

  @Prop({ default: null })
  description?: string;

  // System roles cannot be modified or deleted through the application
  @Prop({ default: false })
  isSystem!: boolean;

  @Prop({ default: null })
  createdBy?: mongo.ObjectId; // Reference to the user who created the role
}

export const RoleSchema = SchemaFactory.createForClass(Role);
