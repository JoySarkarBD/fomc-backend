import { IsMongoId } from "class-validator";

/**
 * Data Transfer Object for user parameters in the API Gateway.
 * Contains the ID field required for identifying a specific user in various user-related operations such as retrieving, updating, or deleting a user.
 * Validates that the ID is a valid MongoDB ObjectId string, ensuring that any provided ID meets the required format before processing requests that involve user identification.
 * The UserParamDto is used in the user service to handle requests that require a user ID parameter and ensures that the provided ID is valid before sending the request to the User Service for processing.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid user IDs are accepted when performing operations that involve specific users through the API Gateway.
 */
export class UserParamDto {
  @IsMongoId({ message: "ID must be a valid Mongo ID" })
  id!: string;
}
