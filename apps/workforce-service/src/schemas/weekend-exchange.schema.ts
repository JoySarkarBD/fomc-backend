/**
 * @fileoverview Weekend Exchange Schema
 *
 * Mongoose schema definition for weekend exchange requests in the workforce
 * management system. Allows employees to exchange their regular weekend off
 * with another date, typically for project requirements or personal reasons.
 * */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo, Types } from "mongoose";

export type WeekendExchangeDocument = WeekendExchange & Document;

/**
 * Weekend Exchange Schema
 *
 * Represents a weekend exchange request in the workforce management system.
 * Includes details such as the user requesting the exchange, original weekend date, new off date, and who performed the exchange.
 *
 * Options:
 * - timestamps: automatically add `createdAt` and `updatedAt`
 * - versionKey: disables `__v` field
 */
@Schema({ timestamps: true, versionKey: false })
export class WeekendExchange extends Document {
  // User whose weekend is exchanged
  @Prop({ type: Types.ObjectId, required: true })
  user!: mongo.ObjectId;

  // Original weekend date
  @Prop({ required: true })
  originalWeekendDate!: Date;

  // New off date after exchange
  @Prop({ required: true })
  newOffDate!: Date;

  // Who performed the exchange (PROJECT_MANAGER)
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  exchangedBy!: mongo.ObjectId;
}

export const WeekendExchangeSchema =
  SchemaFactory.createForClass(WeekendExchange);

// Prevent duplicate exchange for same weekend
WeekendExchangeSchema.index(
  { user: 1, originalWeekendDate: 1 },
  { unique: true },
);

// Prevent duplicate new off date
WeekendExchangeSchema.index({ user: 1, newOffDate: 1 }, { unique: true });
