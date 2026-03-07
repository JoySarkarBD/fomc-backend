import { ApiProperty } from "@nestjs/swagger";
import { CustomForbiddenDto } from "apps/api-gateway/src/common/dto/custom-forbidden.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class TaskCreateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/task" })
  declare endpoint: string;
}

export class TaskListForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/task" })
  declare endpoint: string;
}

export class TaskByIdForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;
}

export class TaskUpdateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;
}

export class TaskStatusUpdateForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/task/:id/status" })
  declare endpoint: string;
}

export class TaskDeleteForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;
}
