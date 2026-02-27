/**
 * @fileoverview Weekend Exchange by Authority DTO
 *
 * Data Transfer Object for handling weekend exchange requests initiated by an authority (e.g., manager) in the workforce management system. This DTO captures the necessary information to process a weekend exchange on behalf of a user, including the user's ID, the original weekend date, and the new off date after the exchange.
 *
 * The WeekendExchangeByAuthorityDto is used in the attendance service to validate and structure the data received when an authority requests to exchange a user's weekend day with another date. It ensures that the provided user ID is a valid MongoDB ObjectId, and that the original weekend date and new off date are valid date strings. This DTO helps maintain data integrity and consistency when processing weekend exchange requests initiated by authorities in the workforce management system.
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

/**
 * Data Transfer Object for handling weekend exchange requests initiated by an authority.
 *
 * Contains the following properties:
 * - `userId`: The unique identifier of the user for whom the weekend exchange is being requested. Must be a valid MongoDB ObjectId.
 * - `originalWeekendDate`: The original weekend date that is being exchanged. Must be a valid date string.
 * - `newOffDate`: The new off date that will replace the original weekend date after the exchange. Must be a valid date string.
 *
 * This DTO is used in the attendance service to validate and structure the data received when an authority requests to exchange a user's weekend day with another date, ensuring that the provided data meets the required format and validation rules before processing the request to perform the weekend exchange in the system.
 */
export class WeekendExchangeByAuthorityDto {
  @ApiProperty({
    required: true,
    description: "The original weekend date to be exchanged (UTC)",
    example: "2023-01-02T00:00:00.000Z",
  })
  @IsNotEmpty({ message: "Original weekend date is required" })
  @IsDateString(
    {},
    { message: "Original weekend date must be a valid date string" },
  )
  originalWeekendDate!: Date;

  @ApiProperty({
    required: true,
    description: "The new off date after exchange (UTC)",
    example: "2023-01-02T00:00:00.000Z",
  })
  @IsNotEmpty({ message: "New off date is required" })
  @IsDateString({}, { message: "New off date must be a valid date string" })
  newOffDate!: Date;
}
