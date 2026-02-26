import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SellsShiftManagementService } from './sells-shift-management.service';
import { CreateSellsShiftManagementDto } from './dto/create-sells-shift-management.dto';
import { UpdateSellsShiftManagementDto } from './dto/update-sells-shift-management.dto';

@Controller()
export class SellsShiftManagementController {
  constructor(private readonly sellsShiftManagementService: SellsShiftManagementService) {}

  @MessagePattern('createSellsShiftManagement')
  create(@Payload() createSellsShiftManagementDto: CreateSellsShiftManagementDto) {
    return this.sellsShiftManagementService.create(createSellsShiftManagementDto);
  }

  @MessagePattern('findAllSellsShiftManagement')
  findAll() {
    return this.sellsShiftManagementService.findAll();
  }

  @MessagePattern('findOneSellsShiftManagement')
  findOne(@Payload() id: number) {
    return this.sellsShiftManagementService.findOne(id);
  }

  @MessagePattern('updateSellsShiftManagement')
  update(@Payload() updateSellsShiftManagementDto: UpdateSellsShiftManagementDto) {
    return this.sellsShiftManagementService.update(updateSellsShiftManagementDto.id, updateSellsShiftManagementDto);
  }

  @MessagePattern('removeSellsShiftManagement')
  remove(@Payload() id: number) {
    return this.sellsShiftManagementService.remove(id);
  }
}
