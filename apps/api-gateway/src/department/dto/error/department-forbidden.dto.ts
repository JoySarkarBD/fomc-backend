import { ApiProperty } from "@nestjs/swagger";
import { CustomForbiddenDto } from "apps/api-gateway/src/common/dto/custom-forbidden.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class DepartmentCreateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/department" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;
}

export class DepartmentUpdateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;
}

export class DepartmentDeleteForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;
}
