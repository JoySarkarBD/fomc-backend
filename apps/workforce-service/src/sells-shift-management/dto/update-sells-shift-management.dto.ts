import { PartialType } from '@nestjs/mapped-types';
import { CreateSellsShiftManagementDto } from './create-sells-shift-management.dto';

export class UpdateSellsShiftManagementDto extends PartialType(CreateSellsShiftManagementDto) {
  id: number;
}
