import { ApiProperty } from "@nestjs/swagger";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ResetPasswordXDeviceIdMissingDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: "X-Device-ID is missing in the request headers" })
  message!: string;

  @ApiProperty({ example: Methods.POST })
  method!: Methods.POST;

  @ApiProperty({ example: "api/auth/reset-password" })
  endpoint!: string;

  @ApiProperty({ example: 500 })
  statusCode!: number;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  timestamp!: string;

  @ApiProperty({ example: "X-Device-ID is missing in the request headers" })
  error!: string;
}
