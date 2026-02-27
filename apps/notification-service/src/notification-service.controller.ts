/**
 * @fileoverview Notification Service Controller - Handles incoming message patterns related to notifications, delegating business logic to the NotificationServiceService.
 */
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { NOTIFICATION_COMMANDS } from "@shared/constants";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { NotificationServiceService } from "./notification-service.service";

@Controller()
export class NotificationServiceController {
  /**
   * Creates an instance of NotificationServiceController.
   *
   * @param notificationServiceService - Service layer responsible for notification business logic, injected via NestJS's dependency injection system.
   */
  constructor(
    private readonly notificationServiceService: NotificationServiceService,
  ) {}

  /**
   * Handle the message pattern for creating a new notification.
   *
   * Message Pattern: { cmd: NOTIFICATION_COMMANDS.CREATE_NOTIFICATION }
   *
   * @param createNotification - Data transfer object containing the details of the notification to be created, including sender, receiver, title, message, type, and reference information.
   * @returns The created notification document.
   */
  @MessagePattern(NOTIFICATION_COMMANDS.CREATE_NOTIFICATION)
  createNotification(@Payload() createNotification: CreateNotificationDto) {
    return this.notificationServiceService.createNotification(
      createNotification,
    );
  }

  /**
   * Handle the message pattern for retrieving notifications for a specific user.
   *
   * Message Pattern: { cmd: NOTIFICATION_COMMANDS.GET_USER_NOTIFICATIONS }
   *
   * @param data - Object containing the userId for whom to retrieve notifications.
   * @returns An array of notification documents for the specified user.
   */
  @MessagePattern(NOTIFICATION_COMMANDS.GET_USER_NOTIFICATIONS)
  getUserNotifications(data: any) {
    return this.notificationServiceService.getUserNotifications(data);
  }

  /**
   * Handle the message pattern for marking a notification as read.
   *
   * Message Pattern: { cmd: NOTIFICATION_COMMANDS.MARK_AS_READ }
   *
   * @param data - Object containing the notificationId of the notification to be marked as read.
   * @returns The updated notification document with isRead set to true.
   */
  @MessagePattern(NOTIFICATION_COMMANDS.MARK_AS_READ)
  markAsRead(data: any) {
    return this.notificationServiceService.markAsRead(data);
  }

  /**
   * Handle the message pattern for marking a notification as unread.
   *
   * Message Pattern: { cmd: NOTIFICATION_COMMANDS.MARK_AS_UNREAD }
   *
   * @param data - Object containing the notificationId of the notification to be marked as unread.
   * @returns The updated notification document with isRead set to false.
   */
  @MessagePattern(NOTIFICATION_COMMANDS.MARK_AS_UNREAD)
  markAsUnread(data: any) {
    return this.notificationServiceService.markAsUnread(data);
  }
}
