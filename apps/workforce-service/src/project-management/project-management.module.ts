/**
 * @fileoverview Project Management Module
 *
 * Registers the project, client, and profile schemas and exports the ProjectService.
 */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Client,
  ClientSchema,
  Profile,
  ProfileSchema,
  Project,
  ProjectSchema,
} from "../schemas/project.schema";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { Department, DepartmentSchema } from "../schemas/department.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectManagementModule {}
