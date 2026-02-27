/**
 * @fileoverview Update Weekend Off by Authority DTO
 *
 * Data Transfer Object for updating a user's weekend off days by an authority (e.g., manager) in the workforce management system.
 */
import { ApiProperty } from "@nestjs/swagger";
import { WeekEndOff } from "apps/user-service/src/schemas/user.schema";
import { IsArray, IsEnum } from "class-validator";

/**
 * Data Transfer Object for updating a user's weekend off days by an authority.
 *
 * Contains a single property `weekEndOff`, which is an array of strings representing the new weekend off days for the user. The values must be valid `WeekEndOff` enum values (e.g., "SUNDAY", "SATURDAY").
 * This DTO is used in the attendance service to handle requests for updating a user's weekend off days on behalf of an authority, ensuring that the provided data meets the required format and validation rules before processing the request to update the user's weekend off days in the system.
 */
export class UpdateByAuthorityWeekendSetDto {
  @ApiProperty({
    required: true,
    description: "The weekend off value(s) to be set for the user",
    example: ["SUNDAY", "SATURDAY"],
    type: "string",
    isArray: true,
    enum: WeekEndOff,
  })
  @IsArray({ message: "weekEndOff must be an array" })
  @IsEnum(WeekEndOff, {
    each: true,
    message: "Each value must be a valid WeekEndOff",
  })
  weekEndOff!: WeekEndOff[];
}
