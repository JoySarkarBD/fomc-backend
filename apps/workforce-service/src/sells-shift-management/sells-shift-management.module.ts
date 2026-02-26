import { Module } from '@nestjs/common';
import { SellsShiftManagementService } from './sells-shift-management.service';
import { SellsShiftManagementController } from './sells-shift-management.controller';

@Module({
  controllers: [SellsShiftManagementController],
  providers: [SellsShiftManagementService],
})
export class SellsShiftManagementModule {}
