import { ApiProperty } from "@nestjs/swagger";
import { CustomInternalServerErrorDto } from "apps/api-gateway/src/common/dto/custom-internal-server-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class DesignationCreateInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: "api/designation" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;
}

export class DesignationsInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: "api/designation" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;
}

export class DesignationInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;
}

export class DesignationUpdateInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;
}

export class DesignationDeleteInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;
}
