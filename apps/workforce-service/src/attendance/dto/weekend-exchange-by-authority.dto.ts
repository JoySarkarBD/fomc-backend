import { ApiProperty } from "@nestjs/swagger";
import { WeekEndOff } from "apps/user-service/src/schemas/user.schema";
import { IsArray, IsEnum } from "class-validator";

export class WeekendExchangeDto {
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
