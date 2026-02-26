import { Controller } from "@nestjs/common";
import { SellsShiftManagementService } from "./sells-shift-management.service";

@Controller("sells-shift-management")
export class SellsShiftManagementController {
  constructor(
    private readonly sellsShiftManagementService: SellsShiftManagementService,
  ) {}
}
