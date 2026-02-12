import { Module } from "@nestjs/common";
import { WorkforceServiceController } from "./workforce.controller";
import { WorkforceServiceService } from "./workforce.service";

@Module({
  imports: [],
  controllers: [WorkforceServiceController],
  providers: [WorkforceServiceService],
})
export class WorkforceServiceModule {}
