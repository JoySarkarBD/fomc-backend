/**
 * @fileoverview TCP message-pattern commands for the **Notification** domain.
 *
 * Used by the API Gateway and Notification microservice to communicate
 * notification operations over the TCP transport.
 *
 * @module @shared/constants/notification-command
 */

export const NOTIFICATION_COMMANDS = {
  /** Create a new notification. */
  CREATE_NOTIFICATION: { cmd: "create_notification" },

  /** Retrieve notifications for a specific user, optionally filtered. */
  GET_USER_NOTIFICATIONS: { cmd: "get_user_notifications" },

  /** Mark a notification as read. */
  MARK_AS_READ: { cmd: "mark_as_read" },

  /** Mark a notification as unread. */
  MARK_AS_UNREAD: { cmd: "mark_as_unread" },
};
