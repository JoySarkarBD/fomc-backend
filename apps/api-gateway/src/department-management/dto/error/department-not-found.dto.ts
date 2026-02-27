import { ApiProperty } from "@nestjs/swagger";
import { CustomNotFoundDto } from "apps/api-gateway/src/common/dto/custom-not-found.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class DepartmentNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "Department with the specified ID was not found." })
  declare message: string;

  @ApiProperty({ example: "Department not found" })
  declare error: string;
}

export class DepartmentUpdateByIdNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "Department with the specified ID was not found." })
  declare message: string;

  @ApiProperty({ example: "Department not found" })
  declare error: string;
}

export class DepartmentDeleteByIdNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "Department with the specified ID was not found." })
  declare message: string;

  @ApiProperty({ example: "Department not found" })
  declare error: string;
}
