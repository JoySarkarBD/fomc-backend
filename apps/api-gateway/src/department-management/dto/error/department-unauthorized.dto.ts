import { ApiProperty } from "@nestjs/swagger";
import { CustomUnauthorizedDto } from "apps/api-gateway/src/common/dto/custom-unauthorized.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class DepartmentCreateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: "api/department" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;
}

export class DepartmentUpdateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;
}

export class DepartmentDeleteUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;
}
