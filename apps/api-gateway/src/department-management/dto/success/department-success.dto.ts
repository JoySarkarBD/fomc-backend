import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class DepartmentCreateSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Department created successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/department" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "HR",
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: any;
}

export class DepartmentsListSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "Departments fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/department?pageNo=1&pageSize=10&searchKey=" })
  declare endpoint: string;

  @ApiProperty({
    example: [
      {
        _id: "6996d5319754977e5498ebaf",
        name: "HR",
        createdAt: "2026-02-19T09:17:37.094Z",
        updatedAt: "2026-02-19T09:17:37.094Z",
      },
    ],
  })
  declare data: any[];
}

export class DepartmentByIdSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Department fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "HR",
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: any;
}

export class DepartmentPatchSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Department updated successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "HR",
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: any;
}

export class DepartmentDeleteSuccessDto extends SuccessResponseDto<null> {
  @ApiProperty({ example: "Department deleted successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "HR",
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: any;
}
