import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";
import { LeaveType } from "apps/workforce-service/src/schemas/leave.schema";

export class LeaveRequestSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Leave request created successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/leave/request" })
  declare endpoint: string;

  @ApiProperty({ example: 201 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      _id: "699065646c98dffa195f7d7e",
      user: "698ffc1ef75d367cc3e9d955",
      type: LeaveType.CASUAL_LEAVE,
      startDate: "2026-02-20T00:00:00.000Z",
      endDate: "2026-02-22T00:00:00.000Z",
      isApproved: null,
      isRejected: null,
      approvedBy: null,
      rejectedBy: null,
      createdAt: "2026-02-14T12:07:00.986Z",
      updatedAt: "2026-02-14T12:07:00.986Z",
    },
  })
  declare data: any;
}

export class PendingLeaveRequestsForAuthoritySuccessDto extends SuccessResponseDto<
  any[]
> {
  @ApiProperty({
    example: "Pending leave requests for authority retrieved successfully",
  })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/leave/pending-approvals" })
  declare endpoint: string;

  @ApiProperty({
    example: [
      {
        _id: "699065646c98dffa195f7d7e",
        user: "698ffc1ef75d367cc3e9d955",
        type: LeaveType.CASUAL_LEAVE,
        startDate: "2026-02-20T00:00:00.000Z",
        endDate: "2026-02-22T00:00:00.000Z",
        isApproved: null,
        isRejected: null,
        approvedBy: null,
        rejectedBy: null,
        createdAt: "2026-02-14T12:07:00.986Z",
        updatedAt: "2026-02-14T12:07:00.986Z",
      },
    ],
  })
  declare data: any[];
}

export class MyLeavesSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "My leaves retrieved successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/leave/my-leaves" })
  declare endpoint: string;

  @ApiProperty({
    example: [
      {
        _id: "699065646c98dffa195f7d7e",
        user: "698ffc1ef75d367cc3e9d955",
        type: LeaveType.CASUAL_LEAVE,
        startDate: "2026-02-20T00:00:00.000Z",
        endDate: "2026-02-22T00:00:00.000Z",
        isApproved: null,
        isRejected: null,
        approvedBy: null,
        rejectedBy: null,
        createdAt: "2026-02-14T12:07:00.986Z",
        updatedAt: "2026-02-14T12:07:00.986Z",
      },
    ],
  })
  declare data: any[];
}

export class UserSpecificLeaveSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "User-specific leaves retrieved successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/leave/user-specific/:userId" })
  declare endpoint: string;

  @ApiProperty({
    example: [
      {
        _id: "699065646c98dffa195f7d7e",
        user: "698ffc1ef75d367cc3e9d955",
        type: LeaveType.CASUAL_LEAVE,
        startDate: "2026-02-20T00:00:00.000Z",
        endDate: "2026-02-22T00:00:00.000Z",
        isApproved: null,
        isRejected: null,
        approvedBy: null,
        rejectedBy: null,
        createdAt: "2026-02-14T12:07:00.986Z",
        updatedAt: "2026-02-14T12:07:00.986Z",
      },
    ],
  })
  declare data: any[];
}

export class SpecificLeaveRequestSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Leave request retrieved successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/leave/specific/:id" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "699065646c98dffa195f7d7e",
      user: "698ffc1ef75d367cc3e9d955",
      type: LeaveType.CASUAL_LEAVE,
      startDate: "2026-02-20T00:00:00.000Z",
      endDate: "2026-02-22T00:00:00.000Z",
      isApproved: null,
      isRejected: null,
      approvedBy: null,
      rejectedBy: null,
      createdAt: "2026-02-14T12:07:00.986Z",
      updatedAt: "2026-02-14T12:07:00.986Z",
    },
  })
  declare data: any;
}

export class LeaveRequestApprovalSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Leave request approved successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/leave/approve/:id" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "699065646c98dffa195f7d7e",
      user: "698ffc1ef75d367cc3e9d955",
      type: LeaveType.CASUAL_LEAVE,
      startDate: "2026-02-20T00:00:00.000Z",
      endDate: "2026-02-22T00:00:00.000Z",
      isApproved: true,
      isRejected: false,
      approvedBy: "698ffc1ef75d367cc3e9d955",
      rejectedBy: null,
      createdAt: "2026-02-14T12:07:00.986Z",
      updatedAt: "2026-02-14T12:07:00.986Z",
    },
  })
  declare data: any;
}

export class LeaveRequestRejectionSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Leave request rejected successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/leave/reject/:id" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "699065646c98dffa195f7d7e",
      user: "698ffc1ef75d367cc3e9d955",
      type: LeaveType.CASUAL_LEAVE,
      startDate: "2026-02-20T00:00:00.000Z",
      endDate: "2026-02-22T00:00:00.000Z",
      isApproved: false,
      isRejected: true,
      approvedBy: null,
      rejectedBy: "698ffc1ef75d367cc3e9d955",
      createdAt: "2026-02-14T12:07:00.986Z",
      updatedAt: "2026-02-14T12:07:00.986Z",
    },
  })
  declare data: any;
}
