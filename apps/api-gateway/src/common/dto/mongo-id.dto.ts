import { IsMongoId, IsNotEmpty } from "class-validator";

/**
 * Data Transfer Object for validating MongoDB ObjectId strings.
 *
 * Contains a single field 'id' which is required and must be a valid MongoDB ObjectId string.
 * This DTO is used in various endpoints that require a MongoDB ObjectId as a parameter to ensure that the provided ID is valid and correctly formatted before processing the request.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid MongoDB ObjectId strings are accepted when identifying resources in the system.
 */
export class MongoIdDto {
  @IsMongoId({ message: "ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "ID is required" })
  id!: string;
}
