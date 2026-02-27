/**
 * @fileoverview Mail utility module.
 *
 * Provides and exports MailService for sending transactional emails
 * (OTPs, password resets, etc.).
 */

import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
