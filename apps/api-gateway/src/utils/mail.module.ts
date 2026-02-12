import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";

/**
 * Mail Module responsible for handling email-related functionality within the API Gateway.
 * This module provides the MailService, which contains methods for sending emails, such as OTPs for password resets and other authentication-related notifications.
 * The MailModule can be imported by other modules, such as the AuthModule, to utilize its email-sending capabilities in various authentication workflows.
 */
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
