import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RoleListSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: "Roles fetched successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/role" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({
    example: [
      {
        _id: "6996d5319754977e5498ebcf",
        name: "HR",
        description: "Human Resources",
        isSystem: true,
        createdAt: "2026-02-19T09:17:37.094Z",
        updatedAt: "2026-02-19T09:17:37.094Z",
      },
    ],
  })
  declare data: any[];
}
