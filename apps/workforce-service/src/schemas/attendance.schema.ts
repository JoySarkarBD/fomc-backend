import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo } from "mongoose";

export enum AttendanceInType {
  PRESENT = "PRESENT",
  LATE = "LATE",
  ABSENT = "ABSENT",
  OFF_DAY = "OFF_DAY",
  ON_LEAVE = "ON_LEAVE",
  WORK_FROM_HOME = "WORK_FROM_HOME",
  WEEKEND_EXCHANGE = "WEEKEND_EXCHANGE",
}

export enum ShiftType {
  MORNING = "MORNING",
  EVENING = "EVENING",
  NIGHT = "NIGHT",
}

export type AttendanceDocument = Attendance & Document;

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
  @Prop()
  checkInTime?: Date;

  // Check-out time for the attendance record (optional)
  @Prop()
  checkOutTime?: Date;

  // Date of the attendance record
  @Prop({ required: true })
  date!: Date;

  // Type of attendance (e.g., present, late, absent)
  @Prop({ required: true, enum: AttendanceInType })
  inType!: AttendanceInType;

  // Type of shift (e.g., morning, evening, night)
  @Prop({ required: true, enum: ShiftType })
  shiftType!: ShiftType;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
