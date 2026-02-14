import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AttendanceService } from "./attendance.service";
import { ATTENDANCE_COMMAND_NAMES } from "./constants/attendance.constants";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern(ATTENDANCE_COMMAND_NAMES.CREATE_ATTENDANCE)
  create(@Payload() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @MessagePattern(ATTENDANCE_COMMAND_NAMES.GET_ATTENDANCES)
  findAll() {
    return this.attendanceService.findAll();
  }

  @MessagePattern(ATTENDANCE_COMMAND_NAMES.GET_ATTENDANCE)
  findOne(@Payload() id: number) {
    return this.attendanceService.findOne(id);
  }

  @MessagePattern(ATTENDANCE_COMMAND_NAMES.UPDATE_ATTENDANCE)
  update(@Payload() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(
      updateAttendanceDto.id,
      updateAttendanceDto,
    );
  }

  @MessagePattern(ATTENDANCE_COMMAND_NAMES.DELETE_ATTENDANCE)
  remove(@Payload() id: number) {
    return this.attendanceService.remove(id);
  }
}
