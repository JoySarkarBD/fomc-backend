import { Controller, Get } from "@nestjs/common";
import { WorkforceServiceService } from "./workforce.service";

@Controller()
export class WorkforceServiceController {
  constructor(
    private readonly workforceServiceService: WorkforceServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.workforceServiceService.getHello();
  }
}
