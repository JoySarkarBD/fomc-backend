import { ApiProperty } from "@nestjs/swagger";
import { CustomUnauthorizedDto } from "apps/api-gateway/src/common/dto/custom-unauthorized.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RejectShiftExchangeUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/sells-shift-management/exchange/reject/:exchangeId" })
  declare endpoint: string;
}
