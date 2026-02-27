import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RegistrationSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "User registered successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/auth/register" })
  declare endpoint: string;

  @ApiResponseProperty({
    type: String,
    example: {
      _id: "6996d5319754977e5498ebaf",
      name: "Alex Johnson",
      employeeId: "OP 1072",
      phoneNumber: "+1234567890",
      email: "alex.johnson@example.com",
      secondaryEmail: "secondary@example.com",
      role: "6996b518cd7dc16049574a57",
      department: "6996b518cd7dc16049574a89",
      designation: "6996b518cd7dc16049574a90",
      isBlocked: false,
      employmentStatus: true,
      resignedDates: ["2025-12-01T00:00:00.000Z", "2026-01-15T00:00:00.000Z"],
      reJoiningDates: ["2026-02-01T00:00:00.000Z"],
      createdAt: "2026-02-19T09:17:37.094Z",
      updatedAt: "2026-02-19T09:17:37.094Z",
    },
  })
  declare data: {
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
    resignedDates: string[];
    reJoiningDates: string[];
    createdAt: string;
    updatedAt: string;
  };
}
