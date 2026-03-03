/**
 * @fileoverview Department Schema
 *
 * Mongoose schema definition for departments within the organization.
 * Supports unique uppercase names, optional descriptions, system-department
 * flags, and text indexing for efficient searching.
 */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo } from "mongoose";
export type DepartmentDocument = Department & Document;

/**
 * Department Schema
 *
 * Represents a department within the organization.
 * Includes the name of the department and its description.
 *
 * Options:
 * - timestamps: automatically add `createdAt` and `updatedAt`
 * - versionKey: disables `__v` field
 */
@Schema({ timestamps: true, versionKey: false })
export class Department extends Document {
  // Name of the department (e.g., "Operations", "SALES")
  @Prop({ required: true, unique: true, uppercase: true })
  name!: string;

  // Optional description of the department
  @Prop({ default: null })
  description?: string;

  // System department cannot be modified or deleted through the application
  @Prop({ default: false })
  isSystem!: boolean;

  @Prop({ default: null })
  createdBy?: mongo.ObjectId; // Reference to the user who created the department
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);

// Create a text index on the 'name' field for efficient searching
DepartmentSchema.index({ name: "text" });
