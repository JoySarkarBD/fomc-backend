import { ApiProperty } from "@nestjs/swagger";
import { CustomUnauthorizedDto } from "apps/api-gateway/src/common/dto/custom-unauthorized.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class DesignationCreateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: "api/designation" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;
}

export class DesignationsUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: "api/designation" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;
}

export class DesignationGetByIdUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;
}

export class DesignationUpdateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;
}

export class DesignationDeleteUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;
}
