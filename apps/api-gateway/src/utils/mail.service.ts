import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

/**
 * Mail Service responsible for sending emails within the API Gateway.
 * This service utilizes Nodemailer to send emails, such as OTPs for password resets and other authentication-related notifications.
 * It provides a method `sendMail` that accepts email options and sends an email using the configured SMTP transporter.
 * The service also includes error handling and logging to ensure that email sending operations are properly monitored and any issues are logged for troubleshooting.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize Nodemailer transporter with SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  /**
   * Sends an email using the configured transporter.
   * @param options - An object containing the email options, including recipient, subject, HTML content, and optional text content.
   * @returns A promise that resolves with the result of the email sending operation.
   * @throws An error if the email sending operation fails, which is also logged for troubleshooting purposes.
   */
  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
        ...options,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error("Email sending failed", error);
      throw error;
    }
  }
}
