import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo } from "mongoose";

/**
 * Mongoose document type for Leave.
 */
export type LeaveDocument = Leave & Document;

/**
 * Enum for leave types within the workforce management system.
 */
export enum LeaveType {
  SICK_LEAVE = "SICK_LEAVE",
  CASUAL_LEAVE = "CASUAL_LEAVE",
  FESTIVAL_LEAVE = "FESTIVAL_LEAVE",
  EARNED_LEAVE = "EARNED_LEAVE",
  MATERNITY_LEAVE = "MATERNITY_LEAVE",
  PATERNITY_LEAVE = "PATERNITY_LEAVE",
  UNPAID_LEAVE = "UNPAID_LEAVE",
}

/**
 * Leave Schema
 *
 * Represents a leave request in the workforce management system.
 * Includes details such as the user requesting leave, type of leave, start and end dates, and the reason for the leave.
 *
 * Options:
 * - timestamps: automatically add `createdAt` and `updatedAt`
 * - versionKey: disables `__v` field
 */
@Schema({ timestamps: true, versionKey: false })
export class Leave extends Document {
  @Prop({ required: true })
  user!: string | mongo.ObjectId;

  @Prop({ required: true, enum: LeaveType })
  type!: LeaveType;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({ required: true })
  reason!: string;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);
