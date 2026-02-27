import { ApiProperty } from "@nestjs/swagger";
import { CustomNotFoundDto } from "apps/api-gateway/src/common/dto/custom-not-found.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class MarkOutAttendanceNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "No attendance record found for today" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/attendance/out" })
  declare endpoint: string;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({ example: "No attendance record found for today" })
  declare error: string;
}
