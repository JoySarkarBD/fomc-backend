import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";
import { ProjectStatus } from "apps/workforce-service/src/schemas/project.schema";

export class ProjectCreateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "name", message: "Name is required" },
      { field: "orderId", message: "orderId is required" },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class ProjectListValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "pageNo", message: "pageNo must be a positive integer" },
      { field: "pageSize", message: "pageSize must be a positive integer" },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class ProjectByIdValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [{ field: "id", message: "id must be a valid ObjectId" }],
  })
  declare errors: FieldErrorDto[];
}

export class ProjectDeleteValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [{ field: "id", message: "id must be a valid ObjectId" }],
  })
  declare errors: FieldErrorDto[];
}

export class ProjectUpdateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "id", message: "id must be a valid ObjectId" },
      {
        field: "status",
        message: `status must be a valid enum ${Object.values(ProjectStatus).join(", ")}`,
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class ClientCreateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project/client" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [{ field: "name", message: "Name is required" }],
  })
  declare errors: FieldErrorDto[];
}

export class ClientUpdateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/client/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "id", message: "id must be a valid ObjectId" },
      { field: "name", message: "Name is required" },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class ClientDeleteValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/client/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [{ field: "id", message: "id must be a valid ObjectId" }],
  })
  declare errors: FieldErrorDto[];
}

export class ProfileCreateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project/profile" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [{ field: "name", message: "Name is required" }],
  })
  declare errors: FieldErrorDto[];
}

export class ProfileUpdateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/profile/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "id", message: "id must be a valid ObjectId" },
      { field: "name", message: "Name is required" },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class ProfileDeleteValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/profile/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [{ field: "id", message: "id must be a valid ObjectId" }],
  })
  declare errors: FieldErrorDto[];
}
