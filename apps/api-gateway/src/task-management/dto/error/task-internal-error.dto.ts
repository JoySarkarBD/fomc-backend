import { ApiProperty } from "@nestjs/swagger";
import { CustomInternalServerErrorDto } from "apps/api-gateway/src/common/dto/custom-internal-server-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class TaskCreateInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/task" })
  declare endpoint: string;
}

export class TaskListInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/task" })
  declare endpoint: string;
}

export class TaskByIdInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;
}

export class TaskUpdateInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;
}

export class TaskStatusUpdateInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/task/:id/status" })
  declare endpoint: string;
}

export class TaskDeleteInternalErrorDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;
}
