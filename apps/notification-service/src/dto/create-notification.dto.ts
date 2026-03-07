/**
 * @fileoverview CreateNotificationDto. Validation schema for notification creation payloads.
 */
import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { NotificationType } from "../schema/notification.schema";

/**
 *
 * This file defines the CreateNotificationDto class, which is a Data Transfer Object (DTO) used for validating the payload when creating a new notification in the notification service. The DTO includes properties such as receiver, sender, title, message, type, referenceModel, and referenceId, along with appropriate validation decorators to ensure that the incoming data adheres to the expected format and constraints before being processed by the service. This helps maintain data integrity and provides clear error messages when validation fails.
 */
export class CreateNotificationDto {
  @ApiProperty({
    required: true,
    description: "Array of user IDs receiving the notification",
    example: ["60c72b2f9b1d8e5a5c8f9e7d"],
  })
  @IsArray({ message: "Receiver must be an array of user IDs" })
  @ArrayNotEmpty({ message: "Receiver array cannot be empty" })
  @IsMongoId({
    each: true,
    message: "Each receiver must be a valid MongoDB ObjectId",
  })
  receiver!: string[];

  @ApiProperty({
    description: "The ID of the user sending the notification",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "Sender must be a valid MongoDB ObjectId" })
  @IsOptional()
  sender?: string;

  @ApiProperty({
    required: true,
    description: "Notification title",
    example: "Shift Exchange Request",
  })
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  title!: string;

  @ApiProperty({
    required: true,
    description: "Notification message body",
    example: "You have a new shift exchange request.",
  })
  @IsString({ message: "Message must be a string" })
  @IsNotEmpty({ message: "Message is required" })
  message!: string;

  @ApiProperty({
    required: true,
    description: `Notification type - ${Object.values(NotificationType).join(", ")}`,
    enum: NotificationType,
    example: NotificationType.SHIFT_EXCHANGE_REQUEST,
  })
  @IsEnum(NotificationType, {
    message: `Type must be a valid NotificationType ${Object.values(NotificationType).join(", ")}`,
  })
  type!: NotificationType;

  @ApiProperty({
    description: "Related model name (optional)",
    example: "ShiftExchange",
  })
  @IsString({ message: "Reference model must be a string" })
  @IsOptional()
  referenceModel?: string;

  @ApiProperty({
    description: "Related document ID (optional)",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "Reference ID must be a valid MongoDB ObjectId" })
  @IsOptional()
  referenceId?: string;
}
