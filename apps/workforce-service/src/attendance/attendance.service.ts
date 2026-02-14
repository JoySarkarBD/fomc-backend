import { Injectable } from "@nestjs/common";
import { PresentAttendanceDto } from "./dto/create-attendance.dto";

/* 
  attendance logic:-
  for the operation department er jonno ekta shifting

  sales e shift 3 times; morning, evening, night



  shift-timing er sathe 15 min er modhye attendance mark korte hobe, otherwise late mark hobe
  
  shift timing -
  
*/

@Injectable()
export class AttendanceService {
  presentAttendance(presentAttendanceDto: PresentAttendanceDto) {
    const { checkInTime } = presentAttendanceDto;
    console.log("Check-in time:", checkInTime);
    return "This action adds a new attendance";
  }
}
