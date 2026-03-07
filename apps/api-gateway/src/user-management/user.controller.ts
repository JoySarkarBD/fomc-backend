/**
 * @fileoverview User gateway controller.
 *
 * Exposes user-related HTTP endpoints. Currently a stub — route
 * handlers will be uncommented as the User micro-service API stabilises.
 */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { MongoIdDto } from "@shared/dto";
import type { AuthUser } from "@shared/interfaces";
import { removeFile, uploadFile } from "@shared/utils/minio.client";
import { UpdateUserProfileDto } from "apps/user-service/src/user-management/dto/update-user-profile.dto";
import { UserSearchQueryDto } from "apps/user-service/src/user-management/dto/user-search-query.dto";
import * as fs from "fs";
import type { Multer } from "multer";
import { memoryStorage } from "multer";
import * as path from "path";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiRequestDetails } from "../common/decorators/api-request.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import {
  UserForbiddenDto,
  UsersForbiddenDto,
} from "./dto/error/user-forbidden.dto";
import {
  UpdateUserProfileInternalErrorDto,
  UserInternalErrorDto,
  UserProfileInternalErrorDto,
  UsersInternalErrorDto,
} from "./dto/error/user-internal-error.dto";
import { UserNotFoundDto } from "./dto/error/user-not-found.dto";
import {
  UpdateUserProfileUnauthorizedDto,
  UserProfileUnauthorizedDto,
  UsersUnauthorizedDto,
  UserUnauthorizedDto,
} from "./dto/error/user-unauthorized.dto";
import {
  UserProfileUpdateValidationDto,
  UsersValidationDto,
  UserValidationDto,
} from "./dto/error/user-validation.dto";
import {
  UserProfileSuccessDto,
  UserProfileUpdateSuccessDto,
  UsersListSuccessDto,
  UserSuccessDto,
} from "./dto/success/user-success.dto";
import { UserService } from "./user.service";

@ApiTags("User Management")
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
  @ApiOperation({
    summary: "List users",
    description: "Retrieves a list of users with optional filtering.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    queries: [
      {
        name: "pageNo",
        description: "Page number, starts from 1",
        required: true,
      },
      {
        name: "pageSize",
        description: "Items per page",
        required: true,
      },
      {
        name: "searchKey",
        description: "Search keyword",
        required: false,
      },
      {
        name: "role",
        description: "Filter users by role IDs (comma-separated or array)",
        required: false,
      },
      {
        name: "department",
        description:
          "Filter users by department IDs (comma-separated or array)",
        required: false,
      },
      {
        name: "designation",
        description:
          "Filter users by designation IDs (comma-separated or array)",
        required: false,
      },
    ],
    queryDto: UserSearchQueryDto,
  })
  @ApiSuccessResponse(UsersListSuccessDto, 200)
  @ApiErrorResponses({
    validation: UsersValidationDto,
    unauthorized: UsersUnauthorizedDto,
    forbidden: UsersForbiddenDto,
    internal: UsersInternalErrorDto,
  })
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "DIRECTOR", "HR", "PROJECT MANAGER", "TEAM LEADER")
  @Get()
  async getUsers(@Query() query: UserSearchQueryDto) {
    return await this.userService.getUsers(query);
  }

  /**
   * Get a single user by their unique identifier (ID).
   *
   * @guards RolesGuard - Ensures that only users with specific roles can access this endpoint.
   * @param {MongoIdDto} params - Object containing the user ID.
   * @returns The user details corresponding to the provided ID.
   */
  @ApiOperation({
    summary: "Get user by ID",
    description: "Retrieves details of a specific user.",
  })
  @ApiRequestDetails({
    params: {
      name: "id",
      description: "The ID of the department to retrieve",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: MongoIdDto,
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(UserSuccessDto, 200)
  @ApiErrorResponses({
    validation: UserValidationDto,
    unauthorized: UserUnauthorizedDto,
    forbidden: UserForbiddenDto,
    internal: UserInternalErrorDto,
    notFound: UserNotFoundDto,
  })
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "DIRECTOR", "HR", "PROJECT MANAGER", "TEAM LEADER")
  @Get(":id")
  async getUser(@Param() params: MongoIdDto) {
    const result = await this.userService.getUser(params.id);
    return result;
  }

  /**
   * Endpoint for retrieving the profile of the currently authenticated user.
   * Utilizes the UserService to fetch the profile information based on the authenticated user's context.
   * @returns The profile information of the authenticated user.
   */
  @ApiOperation({
    summary: "Get my profile",
    description: "Retrieves the profile of the authenticated user.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(UserProfileSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: UserProfileUnauthorizedDto,
    internal: UserProfileInternalErrorDto,
  })
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
  @ApiOperation({
    summary: "Update my profile",
    description: "Updates the authenticated user's name and/or avatar.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The full name of the user",
          example: "John Doe",
        },
        avatar: {
          type: "string",
          format: "binary",
          description: "Avatar image file",
        },
      },
      required: [],
    },
  })
  @ApiSuccessResponse(UserProfileUpdateSuccessDto, 200)
  @ApiErrorResponses({
    validation: UserProfileUpdateValidationDto,
    unauthorized: UpdateUserProfileUnauthorizedDto,
    internal: UpdateUserProfileInternalErrorDto,
  })
  @Patch("profile/me")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("avatar", {
      storage: memoryStorage(), // keep in memory for MinIO or custom upload
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
          return cb(
            new BadRequestException("Only image files are allowed"),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async updateProfile(
    @GetUser() user: AuthUser,
    @Body() data: UpdateUserProfileDto,
    @UploadedFile() avatarFile?: Multer.File,
  ) {
    const logger = new Logger(UserController.name);

    let avatarPath: string | undefined;

    // Upload avatar if provided
    if (avatarFile) {
      try {
        avatarPath = await uploadFile(
          avatarFile.buffer,
          avatarFile.originalname,
          avatarFile.mimetype,
        );
        // Keep the stored path as minio://bucket/objectName so it remains private.
        // We will generate a presigned URL when returning user data.
      } catch (err) {
        logger.error("Avatar upload failed", err);
        throw new InternalServerErrorException(
          "Failed to upload avatar. Check MinIO configuration.",
        );
      }
    }

    // Fetch existing profile to remove old avatar if needed
    const existingProfile = avatarFile
      ? await this.userService.getUser(user._id! as MongoIdDto["id"])
      : null;

    const updated = await this.userService.updateUserProfile(
      user._id! as MongoIdDto["id"],
      {
        ...data,
        ...(avatarPath ? { avatar: avatarPath } : {}),
      },
    );

    // Remove old avatar
    if (
      avatarFile &&
      existingProfile?.data?.avatar &&
      existingProfile.data.avatar !== avatarPath
    ) {
      const oldAvatar = existingProfile.data.avatar;
      if (oldAvatar.startsWith("uploads/avatars/")) {
        const absolutePath = path.join(
          process.cwd(),
          oldAvatar.replace(/^\/+/, ""),
        );
        if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
      } else if (oldAvatar.startsWith("minio://")) {
        await removeFile(oldAvatar);
      }
    }

    return updated;
  }
}
