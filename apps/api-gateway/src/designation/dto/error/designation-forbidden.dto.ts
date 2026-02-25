import { ApiProperty } from "@nestjs/swagger";
import { CustomForbiddenDto } from "apps/api-gateway/src/common/dto/custom-forbidden.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class DesignationCreateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/designation" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;
}

export class DesignationsForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/designation" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;
}

export class DesignationGetByIdForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;
}

export class DesignationUpdateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;
}

export class DesignationDeleteForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;
}
