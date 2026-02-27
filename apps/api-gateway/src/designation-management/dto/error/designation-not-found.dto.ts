import { ApiProperty } from "@nestjs/swagger";
import { CustomNotFoundDto } from "apps/api-gateway/src/common/dto/custom-not-found.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class DesignationNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "Designation with the specified ID was not found." })
  declare message: string;

  @ApiProperty({ example: "Designation not found" })
  declare error: string;
}

export class DesignationUpdateByIdNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "Designation with the specified ID was not found." })
  declare message: string;

  @ApiProperty({ example: "Designation not found" })
  declare error: string;
}

export class DesignationDeleteByIdNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "Designation with the specified ID was not found." })
  declare message: string;

  @ApiProperty({ example: "Designation not found" })
  declare error: string;
}
