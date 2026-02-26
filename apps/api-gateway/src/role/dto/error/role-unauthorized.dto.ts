import { ApiProperty } from "@nestjs/swagger";
import { CustomUnauthorizedDto } from "apps/api-gateway/src/common/dto/custom-unauthorized.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RoleCreateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: "api/role" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;
}

export class RoleUpdateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;
}

export class RoleDeleteUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;
}
