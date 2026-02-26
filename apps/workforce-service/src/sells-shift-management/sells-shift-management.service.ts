import { Injectable } from '@nestjs/common';
import { CreateSellsShiftManagementDto } from './dto/create-sells-shift-management.dto';
import { UpdateSellsShiftManagementDto } from './dto/update-sells-shift-management.dto';

@Injectable()
export class SellsShiftManagementService {
  create(createSellsShiftManagementDto: CreateSellsShiftManagementDto) {
    return 'This action adds a new sellsShiftManagement';
  }

  findAll() {
    return `This action returns all sellsShiftManagement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sellsShiftManagement`;
  }

  update(id: number, updateSellsShiftManagementDto: UpdateSellsShiftManagementDto) {
    return `This action updates a #${id} sellsShiftManagement`;
  }

  remove(id: number) {
    return `This action removes a #${id} sellsShiftManagement`;
  }
}
