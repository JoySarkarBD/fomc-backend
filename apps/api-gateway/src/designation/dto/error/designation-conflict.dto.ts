import { ApiProperty } from "@nestjs/swagger";
import { CustomConflictDto } from "../../../common/dto/custom-conflict.dto";
import { Methods } from "../../../common/enum/methods.enum";

export class DesignationCreateConflictDto extends CustomConflictDto {
  @ApiProperty({ example: "Designation with the same name already exists" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/designation" })
  declare endpoint: string;
}

export class DesignationUpdateConflictDto extends CustomConflictDto {
  @ApiProperty({ example: "Designation with the same name already exists" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;
}
