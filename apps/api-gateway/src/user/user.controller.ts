/**
 * @fileoverview User gateway controller.
 *
 * Exposes user-related HTTP endpoints. Currently a stub — route
 * handlers will be uncommented as the User micro-service API stabilises.
 *
 * @module api-gateway/user
 */

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MongoIdDto } from "@shared/dto";
import type { AuthUser } from "@shared/interfaces";
import { UpdateUserProfileDto } from "apps/user-service/src/dto/update-user-profile.dto";
import { UserSearchQueryDto } from "apps/user-service/src/dto/user-search-query.dto";
import * as fs from "fs";
import type { File } from "multer";
import { diskStorage } from "multer";
import * as path from "path";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get a list of users based on query parameters for filtering and pagination.
   *
   * @guards RolesGuard - Ensures that only users with specific roles can access this endpoint.
   * @param query - Query parameters for filtering and pagination of users.
   * @returns A list of users matching the query criteria.
   */
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "DIRECTOR", "HR", "PROJECT MANAGER", "TEAM LEADER")
  @Get()
  async getUsers(
    @GetUser() user: AuthUser,
    @Query() query: UserSearchQueryDto,
  ) {
    return await this.userService.getUsers(query);
  }

  /**
   * Get a single user by their unique identifier (ID).
   *
   * @guards RolesGuard - Ensures that only users with specific roles can access this endpoint.
   * @param {MongoIdDto} params - Object containing the user ID.
   * @returns The user details corresponding to the provided ID.
   */
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "DIRECTOR", "HR", "PROJECT MANAGER", "TEAM LEADER")
  @Get(":id")
  async getUser(@GetUser() user: AuthUser, @Param() params: MongoIdDto) {
    const result = await this.userService.getUser(
      (user._id ?? user.id) as MongoIdDto["id"],
    );
    return result;
  }

  // /**
  //  * Delete a user by their unique identifier (ID).
  //  *
  //  * @guards RolesGuard - Ensures that only users with the HR role can access this endpoint.
  //  * @param {MongoIdDto} params - Object containing the user ID.
  //  * @returns A success message or the details of the deleted user.
  //  */
  // // @UseGuards(RolesGuard)
  // // @Roles(UserRole.HR)
  // // @Delete(":id")
  // // async deleteUser(@Param() params: MongoIdDto) {
  // //   return await this.userService.deleteUser(params.id);
  // // }

  /**
   * Endpoint for retrieving the profile of the currently authenticated user.
   * Utilizes the UserService to fetch the profile information based on the authenticated user's context.
   * @returns The profile information of the authenticated user.
   */
  @Get("profile/me")
  async getProfile(@GetUser() user: AuthUser) {
    return await this.userService.getUser(
      (user._id ?? user.id) as MongoIdDto["id"],
    );
  }

  /**
   * Endpoint for updating the profile of the currently authenticated user, allowing updates to the user's name and avatar.
   *
   * This endpoint accepts multipart/form-data for avatar uploads and uses the FileInterceptor to handle file storage. The uploaded avatar is saved to the "uploads/avatars" directory, and the file path is stored in the user's profile. The endpoint validates that at least one profile field (name or avatar) is provided for update and returns an appropriate response based on the update operation's success or failure.
   * @param {AuthUser} user - The currently authenticated user, injected via the GetUser decorator.
   * @param {UpdateUserProfileDto} data - Data transfer object containing the fields to be updated in the user's profile (name and/or avatar).
   * @param {File} avatarFile - The uploaded avatar file, handled by the FileInterceptor.
   * @returns The updated profile information of the authenticated user after the update operation is performed.
   * @throws BadRequestException if neither name nor avatar is provided for update.
   */
  @Patch("profile/me")
  /**
   * Update the authenticated user's profile, allowing changes to their name and avatar.
   *
   * This endpoint accepts multipart/form-data for avatar uploads and uses the FileInterceptor to handle file storage. The uploaded avatar is saved to the "uploads/avatars" directory, and the file path is stored in the user's profile. The endpoint validates that at least one profile field (name or avatar) is provided for update and returns an appropriate response based on the update operation's success or failure.
   * @param {AuthUser} user - The currently authenticated user, injected via the GetUser decorator.
   */
  @UseInterceptors(
    FileInterceptor("avatar", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.join(process.cwd(), "uploads", "avatars");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${ext}`);
        },
      }),
    }),
  )
  async updateProfile(
    @GetUser() user: AuthUser,
    @Body() data: UpdateUserProfileDto,
    @UploadedFile() avatarFile?: File,
  ) {
    const existingProfile = avatarFile
      ? await this.userService.getUser(
          (user._id ?? user.id) as MongoIdDto["id"],
        )
      : null;
    const existingAvatarPath = existingProfile?.data?.avatar as
      | string
      | null
      | undefined;

    const avatarPath = avatarFile
      ? path.join("uploads", "avatars", avatarFile.filename).replace(/\\/g, "/")
      : undefined;

    const updated = await this.userService.updateUserProfile(
      (user._id ?? user.id) as MongoIdDto["id"],
      {
        ...data,
        avatar: avatarPath,
      },
    );

    if (avatarFile && existingAvatarPath && existingAvatarPath !== avatarPath) {
      const normalized = existingAvatarPath.replace(/^\/+/, "");
      if (normalized.startsWith("uploads/avatars/")) {
        const absolutePath = path.join(process.cwd(), normalized);
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      }
    }

    return updated;
  }
}
