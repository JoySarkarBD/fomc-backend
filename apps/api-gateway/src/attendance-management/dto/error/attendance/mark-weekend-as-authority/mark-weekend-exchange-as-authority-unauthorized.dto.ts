import { ApiProperty } from "@nestjs/swagger";
import { CustomUnauthorizedDto } from "apps/api-gateway/src/common/dto/custom-unauthorized.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class MarkWeekendExchangeAsAuthorityUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({
    example: "api/attendance/weekend-exchange-by-authority/:userId",
  })
  declare endpoint: string;
}
