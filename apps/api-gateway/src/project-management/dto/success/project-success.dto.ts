import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

// --- Project Success DTOs ---

export class ProjectCreateSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Project created successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project" })
  declare endpoint: string;

  @ApiProperty({ example: 201 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      _id: "60c72b2f9b1d8e5a5c8f9e7d",
      name: "Order Tracking System",
      orderId: "ORD-123456",
      client: "60c72b2f9b1d8e5a5c8f9e7a",
      status: "WIP",
      createdAt: "2024-03-04T10:00:00.000Z",
      updatedAt: "2024-03-04T10:00:00.000Z",
    },
  })
  declare data: any;
}

export class ProjectListSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "Projects fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project?pageNo=1&pageSize=10" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: [
      {
        _id: "60c72b2f9b1d8e5a5c8f9e7d",
        name: "Order Tracking System",
        orderId: "ORD-123456",
        client: { _id: "60c72b2f9b1d8e5a5c8f9e7a", name: "Acme Corp" },
        status: "WIP",
        createdAt: "2024-03-04T10:00:00.000Z",
        updatedAt: "2024-03-04T10:00:00.000Z",
      },
    ],
  })
  declare data: any[];
}

export class ProjectByIdSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Project fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      _id: "60c72b2f9b1d8e5a5c8f9e7d",
      name: "Order Tracking System",
      orderId: "ORD-123456",
      client: { _id: "60c72b2f9b1d8e5a5c8f9e7a", name: "Acme Corp" },
      status: "WIP",
      createdAt: "2024-03-04T10:00:00.000Z",
      updatedAt: "2024-03-04T10:00:00.000Z",
    },
  })
  declare data: any;
}

export class ProjectUpdateSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Project updated successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      _id: "60c72b2f9b1d8e5a5c8f9e7d",
      name: "Order Tracking System - Updated",
      orderId: "ORD-123456",
      client: "60c72b2f9b1d8e5a5c8f9e7a",
      status: "DELIVERED",
      createdAt: "2024-03-04T10:00:00.000Z",
      updatedAt: "2024-03-04T10:05:00.000Z",
    },
  })
  declare data: any;
}

export class ProjectDeleteSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Project deleted successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/:id" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      _id: "60c72b2f9b1d8e5a5c8f9e7d",
      name: "Order Tracking System",
    },
  })
  declare data: any;
}

// --- Client Success DTOs ---

export class ClientCreateSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Client created successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project/client" })
  declare endpoint: string;

  @ApiProperty({ example: 201 })
  declare statusCode: number;

  @ApiProperty({
    example: { _id: "60c72b2f9b1d8e5a5c8f9e7a", name: "Acme Corp" },
  })
  declare data: any;
}

export class ClientListSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "Clients fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project/client" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: [{ _id: "60c72b2f9b1d8e5a5c8f9e7a", name: "Acme Corp" }],
  })
  declare data: any[];
}

export class ClientUpdateSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Client updated successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/client/:id" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: { _id: "60c72b2f9b1d8e5a5c8f9e7a", name: "Acme Corp Updated" },
  })
  declare data: any;
}

export class ClientDeleteSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Client deleted successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/client/:id" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: { _id: "60c72b2f9b1d8e5a5c8f9e7a", name: "Acme Corp" },
  })
  declare data: any;
}

// --- Profile Success DTOs ---

export class ProfileCreateSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Profile created successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/project/profile" })
  declare endpoint: string;

  @ApiProperty({ example: 201 })
  declare statusCode: number;

  @ApiProperty({
    example: { _id: "60c72b2f9b1d8e5a5c8f9e7b", name: "Standard Profile" },
  })
  declare data: any;
}

export class ProfileListSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "Profiles fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/project/profile" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: [{ _id: "60c72b2f9b1d8e5a5c8f9e7b", name: "Standard Profile" }],
  })
  declare data: any[];
}

export class ProfileUpdateSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Profile updated successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/project/profile/:id" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: { _id: "60c72b2f9b1d8e5a5c8f9e7b", name: "Standard Profile Updated" },
  })
  declare data: any;
}

export class ProfileDeleteSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Profile deleted successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/project/profile/:id" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: { _id: "60c72b2f9b1d8e5a5c8f9e7b", name: "Standard Profile" },
  })
  declare data: any;
}
