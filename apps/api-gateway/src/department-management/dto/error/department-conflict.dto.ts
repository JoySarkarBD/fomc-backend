import { ApiProperty } from "@nestjs/swagger";
import { CustomConflictDto } from "../../../common/dto/custom-conflict.dto";
import { Methods } from "../../../common/enum/methods.enum";

export class DepartmentCreateConflictDto extends CustomConflictDto {
  @ApiProperty({ example: "Department with the same name already exists" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/department" })
  declare endpoint: string;
}

export class DepartmentUpdateConflictDto extends CustomConflictDto {
  @ApiProperty({ example: "Department with the same name already exists" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/department/:id" })
  declare endpoint: string;
}
