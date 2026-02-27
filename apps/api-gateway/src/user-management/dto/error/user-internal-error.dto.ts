import { ApiProperty } from "@nestjs/swagger";
import { CustomInternalServerErrorDto } from "apps/api-gateway/src/common/dto/custom-internal-server-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class UsersInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user" })
  declare endpoint: string;
}

export class UserInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user/:id" })
  declare endpoint: string;
}

export class UserProfileInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user/profile/me" })
  declare endpoint: string;
}

export class UpdateUserProfileInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/user/profile/me" })
  declare endpoint: string;
}
