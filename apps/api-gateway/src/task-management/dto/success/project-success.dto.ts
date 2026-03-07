import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

// --- Task Success DTOs ---

export class TaskCreateSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Task created successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/task" })
  declare endpoint: string;

  @ApiProperty({ example: 201 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      _id: "60c72b2f9b1d8e5a5c8f9e7d",
      name: "Order Tracking System",
      client: "Acme Corp",
      orderId: "ORD-123456",
      project: "Mobile App Development",
      dueDate: "2024-06-30T23:59:59.000Z",
      priority: "HIGH",
      description:
        "This task involves creating comprehensive documentation for the project.",
      status: "WIP",
      createdAt: "2024-03-04T10:00:00.000Z",
      updatedAt: "2024-03-04T10:00:00.000Z",
    },
  })
  declare data: any;
}

export class TaskListSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "Tasks fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/task?pageNo=1&pageSize=10" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: [
      {
        _id: "60c72b2f9b1d8e5a5c8f9e7d",
        name: "Order Tracking System",
        client: "Acme Corp",
        orderId: "ORD-123456",
        project: "Mobile App Development",
        dueDate: "2024-06-30T23:59:59.000Z",
        priority: "HIGH",
        description:
          "This task involves creating comprehensive documentation for the project.",
        status: "WIP",
        createdAt: "2024-03-04T10:00:00.000Z",
        updatedAt: "2024-03-04T10:00:00.000Z",
      },
    ],
  })
  declare data: any[];
}

export class TaskByIdSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Task fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      _id: "60c72b2f9b1d8e5a5c8f9e7d",
      name: "Order Tracking System",
      client: "Acme Corp",
      orderId: "ORD-123456",
      project: "Mobile App Development",
      dueDate: "2024-06-30T23:59:59.000Z",
      priority: "HIGH",
      description:
        "This task involves creating comprehensive documentation for the project.",
      status: "WIP",
      createdAt: "2024-03-04T10:00:00.000Z",
      updatedAt: "2024-03-04T10:00:00.000Z",
    },
  })
  declare data: any;
}

export class TaskUpdateSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Task updated successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      _id: "60c72b2f9b1d8e5a5c8f9e7d",
      name: "Order Tracking System",
      client: "Acme Corp",
      orderId: "ORD-123456",
      project: "Mobile App Development",
      dueDate: "2024-06-30T23:59:59.000Z",
      priority: "HIGH",
      description:
        "This task involves creating comprehensive documentation for the project.",
      status: "WIP",
      createdAt: "2024-03-04T10:00:00.000Z",
      updatedAt: "2024-03-04T10:00:00.000Z",
    },
  })
  declare data: any;
}

export class TaskStatusUpdateFoundDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Task status updated successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/task/:id/status" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      _id: "60c72b2f9b1d8e5a5c8f9e7d",
      name: "Order Tracking System",
      client: "Acme Corp",
      orderId: "ORD-123456",
      project: "Mobile App Development",
      dueDate: "2024-06-30T23:59:59.000Z",
      priority: "HIGH",
      description:
        "This task involves creating comprehensive documentation for the project.",
      status: "DELIVERED",
      createdAt: "2024-03-04T10:00:00.000Z",
      updatedAt: "2024-03-05T15:30:00.000Z",
    },
  })
  declare data: any;
}

export class TaskDeleteSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Task deleted successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      _id: "60c72b2f9b1d8e5a5c8f9e7d",
      name: "Order Tracking System",
      client: "Acme Corp",
      orderId: "ORD-123456",
      project: "Mobile App Development",
      dueDate: "2024-06-30T23:59:59.000Z",
      priority: "HIGH",
      description:
        "This task involves creating comprehensive documentation for the project.",
      status: "WIP",
      createdAt: "2024-03-04T10:00:00.000Z",
      updatedAt: "2024-03-04T10:00:00.000Z",
    },
  })
  declare data: any;
}
