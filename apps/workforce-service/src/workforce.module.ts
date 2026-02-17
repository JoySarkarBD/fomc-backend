import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConnectionsModule } from "../../common/src/mongoose/mongoose-connections.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { Attendance, AttendanceSchema } from "./schemas/attendance.schema";
import { Department, DepartmentSchema } from "./schemas/department.schema";
import { Leave, LeaveSchema } from "./schemas/leave.schema";
import { SeedDepartmentAndDesignationModule } from "./seed/seed-department-and-designation.module";
import { TaskModule } from "./task/task.module";
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [
    /**
     * MongooseConnectionsModule is imported to establish a connection to the MongoDB database using Mongoose.
     * This allows the Workforce Service to interact with the MongoDB database for storing and retrieving workforce-related data, enabling persistence and data management for workforce operations.
     */
    MongooseConnectionsModule,

    MongooseModule.forFeature([
      {
        name: Attendance.name,
        schema: AttendanceSchema,
      },
      {
        name: Department.name,
        schema: DepartmentSchema,
      },
      {
        name: Leave.name,
        schema: LeaveSchema,
      },
    ]),
    MongooseModule.forFeature(
      [
        {
          name: Attendance.name,
          schema: AttendanceSchema,
        },
        {
          name: Department.name,
          schema: DepartmentSchema,
        },
        {
          name: Leave.name,
          schema: LeaveSchema,
        },
      ],
      "PRIMARY_DB",
    ),
    MongooseModule.forFeature(
      [
        {
          name: Attendance.name,
          schema: AttendanceSchema,
        },
        {
          name: Department.name,
          schema: DepartmentSchema,
        },
        {
          name: Leave.name,
          schema: LeaveSchema,
        },
      ],
      "SECONDARY_DB",
    ),
    AttendanceModule,
    TaskModule,
    SeedDepartmentAndDesignationModule,
    DepartmentModule,
  ],
})
export class WorkforceModule {}
