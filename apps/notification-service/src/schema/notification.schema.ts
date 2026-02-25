// notification.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, mongo, Types } from "mongoose";

export type NotificationDocument = Notification & Document;

/**
 * Notification Type Enum
 */
export enum NotificationType {
  SHIFT_EXCHANGE_REQUEST = "SHIFT_EXCHANGE_REQUEST",
  SHIFT_EXCHANGE_APPROVED = "SHIFT_EXCHANGE_APPROVED",
  SHIFT_EXCHANGE_REJECTED = "SHIFT_EXCHANGE_REJECTED",

  WEEKEND_EXCHANGE_REQUEST = "WEEKEND_EXCHANGE_REQUEST",
  WEEKEND_EXCHANGE_APPROVED = "WEEKEND_EXCHANGE_APPROVED",
  WEEKEND_EXCHANGE_REJECTED = "WEEKEND_EXCHANGE_REJECTED",

  SYSTEM = "SYSTEM",
}

/**
 * Notification Schema
 */
@Schema({ timestamps: true, versionKey: false })
export class Notification extends Document {
  // Receiver (who will see this notification)

  @Prop({ type: Types.ObjectId, required: true, ref: "User" })
  receiver!: mongo.ObjectId;

  // Optional Sender (admin / manager / system)

  @Prop({ type: Types.ObjectId, ref: "User", default: null })
  sender?: mongo.ObjectId;

  // Notification Title

  @Prop({ required: true })
  title!: string;

  // Notification Message
  @Prop({ required: true })
  message!: string;

  // Notification Type
  @Prop({
    required: true,
    enum: Object.values(NotificationType),
  })
  type!: NotificationType;

  /**
   * Reference Model Name
   * Example: "ShiftExchange", "WeekendExchange"
   */
  @Prop({ default: null })
  referenceModel?: string;

  // Reference Document ID
  @Prop({ type: Types.ObjectId, default: null })
  referenceId?: mongo.ObjectId;

  // Read status
  @Prop({ default: false })
  isRead!: boolean;

  // Soft delete (optional future use)
  @Prop({ default: false })
  isDeleted!: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Get user notifications quickly
NotificationSchema.index({ receiver: 1, createdAt: -1 });

// Filter by read/unread
NotificationSchema.index({ receiver: 1, isRead: 1 });

// Optional reference lookup
NotificationSchema.index({ referenceModel: 1, referenceId: 1 });
