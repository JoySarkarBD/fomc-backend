/**
 * @fileoverview User gateway service.
 *
 * Handles communication with the User micro-service via TCP ClientProxy.
 * Route-handler methods will be uncommented as the service API stabilises.
 *
 * @module api-gateway/user
 */

import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { USER_COMMANDS } from "@shared/constants";
import { MongoIdDto } from "@shared/dto";
import { firstValueFrom } from "rxjs";
import { buildResponse } from "../common/response.util";

@Injectable()
export class UserService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
  ) {}

  // /**
  //  * Fetch all users.
  //  *
  //  * @returns Promise resolving to an array of users
  //  */
  // async getUsers(
  //   myRole: UserRole,
  //   query: UserSearchQueryDto,
  //   myId?: MongoIdDto["id"],
  //   myDepartment?: Department,
  // ) {
  //   const result = await firstValueFrom(
  //     this.userClient.send(USER_COMMANDS.GET_USERS, {
  //       ...query,
  //       myRole,
  //       myId,
  //       myDepartment,
  //     }),
  //   );

  //   switch (result?.exception) {
  //     case "HttpException":
  //       throw new HttpException(result.message, HttpStatus.FORBIDDEN);
  //   }

  //   return buildResponse("Users fetched successfully", result);
  // }

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

    return buildResponse("User fetched successfully", user);
  }
}
