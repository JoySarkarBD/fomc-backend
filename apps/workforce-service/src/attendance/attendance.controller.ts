import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AttendanceService } from "./attendance.service";
import { ATTENDANCE_COMMAND_NAMES } from "./constants/attendance.constants";
import {
  OutAttendanceDto,
  PresentAttendanceDto,
} from "./dto/create-attendance.dto";

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern(ATTENDANCE_COMMAND_NAMES.PRESENT_ATTENDANCE)
  presentAttendance(@Payload() presentAttendanceDto: PresentAttendanceDto) {
    return this.attendanceService.presentAttendance(presentAttendanceDto);
  }

  @MessagePattern(ATTENDANCE_COMMAND_NAMES.OUT_ATTENDANCE)
  outAttendance(@Payload() outAttendanceDto: OutAttendanceDto) {
    return this.attendanceService.outAttendance(outAttendanceDto);
  }
}
