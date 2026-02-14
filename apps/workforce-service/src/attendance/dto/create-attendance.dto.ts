import { IsDateString, IsNotEmpty } from "class-validator";

export class PresentAttendanceDto {
  @IsNotEmpty({ message: "Check-in time is required" })
  @IsDateString(
    {},
    { message: "Check-in time must be a valid ISO date string" },
  )
  checkInTime!: string;
}

export class OutAttendanceDto {
  @IsNotEmpty({ message: "Check-out time is required" })
  @IsDateString(
    {},
    { message: "Check-out time must be a valid ISO date string" },
  )
  checkOutTime!: string;
}
