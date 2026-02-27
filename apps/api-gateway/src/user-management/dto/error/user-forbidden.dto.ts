import { ApiProperty } from "@nestjs/swagger";
import { CustomForbiddenDto } from "apps/api-gateway/src/common/dto/custom-forbidden.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class UsersForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user" })
  declare endpoint: string;
}

export class UserForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user/:id" })
  declare endpoint: string;
}
