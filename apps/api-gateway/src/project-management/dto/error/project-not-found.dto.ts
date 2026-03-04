import { ApiProperty } from "@nestjs/swagger";
import { CustomNotFoundDto } from "apps/api-gateway/src/common/dto/custom-not-found.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ProjectByIdNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "Project not found" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;

  @ApiProperty({ example: "Project not found" })
  declare error: string;
}

export class ProjectUpdateNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "Project not found" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;

  @ApiProperty({ example: "Project not found" })
  declare error: string;
}

export class ProjectDeleteNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "Project not found" })
  declare message: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;

  @ApiProperty({ example: "Project not found" })
  declare error: string;
}

export class ClientUpdateNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "Client not found" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/client/:id" })
  declare endpoint: string;

  @ApiProperty({ example: "Client not found" })
  declare error: string;
}

export class ClientDeleteNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "Client not found" })
  declare message: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/client/:id" })
  declare endpoint: string;

  @ApiProperty({ example: "Client not found" })
  declare error: string;
}

export class ProfileUpdateNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "Profile not found" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/profile/:id" })
  declare endpoint: string;

  @ApiProperty({ example: "Profile not found" })
  declare error: string;
}

export class ProfileDeleteNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "Profile not found" })
  declare message: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/profile/:id" })
  declare endpoint: string;

  @ApiProperty({ example: "Profile not found" })
  declare error: string;
}
