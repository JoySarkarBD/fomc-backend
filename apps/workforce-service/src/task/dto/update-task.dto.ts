import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId } from "class-validator";
import { CreateTaskDto } from "./create-task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsMongoId({ message: "ID must be a valid Mongo ID" })
  id!: string;
}
