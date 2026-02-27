import { ApiProperty } from "@nestjs/swagger";
import { CustomUnauthorizedDto } from "apps/api-gateway/src/common/dto/custom-unauthorized.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class UsersUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user" })
  declare endpoint: string;
}

export class UserUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user/:id" })
  declare endpoint: string;
}

export class UserProfileUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user/profile/me" })
  declare endpoint: string;
}

export class UpdateUserProfileUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/user/profile/me" })
  declare endpoint: string;
}
