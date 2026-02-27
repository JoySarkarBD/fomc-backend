import { ApiProperty } from "@nestjs/swagger";
import { CustomInternalServerErrorDto } from "apps/api-gateway/src/common/dto/custom-internal-server-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class DepartmentCreateInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: "api/department" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;
}

export class DepartmentsInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: "api/department" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;
}

export class DepartmentInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;
}

export class DepartmentUpdateInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;
}

export class DepartmentDeleteInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;
}
