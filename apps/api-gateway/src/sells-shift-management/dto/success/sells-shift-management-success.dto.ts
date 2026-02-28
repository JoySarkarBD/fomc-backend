import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class CreateSellsShiftManagementSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Sells shift created successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/sells-shift-management/:userId" })
  declare endpoint: string;

  @ApiProperty({ example: 201 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      user: "65f1b2c3d4e5f67890123456",
      weekStartDate: "2024-05-01T08:00:00.000Z",
      weekEndDate: "2024-05-07T17:00:00.000Z",
      shiftType: "MORNING",
      note: "This is a note",
      assignedBy: "65f1b2c3d4e5f67890123457",
      _id: "65f1b2c3d4e5f67890123458",
      createdAt: "2026-02-23T12:00:00.000Z",
      updatedAt: "2026-02-23T12:00:00.000Z",
    },
  })
  declare data: any;
}

export class GetUserSellsShiftSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "Sells shift retrieved" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/sells-shift-management/:userId" })
  declare endpoint: string;

  @ApiProperty({
    example: [
      {
        user: "65f1b2c3d4e5f67890123456",
        weekStartDate: "2024-05-01T08:00:00.000Z",
        weekEndDate: "2024-05-07T17:00:00.000Z",
        shiftType: "MORNING",
        note: "This is a note",
        assignedBy: "65f1b2c3d4e5f67890123457",
        _id: "65f1b2c3d4e5f67890123458",
        createdAt: "2026-02-23T12:00:00.000Z",
        updatedAt: "2026-02-23T12:00:00.000Z",
      },
    ],
  })
  declare data: any[];
}

export class GetMyShiftSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "Sells shift retrieved" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/sells-shift-management/my-shifts" })
  declare endpoint: string;

  @ApiProperty({
    example: [
      {
        user: "65f1b2c3d4e5f67890123456",
        weekStartDate: "2024-05-01T08:00:00.000Z",
        weekEndDate: "2024-05-07T17:00:00.000Z",
        shiftType: "MORNING",
        note: "This is a note",
        assignedBy: "65f1b2c3d4e5f67890123457",
        _id: "65f1b2c3d4e5f67890123458",
        createdAt: "2026-02-23T12:00:00.000Z",
        updatedAt: "2026-02-23T12:00:00.000Z",
      },
    ],
  })
  declare data: any[];
}
