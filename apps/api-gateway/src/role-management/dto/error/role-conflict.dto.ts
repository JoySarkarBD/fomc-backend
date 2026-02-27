import { ApiProperty } from "@nestjs/swagger";
import { CustomConflictDto } from "../../../common/dto/custom-conflict.dto";
import { Methods } from "../../../common/enum/methods.enum";

export class RoleCreateConflictDto extends CustomConflictDto {
  @ApiProperty({ example: "Role with the same name already exists" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/role" })
  declare endpoint: string;
}

export class RoleUpdateConflictDto extends CustomConflictDto {
  @ApiProperty({ example: "Role with the same name already exists" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/role/:id" })
  declare endpoint: string;
}
