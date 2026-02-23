import { ApiProperty } from "@nestjs/swagger";
import { CustomNotFoundDto } from "apps/api-gateway/src/common/dto/custom-not-found.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RoleNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "Role with the specified ID was not found." })
  declare message: string;

  @ApiProperty({ example: "Role not found" })
  declare error: string;
}

export class RoleUpdateByIdNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "Role with the specified ID was not found." })
  declare message: string;

  @ApiProperty({ example: "Role not found" })
  declare error: string;
}

export class RoleDeleteByIdNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "Role with the specified ID was not found." })
  declare message: string;

  @ApiProperty({ example: "Role not found" })
  declare error: string;
}
