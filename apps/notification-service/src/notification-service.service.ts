/**
 * @fileoverview NotificationServiceService - Handles business logic for notifications, including creation,
 */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import {
  Notification,
  NotificationDocument,
} from "./schema/notification.schema";

@Injectable()
export class NotificationServiceService {
  /**
   * Create an instance of NotificationServiceService.
   *
   * @param notificationModel - Mongoose model for Notification, injected via NestJS's dependency injection system.
   */
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  /**
   * Create a new notification based on the provided data.
   *
   * @param data - Data transfer object containing notification details such as sender, receiver, title, message, type, and reference information.
   * @returns The created notification document.
   */
  async createNotification(data: CreateNotificationDto) {
    const notification = await this.notificationModel.create({
      receiver: data.receiver.map((id) => new Types.ObjectId(id)),
      sender: new Types.ObjectId(data.sender),
      title: data.title,
      message: data.message,
      type: data.type,
      referenceModel: data.referenceModel,
      referenceId: new Types.ObjectId(data.referenceId),
      isRead: false,
    });
    return notification;
  }

  /**
   * Retrieve all notifications for a specific user, sorted by creation date in descending order.
   *
   * @param data - Object containing the userId for whom to retrieve notifications.
   * @returns An array of notification documents for the specified user.
   */
  async getUserNotifications(data: { userId: string }) {
    return await this.notificationModel
      .find({ receiver: new Types.ObjectId(data.userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Mark a specific notification as read by updating its isRead field to true.
   *
   * @param data - Object containing the notificationId of the notification to be marked as read.
   * @returns The updated notification document with isRead set to true.
   */
  async markAsRead(data: { notificationId: string }) {
    return await this.notificationModel
      .findByIdAndUpdate(
        new Types.ObjectId(data.notificationId),
        { isRead: true },
        { new: true },
      )
      .exec();
  }

  /**
   * Mark a specific notification as unread by updating its isRead field to false.
   *
   * @param data - Object containing the notificationId of the notification to be marked as unread.
   * @returns The updated notification document with isRead set to false.
   */
  async markAsUnread(data: { notificationId: string }) {
    return await this.notificationModel
      .findByIdAndUpdate(
        new Types.ObjectId(data.notificationId),
        { isRead: false },
        { new: true },
      )
      .exec();
  }
}
