import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class LoginSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Login successful" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/auth/login" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      accessToken: "v4.local.xxxx...",
      user: {
        _id: "6996d5319754977e5498ebaf",
        name: "Alex Johnson",
        employeeId: "OP 1072",
        phoneNumber: "+1234567890",
        email: "alex.johnson@example.com",
        secondaryEmail: "secondary@example.com",
        role: "HR",
        department: "Operations",
        designation: "Manager",
        isBlocked: false,
        employmentStatus: true,
        createdAt: "2026-02-19T09:17:37.094Z",
        updatedAt: "2026-02-19T09:17:37.094Z",
      },
    },
  })
  declare data: {
    accessToken: string;
    user: {
      _id: string;
      name: string;
      employeeId: string;
      phoneNumber: string;
      email: string;
      secondaryEmail: string | null;
      role: string;
      department: string;
      designation: string;
      isBlocked: boolean;
      employmentStatus: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
}
