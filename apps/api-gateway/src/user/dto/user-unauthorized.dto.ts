import { ApiProperty } from "@nestjs/swagger";
import { CustomUnauthorizedDto } from "apps/api-gateway/src/common/dto/custom-unauthorized.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class UsersUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({ example: "Unauthorized" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user" })
  declare endpoint: string;

  @ApiProperty({ example: 401 })
  declare statusCode: number;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({ example: "Invalid or expired token" })
  declare error: string;
}

export class UserUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({ example: "Unauthorized" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user/:id" })
  declare endpoint: string;

  @ApiProperty({ example: 401 })
  declare statusCode: number;

  @ApiProperty({ example: "Invalid or expired token" })
  declare error: string;
}

export class UserProfileUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({ example: "Unauthorized" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user/profile/me" })
  declare endpoint: string;

  @ApiProperty({ example: 401 })
  declare statusCode: number;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({ example: "Invalid or expired token" })
  declare error: string;
}

export class UpdateUserProfileUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({ example: "Unauthorized" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/user/profile/me" })
  declare endpoint: string;

  @ApiProperty({ example: 401 })
  declare statusCode: number;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({ example: "Invalid or expired token" })
  declare error: string;
}
