import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class UsersListSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "Users fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({
    example:
      "api/user?pageNo=1&pageSize=10&searchKey=John?role=department=designation=",
  })
  declare endpoint: string;

  @ApiProperty({
    example: [
      {
        _id: "6996d5319754977e5498ebaf",
        name: "Alex Johnson",
        employeeId: "OP 1072",
        phoneNumber: "+1234567890",
        email: "alex.johnson@example.com",
        secondaryEmail: "secondary@example.com",
        role: "6996b518cd7dc16049574a57",
        department: "6996b518cd7dc16049574a89",
        designation: "6996b518cd7dc16049574a90",
        isBlocked: false,
        employmentStatus: true,
        createdAt: "2026-02-19T09:17:37.094Z",
        updatedAt: "2026-02-19T09:17:37.094Z",
      },
    ],
  })
  declare data: any[];
}

export class UserSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "User operation successful" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user/:id" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "Alex Johnson",
      employeeId: "OP 1072",
      phoneNumber: "+1234567890",
      email: "alex.johnson@example.com",
      secondaryEmail: "secondary@example.com",
      role: "6996b518cd7dc16049574a57",
      department: "6996b518cd7dc16049574a89",
      designation: "6996b518cd7dc16049574a90",
      isBlocked: false,
      employmentStatus: true,
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: any;
}

export class UserProfileSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "User profile fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user/profile/me" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "Alex Johnson",
      employeeId: "OP 1072",
      phoneNumber: "+1234567890",
      email: "alex.johnson@example.com",
      secondaryEmail: "secondary@example.com",
      role: "6996b518cd7dc16049574a57",
      department: "6996b518cd7dc16049574a89",
      designation: "6996b518cd7dc16049574a90",
      isBlocked: false,
      employmentStatus: true,
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: any;
}

export class UserProfileUpdateSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "User profile updated successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/user/profile/me" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "Alex Johnson",
      employeeId: "OP 1072",
      phoneNumber: "+1234567890",
      email: "alex.johnson@example.com",
      secondaryEmail: "secondary@example.com",
      role: "6996b518cd7dc16049574a57",
      department: "6996b518cd7dc16049574a89",
      designation: "6996b518cd7dc16049574a90",
      isBlocked: false,
      employmentStatus: true,
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: any;
}
