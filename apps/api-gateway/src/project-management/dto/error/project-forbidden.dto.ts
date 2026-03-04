import { ApiProperty } from "@nestjs/swagger";
import { CustomForbiddenDto } from "apps/api-gateway/src/common/dto/custom-forbidden.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ProjectCreateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project" })
  declare endpoint: string;
}

export class ProjectListForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project" })
  declare endpoint: string;
}

export class ProjectByIdForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;
}

export class ProjectUpdateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;
}

export class ProjectDeleteForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;
}

export class ClientCreateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project/client" })
  declare endpoint: string;
}

export class ClientListForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project/client" })
  declare endpoint: string;
}

export class ClientUpdateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/client/:id" })
  declare endpoint: string;
}

export class ClientDeleteForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/client/:id" })
  declare endpoint: string;
}

export class ProfileCreateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project/profile" })
  declare endpoint: string;
}

export class ProfileListForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project/profile" })
  declare endpoint: string;
}

export class ProfileUpdateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/profile/:id" })
  declare endpoint: string;
}

export class ProfileDeleteForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/profile/:id" })
  declare endpoint: string;
}
