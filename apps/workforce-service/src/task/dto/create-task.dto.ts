import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  isMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { TaskPriority, TaskStatus } from "../../schemas/task.schema";

/**
 * Custom validator to check if a value is either a valid MongoDB ObjectId or a non-empty string.
 * This allows for flexibility in accepting either a reference ID or a plain string for fields like client and project.
 * The validator checks if the value is a string and then verifies if it's either a valid MongoId or has a length greater than 0.
 * If the validation fails, it returns a default error message indicating that the field must be a valid ObjectId or a plain string.
 * This is useful in scenarios where the client or project can be referenced by an ID or simply by a name, providing more flexibility in how tasks are created and associated with clients and projects.
 */
@ValidatorConstraint({ name: "isMongoIdOrString", async: false })
export class IsMongoIdOrStringConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    // Valid if it's a string AND (it's a valid MongoId OR has length > 0)
    return typeof value === "string" && (isMongoId(value) || value.length > 0);
  }

  defaultMessage() {
    return "Field must be a valid MongoDB ObjectId or a plain string";
  }
}

/**
 * Decorator to apply the IsMongoIdOrString validation to a property.
 * This allows the property to accept either a valid MongoDB ObjectId or a non-empty string.
 * The decorator uses the custom IsMongoIdOrStringConstraint to perform the validation logic.
 * When applied to a property, it ensures that the value assigned to that property meets the criteria defined in the IsMongoIdOrStringConstraint, providing flexibility in how data can be represented while maintaining validation integrity.
 * @param validationOptions Optional validation options to customize the error message and other validation settings.
 */
export function IsMongoIdOrString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMongoIdOrStringConstraint,
    });
  };
}

/**
 * Data Transfer Object for creating a new task.
 * Contains fields for task name, client, project, due date, priority, description, status, creator ID, assignees, and attachments.
 * Validates that the name, client, project, due date, and createdBy fields are required and meet specific criteria (e.g., string type, valid MongoDB ObjectId).
 * Optional fields include priority (must be a valid TaskPriority enum value), description (string), status (must be a valid TaskStatus enum value), assignTo (array of valid MongoDB ObjectIds), and attachments (array of strings).
 * This DTO is used in the task creation process to ensure that the input data is valid and meets the necessary requirements before a new task is created in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that tasks are created with the necessary information while allowing for flexibility in how clients and projects are referenced.
 */
export class CreateTaskDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsMongoIdOrString({ message: "Client must be a valid ID or plain string" })
  @IsNotEmpty({ message: "Client is required" })
  client!: string;

  @IsMongoIdOrString({ message: "Project must be a valid ID or plain string" })
  @IsNotEmpty({ message: "Project is required" })
  project!: string;

  @IsDateString({}, { message: "dueDate must be a valid ISO date string" })
  @IsNotEmpty({ message: "dueDate is required" })
  dueDate!: Date;

  @IsEnum(TaskPriority, { message: "Invalid priority level" })
  @IsOptional()
  priority?: TaskPriority;

  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus, { message: "Invalid status" })
  @IsOptional()
  status?: TaskStatus;

  @IsMongoId({ message: "createdBy must be a valid ObjectId" })
  @IsNotEmpty({ message: "Creator ID is required" })
  createdBy!: string;

  @IsArray({ message: "assignTo must be an array" })
  @IsMongoId({ each: true, message: "Each assignee must be a valid ObjectId" })
  @IsOptional()
  assignTo?: string[];
}
