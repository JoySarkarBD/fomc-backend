import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo, Types } from "mongoose";
import { ShiftTypeForSales } from "./attendance.schema";

export enum WeekEndOff {
  SUNDAY = "SUNDAY",
  SATURDAY = "SATURDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
}

export type SalesShiftAssignmentDocument = SalesShiftAssignment & Document;

/**
 * Sales Shift Assignment Schema
 *
 * Represents the assignment of a sales shift to a user for a specific week.
 *
 * Includes references to the user, the week for which the shift is assigned, the type of shift, who assigned it, and whether it has been exchanged.
 *
 * Options:
 * - timestamps: automatically add `createdAt` and `updatedAt`
 * - versionKey: disables `__v` field
 */
@Schema({ timestamps: true, versionKey: false })
export class SalesShiftAssignment extends Document {
  // User reference
  @Prop({ type: Types.ObjectId, required: true })
  user!: mongo.ObjectId;

  // Week start date (normalized: Sunday 00:00 or Monday 00:00)
  @Prop({ required: true })
  weekStartDate!: Date;

  // Week end date
  @Prop({ required: true })
  weekEndDate!: Date;

  // Assigned shift for the whole week
  @Prop({
    type: String,
    required: true,
    enum: Object.values(ShiftTypeForSales),
  })
  shiftType!: ShiftTypeForSales;

  // Weekend off for the assigned shift
  @Prop({
    type: Object,
  })
  myWeekends?: {
    currentWeekends?: WeekEndOff[];
    updatedWeekends?: WeekEndOff[];
    exchangedWeekendDates?: Date[];
  };

  // Shift exchange references if approved
  @Prop({ type: [Types.ObjectId], ref: "ShiftExchange", default: [] })
  shiftExchanges?: mongo.ObjectId[];

  // Who assigned the shift (Manager)
  @Prop({ type: Types.ObjectId, required: true })
  assignedBy!: mongo.ObjectId;

  // Optional note
  @Prop({ default: null })
  note?: string;
}

export const SalesShiftAssignmentSchema =
  SchemaFactory.createForClass(SalesShiftAssignment);
