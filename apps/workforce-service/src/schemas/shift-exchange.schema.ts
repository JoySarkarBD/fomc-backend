// shift-exchange.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo, Types } from "mongoose";
import { ShiftTypeForSales } from "./attendance.schema";

export type ShiftExchangeDocument = ShiftExchange & Document;

export enum ShiftExchangeStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

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
