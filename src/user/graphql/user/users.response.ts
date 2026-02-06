import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse, ValidationErrorItem } from '../../../common/response';
import { User } from '../../entities/user.entity';

/**
 * UserResponse is a GraphQL ObjectType that represents the response structure for a single user-related operation.
 * It extends the BaseResponse to include standard response fields such as statusCode, success, message, and timestamp.
 * Additionally, it includes a data field that contains the user information, excluding the password for security reasons.
 * This response type can be used for operations like creating a user, fetching a single user, or updating a user.
 */
@ObjectType()
export class UserResponse extends BaseResponse {
  @Field(() => [ValidationErrorItem], { nullable: true })
  errors?: ValidationErrorItem[] | null;

  @Field(() => User, { nullable: true })
  data!: Omit<User, 'password'> | null;
}

/**
 * UsersResponse is a GraphQL ObjectType that represents the response structure for fetching multiple users.
 * It extends the BaseResponse to include standard response fields such as statusCode, success, message, and timestamp.
 * Additionally, it includes a data field that contains an array of user information, excluding passwords for security reasons.
 * This response type can be used for operations like fetching all users or searching for users based on specific criteria.
 * The structured response allows clients to easily handle the results of user-related queries and manage any potential errors that may arise during the fetching process.
 */
@ObjectType()
export class UsersResponse extends BaseResponse {
  @Field(() => [ValidationErrorItem], { nullable: true })
  errors?: ValidationErrorItem[] | null;

  @Field(() => [User], { nullable: true })
  data!: Omit<User, 'password'>[] | null;
}

/**
 * CreateUserResponse is a GraphQL ObjectType that represents the response structure for the create user operation.
 * It includes a success field indicating whether the operation was successful, an optional message field for additional information,
 * an optional errors field that contains validation errors if the input data is invalid, and a data field that contains the created user information (excluding the password).
 * This response type provides a clear structure for handling both successful and failed user creation attempts.
 */
@ObjectType()
export class CreateUserResponse extends BaseResponse {
  @Field(() => [ValidationErrorItem], { nullable: true })
  errors?: ValidationErrorItem[] | null;

  @Field(() => User, { nullable: true })
  data!: Omit<User, 'password'> | null;
}
