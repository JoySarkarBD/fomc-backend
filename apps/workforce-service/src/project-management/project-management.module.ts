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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectManagementModule {}
