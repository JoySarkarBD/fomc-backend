import { ApiProperty } from "@nestjs/swagger";
import { CustomInternalServerErrorDto } from "apps/api-gateway/src/common/dto/custom-internal-server-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class LeaveRequestInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({
    example: "api/leave/request",
  })
  declare endpoint: string;
}

export class PendingLeaveRequestsForAuthorityInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({
    example: "api/leave/pending-approvals",
  })
  declare endpoint: string;
}

export class MyLeaveInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({
    example: "api/leave/my-leaves",
  })
  declare endpoint: string;
}

export class UserSpecificLeaveInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({
    example: "api/leave/user-specific/:userId",
  })
  declare endpoint: string;
}

export class SpecificLeaveRequestInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({
    example: "api/leave/:id",
  })
  declare endpoint: string;
}

export class LeaveRequestApprovalInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({
    example: "api/leave/approve/:id",
  })
  declare endpoint: string;
}

export class LeaveRequestRejectionInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({
    example: "api/leave/reject/:id",
  })
  declare endpoint: string;
}
