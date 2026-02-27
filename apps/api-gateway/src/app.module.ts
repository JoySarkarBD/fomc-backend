/**
 * @fileoverview Root module of the API Gateway.
 *
 * Imports all feature modules (Auth, User, Role, Department,
 * Attendance) and wires up the health-check controller.
 */

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AttendanceModule } from "./attendance/attendance.module";
import { AuthModule } from "./auth/auth.module";
import { DepartmentModule } from "./department/department.module";
import { DesignationModule } from "./designation/designation.module";
import { RoleModule } from "./role/role.module";
import { SellsShiftManagementModule } from "./sells-shift-management/sells-shift-management.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule,
    DepartmentModule,
    AttendanceModule,
    DesignationModule,
    SellsShiftManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
