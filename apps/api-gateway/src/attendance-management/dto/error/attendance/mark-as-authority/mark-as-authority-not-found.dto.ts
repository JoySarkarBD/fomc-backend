import { ApiProperty } from "@nestjs/swagger";
import { CustomNotFoundDto } from "apps/api-gateway/src/common/dto/custom-not-found.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class MarkAttendanceAsAuthorityNotFoundDtoDto extends CustomNotFoundDto {
  @ApiProperty({ example: "User not found" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({
    example: "api/attendance/mark-attendance-by-authority/:userId",
  })
  declare endpoint: string;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({ example: "User not found" })
  declare error: string;
}
