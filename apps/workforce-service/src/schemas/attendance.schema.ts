/**
 * @fileoverview Attendance Schema
 *
 * Mongoose schema definition for attendance records in the workforce
 * management system. Defines enums for attendance types (present, late,
 * absent, etc.) and shift types for both Sales and Operations departments.
 */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo } from "mongoose";
export type AttendanceDocument = Attendance & Document;

/**
 * Enum for attendance types within the workforce management system.
 */
export enum AttendanceInType {
  PRESENT = "PRESENT",
  LATE = "LATE",
  ABSENT = "ABSENT",
  ON_LEAVE = "ON_LEAVE",
  WEEKEND = "WEEKEND",
  WORK_FROM_HOME = "WORK_FROM_HOME",
}

/**
 * Enum for shift types within the workforce management system.
 */
export enum ShiftTypeForSales {
  MORNING = "MORNING",
  EVENING = "EVENING",
  NIGHT = "NIGHT",
}

export enum ShiftTypeForOperations {
  DAY = "DAY",
  NIGHT = "NIGHT",
}

/**
 * Attendance Schema
 *
 * Represents an attendance record for a user in the workforce management system.
 * Includes details such as the user, check-in time, check-out time, date, and the type of attendance (e.g., present, late, absent).
 *
 * Options:
 * - timestamps: automatically add `createdAt` and `updatedAt`
 * - versionKey: disables `__v` field
 */
@Schema({ timestamps: true, versionKey: false })
export class Attendance extends Document {
  // Reference to the user associated with this attendance record
  @Prop({ required: true })
  user!: mongo.ObjectId;

  // Check-in time for the attendance record
  @Prop({ default: null })
  checkInTime?: Date;

  // Check-out time for the attendance record (optional)
  @Prop({ default: null })
  checkOutTime?: Date;

  // Date of the attendance record
  @Prop({ required: true })
  date!: Date;

  // Type of attendance (e.g., present, late, absent)
  @Prop({ required: true, enum: AttendanceInType })
  inType!: AttendanceInType;

  // Type of shift (e.g., morning, evening, night)
  @Prop({
    enum: [
      ...Object.values(ShiftTypeForSales),
      ...Object.values(ShiftTypeForOperations),
    ],
    default: null,
  })
  shiftType?: string;

  // Optional field to track if the attendance record has been marked as late
  @Prop({ default: false })
  isLate?: boolean;
}

/**
 * Mongoose schema for the Attendance class
 */
export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// Index for fast user-date lookup
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });
