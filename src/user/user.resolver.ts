import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  buildResponse,
  executeWithResponse,
  mapHttpException,
} from '../common/utils/response.util';
import { validateInput } from '../common/utils/validation.util';
import {
  CreateUserResponse,
  UserResponse,
  UsersResponse,
} from '../user/graphql/user/users.response';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

/**
 * Resolver for User entity.
 * Handles GraphQL queries and mutations related to users.
 * @class UserResolver
 */
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {} // Injecting UserService

  /**
   * Creates a new user.
   * @param {CreateUserInput} createUserInput - Input data for creating a user.
   * @returns {Promise<UserResponse>} The created user response.
   * @mutation
   */
  @Mutation(() => CreateUserResponse, { name: 'createUser' })
  async create(
    @Args('createUserInput', { type: () => CreateUserInput })
    createUserInput: CreateUserInput,
  ): Promise<CreateUserResponse> {
    const { input, errors } = await validateInput(
      CreateUserInput,
      createUserInput,
    );

    if (errors.length > 0) {
      return buildResponse({
        statusCode: 400,
        success: false,
        message: 'Validation failed',
        errors,
        data: null,
      });
    }

    return executeWithResponse(() => this.userService.create(input), {
      successMessage: 'User created successfully',
      successStatus: 201,
      onError: (error) =>
        mapHttpException(error, {
          defaultMessage: 'Unexpected error while creating user',
          conflictField: 'email',
        }),
    });
  }

  /**
   * Retrieves all users.
   * @returns {Promise<UsersResponse>} List of all users.
   * @query
   */
  @Query(() => UsersResponse, { name: 'users' })
  async findAll(): Promise<UsersResponse> {
    const users = await this.userService.findAll();
    return buildResponse({
      statusCode: 200,
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  }

  /**
   * Retrieves a user by ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserResponse | null>} The user response if found, otherwise null.
   * @query
   */
  @Query(() => UserResponse, { name: 'user', nullable: true })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    const user = await this.userService.findOne(id);
    return buildResponse({
      statusCode: user ? 200 : 404,
      success: !!user,
      message: user ? 'User retrieved successfully' : `User ${id} not found`,
      data: user,
    });
  }

  /**
   * Updates an existing user.
   * @param {UpdateUserInput} updateUserInput - Input data for updating a user.
   * @returns {Promise<UserResponse>} The updated user response.
   * @mutation
   */
  @Mutation(() => UserResponse, { name: 'updateUser' })
  async update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return executeWithResponse(
      () => this.userService.update(updateUserInput.id, updateUserInput),
      {
        successMessage: 'User updated successfully',
        onError: (error) =>
          mapHttpException(error, {
            defaultMessage: 'Unexpected error while updating user',
          }),
      },
    );
  }

  /**
   * Removes a user by ID.
   * @param {string} id - The ID of the user to remove.
   * @returns {Promise<UserResponse>} The removed user response.
   * @mutation
   */
  @Mutation(() => UserResponse, { name: 'removeUser' })
  async remove(@Args('id', { type: () => ID }) id: string) {
    return executeWithResponse(() => this.userService.remove(id), {
      successMessage: 'User removed successfully',
      onError: (error) =>
        mapHttpException(error, {
          defaultMessage: 'Unexpected error while removing user',
        }),
    });
  }
}
