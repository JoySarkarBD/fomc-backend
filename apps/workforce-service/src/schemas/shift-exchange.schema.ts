/**
 * @fileoverview Shift Exchange Schema
 *
 * Defines the Mongoose schema for shift exchange requests in the workforce management system.
 * This schema includes fields for the user requesting the exchange, the date of the shift exchange, the original and new shift types, an optional reason for the exchange, and the approval status of the request.
 * The schema also includes an index to ensure that a user cannot request multiple shift exchanges for the same date, maintaining data integrity and preventing duplicate requests.
 */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo, Types } from "mongoose";
import { ShiftTypeForSales } from "./attendance.schema";

export type ShiftExchangeDocument = ShiftExchange & Document;

/**
 * Enum for shift exchange status within the workforce management system.
 */
export enum ShiftExchangeStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

/**
 * Shift Exchange Schema
 *
 * Represents a shift exchange request in the workforce management system.
 *
 * Fields:
 * - user: Reference to the user requesting the shift exchange.
 * - exchangeDate: The date for which the shift exchange is requested.
 * - originalShift: The current assigned shift that the user wants to exchange.
 * - newShift: The new shift that the user wants to exchange for.
 * - reason: Optional reason for the shift exchange request.
 * - approvedBy: Reference to the manager who approved the shift exchange.
 * - status: The approval status of the shift exchange request.
 *
 * Options:
 * - timestamps: automatically add `createdAt` and `updatedAt`
 * - versionKey: disables `__v` field
 */
@Schema({ timestamps: true, versionKey: false })
export class ShiftExchange extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: "User" })
  user!: mongo.ObjectId;

  @Prop({ required: true })
  exchangeDate!: Date;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(ShiftTypeForSales),
  })
  originalShift!: ShiftTypeForSales;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(ShiftTypeForSales),
  })
  newShift!: ShiftTypeForSales;

  @Prop({ default: null })
  reason?: string;

  @Prop({ type: Types.ObjectId, default: null })
  approvedBy?: mongo.ObjectId;

  @Prop({
    enum: Object.values(ShiftExchangeStatus),
    default: ShiftExchangeStatus.PENDING,
  })
  status!: ShiftExchangeStatus;
}

export const ShiftExchangeSchema = SchemaFactory.createForClass(ShiftExchange);

ShiftExchangeSchema.index({ user: 1, exchangeDate: 1 }, { unique: true });
