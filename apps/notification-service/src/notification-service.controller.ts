import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { NOTIFICATION_COMMANDS } from "@shared/constants";
import { NotificationServiceService } from "./notification-service.service";

@Controller()
export class NotificationServiceController {
  constructor(
    private readonly notificationServiceService: NotificationServiceService,
  ) {}

  @MessagePattern(NOTIFICATION_COMMANDS.CREATE_NOTIFICATION)
  createNotification(data: any) {
    return this.notificationServiceService.createNotification(data);
  }

  @MessagePattern(NOTIFICATION_COMMANDS.GET_USER_NOTIFICATIONS)
  getUserNotifications(data: any) {
    return this.notificationServiceService.getUserNotifications(data);
  }

  @MessagePattern(NOTIFICATION_COMMANDS.MARK_AS_READ)
  markAsRead(data: any) {
    return this.notificationServiceService.markAsRead(data);
  }

  @MessagePattern(NOTIFICATION_COMMANDS.MARK_AS_UNREAD)
  markAsUnread(data: any) {
    return this.notificationServiceService.markAsUnread(data);
  }
}
