import { ApiProperty } from "@nestjs/swagger";
import { CustomUnauthorizedDto } from "apps/api-gateway/src/common/dto/custom-unauthorized.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ProjectCreateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project" })
  declare endpoint: string;
}

export class ProjectListUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project" })
  declare endpoint: string;
}

export class ProjectByIdUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;
}

export class ProjectUpdateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;
}

export class ProjectDeleteUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;
}

export class ClientCreateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project/client" })
  declare endpoint: string;
}

export class ClientListUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project/client" })
  declare endpoint: string;
}

export class ClientUpdateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/client/:id" })
  declare endpoint: string;
}

export class ClientDeleteUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/client/:id" })
  declare endpoint: string;
}

export class ProfileCreateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project/profile" })
  declare endpoint: string;
}

export class ProfileListUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project/profile" })
  declare endpoint: string;
}

export class ProfileUpdateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/profile/:id" })
  declare endpoint: string;
}

export class ProfileDeleteUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/profile/:id" })
  declare endpoint: string;
}
