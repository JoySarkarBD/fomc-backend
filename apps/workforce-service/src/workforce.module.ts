/**
 * @fileoverview Workforce Module
 *
 * Root module for the Workforce microservice. Registers Mongoose schemas,
 * database connections, and feature modules (attendance, department, task)
 * along with the department/designation seed module.
 */
import { Module } from "@nestjs/common";
import { MongooseConnectionsModule } from "@shared/database/mongoose-connections.module";
import { AttendanceModule } from "./attendance-management/attendance.module";
import { DepartmentModule } from "./department-management/department.module";
import { DesignationModule } from "./designation-management/designation.module";
import { SeedDepartmentAndDesignationModule } from "./seed/seed-department-and-designation.module";
import { SellsShiftManagementModule } from "./sells-shift-management/sells-shift-management.module";
import { TaskModule } from "./task-management/task.module";

@Module({
  imports: [
    /**
     * MongooseConnectionsModule is imported to establish a connection to the MongoDB database using Mongoose.
     * This allows the Workforce Service to interact with the MongoDB database for storing and retrieving workforce-related data, enabling persistence and data management for workforce operations.
     */
    MongooseConnectionsModule,

    AttendanceModule,
    TaskModule,
    SeedDepartmentAndDesignationModule,
    DepartmentModule,
    DesignationModule,
    SellsShiftManagementModule,
  ],
})
export class WorkforceModule {}
