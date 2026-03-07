import { ApiProperty } from "@nestjs/swagger";
import { CustomUnauthorizedDto } from "apps/api-gateway/src/common/dto/custom-unauthorized.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class TaskCreateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/task" })
  declare endpoint: string;
}

export class TaskListUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/task" })
  declare endpoint: string;
}

export class TaskByIdUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;
}

export class TaskUpdateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;
}

export class TaskStatusUpdateUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/task/:id/status" })
  declare endpoint: string;
}

export class TaskDeleteUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;
}
