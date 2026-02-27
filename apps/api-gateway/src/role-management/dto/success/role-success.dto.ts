import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RoleCreateSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Role created successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/role" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "SUPER ADMIN",
      permissions: [],
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: any;
}

export class RolesListSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "Roles fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/role?pageNo=1&pageSize=10&searchKey=" })
  declare endpoint: string;

  @ApiProperty({
    example: [
      {
        _id: "6996d5319754977e5498ebaf",
        name: "SUPER ADMIN",
        permissions: [],
        createdAt: "2026-02-19T09:17:37.094Z",
        updatedAt: "2026-02-19T09:17:37.094Z",
      },
    ],
  })
  declare data: any[];
}

export class RoleByIdSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Role fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "SUPER ADMIN",
      permissions: [],
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: any;
}

export class RolePatchSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Role updated successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "SUPER ADMIN",
      permissions: [],
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: any;
}

export class RoleDeleteSuccessDto extends SuccessResponseDto<null> {
  @ApiProperty({ example: "Role deleted successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "SUPER ADMIN",
      permissions: [],
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: any;
}
