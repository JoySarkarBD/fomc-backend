/**
 * @fileoverview User gateway service.
 *
 * Handles communication with the User micro-service via TCP ClientProxy.
 * Route-handler methods will be uncommented as the service API stabilises.
 */

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { USER_COMMANDS } from "@shared/constants";
import { MongoIdDto } from "@shared/dto";
import { UpdateUserProfileDto } from "apps/user-service/src/user-management/dto/update-user-profile.dto";
import { UserSearchQueryDto } from "apps/user-service/src/user-management/dto/user-search-query.dto";
import { firstValueFrom } from "rxjs";
import { buildResponse } from "../common/response.util";

@Injectable()
export class UserService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
  ) {}

  /**
   * Fetch all users.
   *
   * @returns Promise resolving to an array of users
   */
  async getUsers(query: UserSearchQueryDto) {
    const result = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS, {
        ...query,
      }),
    );

    return buildResponse("Users fetched successfully", result);
  }

  /**
   * Fetch a single user by ID.
   *
   * @param {MongoIdDto} params - Object containing the user ID.
   * @returns Promise resolving to the user object
   * @throws NotFoundException if the user does not exist
   */
  async getUser(id: MongoIdDto["id"]) {
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, {
        id,
      }),
    );

    if (user.exception === "NotFoundException") {
      throw new NotFoundException("User not found");
    }

    this.handleException(user);

    return buildResponse("User fetched successfully", user);
  }

  /**
   * Update the profile of the authenticated user, allowing changes to their name and avatar.
   *
   * This method accepts multipart/form-data for avatar uploads and uses the FileInterceptor to handle file storage. The uploaded avatar is saved to the "uploads/avatars" directory, and the file path is stored in the user's profile. The method validates that at least one profile field (name or avatar) is provided for update and returns an appropriate response based on the success or failure of the update operation.
   *
   * @param {MongoIdDto} params - Object containing the user ID.
   * @param {UpdateUserProfileDto} data - Data transfer object containing the fields to be updated in the user's profile (name and/or avatar).
   * @returns The updated profile information of the authenticated user after the update operation is performed.
   * @throws BadRequestException if neither name nor avatar is provided for update.
   */
  async updateUserProfile(id: MongoIdDto["id"], data: UpdateUserProfileDto) {
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.UPDATE_USER_PROFILE, {
        id,
        data,
      }),
    );

    this.handleException(user);

    return buildResponse("User profile updated successfully", user);
  }

  /**
   * Handle exceptions from the Workforce micro-service responses.
   *
   * @param result - The response result from the Workforce micro-service, which may contain an exception field indicating an error.
   */
  private handleException(result: any) {
    if (result?.exception) {
      switch (result.exception) {
        case "NotFoundException":
          throw new NotFoundException(result.message);
        case "HttpException":
          throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
        case "ConflictException":
          throw new HttpException(result.message, HttpStatus.CONFLICT);
        default:
          throw new HttpException(
            result.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }
}
