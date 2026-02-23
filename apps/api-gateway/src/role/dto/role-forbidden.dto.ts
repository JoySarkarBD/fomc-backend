import { ApiProperty } from "@nestjs/swagger";
import { CustomForbiddenDto } from "apps/api-gateway/src/common/dto/custom-forbidden.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RoleCreateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/role" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;
}

export class RolesForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/role" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;
}

export class RoleGetByIdForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;
}

export class RoleUpdateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;
}

export class RoleDeleteForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;
}
