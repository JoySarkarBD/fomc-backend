/**
 * @fileoverview Leave Schema
 *
 * Mongoose schema definition for leave requests in the workforce
 * management system. Supports multiple leave types (sick, casual,
 * maternity, paternity, government festival holiday) with approval tracking.
 */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";
export type LeaveDocument = Leave & Document;

/**
 * Enum for leave types within the workforce management system.
 */
export enum LeaveType {
  SICK_LEAVE = "SICK_LEAVE",
  CASUAL_LEAVE = "CASUAL_LEAVE",
  GOVERNMENT_FESTIVAL_HOLIDAY = "GOVERNMENT_FESTIVAL_HOLIDAY",
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
  // Reference to the user requesting leave
  @Prop({
    type: MongooseSchema.Types.Mixed, // Mixed type to allow both string and ObjectId for user reference
    required: true,
  })
  user!: string | Types.ObjectId;

  // Type of leave being requested (e.g., sick leave, casual leave)
  @Prop({ required: true, enum: LeaveType })
  type!: LeaveType;

  // Start date of the leave
  @Prop({ required: true })
  startDate!: Date;

  // End date of the leave
  @Prop({ required: true })
  endDate!: Date;

  // Reason for requesting the leave
  @Prop({ required: true })
  reason!: string;

  // Optional field to indicate if the leave has been approved
  @Prop({ default: false })
  isApproved?: boolean;

  // Optional field to indicate if the leave has been rejected
  @Prop({ default: null, nullable: true })
  isRejected?: boolean;

  // Optional field to indicate who approved the leave - reference to the user who approved the leave
  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  approvedBy?: string | Types.ObjectId;

  // Optional field to indicate who rejected the leave - reference to the user who rejected the leave
  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  rejectedBy?: string | Types.ObjectId;
}

/**
 * Mongoose schema for the Leave class
 */
export const LeaveSchema = SchemaFactory.createForClass(Leave);

/* 

API LIST:

1. POST /leaves - Create a new leave request
2. GET /leaves-my - Get all leave requests (with optional filters for user, type, approval status)
3. GET /leaves/:id - Get a specific leave request by ID


1. GET /leaves-authority - Get all leave requests (with optional filters for user, type, approval status)
2. PATCH /leaves/:id/approve - Approve a specific leave request by ID
3. PATCH /leaves/:id/reject - Reject a specific leave request by ID




*/
