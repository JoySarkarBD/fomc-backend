import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Attendance, AttendanceSchema } from "../schemas/attendance.schema";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
    ]),
    MongooseModule.forFeature(
      [{ name: Attendance.name, schema: AttendanceSchema }],
      "PRIMARY_DB",
    ),
    MongooseModule.forFeature(
      [{ name: Attendance.name, schema: AttendanceSchema }],
      "SECONDARY_DB",
    ),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
