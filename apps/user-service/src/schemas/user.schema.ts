import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Mongoose document type for User.
 */
export type UserDocument = User & Document;

/**
 * Enum for user roles within the organization.
 */
export enum UserRole {
  DIRECTOR = 'DIRECTOR',
  HR = 'HR',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  EMPLOYEE = 'EMPLOYEE',
}

/**
 * Enum for departments within the organization.
 */
export enum Department {
  SHOPIFY = 'SHOPIFY',
  WORDPRESS = 'WORDPRESS',
  CUSTOM = 'CUSTOM',
}

/**
 * User Schema
 *
 * Represents an employee in the organization.
 * Includes personal, role, and department information.
 *
 * Options:
 * - timestamps: automatically add `createdAt` and `updatedAt`
 * - versionKey: disables `__v` field
 */
@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  /** Full name of the user */
  @Prop({ required: true })
  name!: string;

  /** Optional employee identifier */
  @Prop({ default: null })
  employeeId?: string;

  /** Primary phone number (required) */
  @Prop({ required: true })
  phoneNumber?: string;

  /** Unique email address (required) */
  @Prop({ required: true, unique: true })
  email!: string;

  /** Optional secondary email */
  @Prop({ default: null })
  secondaryEmail?: string;

  /** User password (required, excluded from queries by default) */
  @Prop({ required: true, select: false })
  password?: string;

  /** Role of the user in the organization */
  @Prop({ default: UserRole.EMPLOYEE, enum: UserRole })
  role: UserRole = UserRole.EMPLOYEE;

  /** Department of the user (optional) */
  @Prop({ default: null, enum: Department })
  department?: Department;
}

/**
 * Mongoose schema for the User class
 */
export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Index for faster queries on commonly filtered fields:
 * - employeeId
 * - phoneNumber
 * - department
 */
UserSchema.index({ employeeId: 1, phoneNumber: 1, department: 1 });
