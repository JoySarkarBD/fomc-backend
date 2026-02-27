/**
 * @fileoverview User gateway controller.
 *
 * Exposes user-related HTTP endpoints. Currently a stub — route
 * handlers will be uncommented as the User micro-service API stabilises.
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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { MongoIdDto } from "@shared/dto";
import type { AuthUser } from "@shared/interfaces";
import { UpdateUserProfileDto } from "apps/user-service/src/dto/update-user-profile.dto";
import { UserSearchQueryDto } from "apps/user-service/src/dto/user-search-query.dto";
import * as fs from "fs";
import type { File } from "multer";
import { diskStorage } from "multer";
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

@ApiTags("User")
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
  async getUser(@GetUser() user: AuthUser, @Param() params: MongoIdDto) {
    const result = await this.userService.getUser(
      (user._id ?? user.id) as MongoIdDto["id"],
    );
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
  @ApiSuccessResponse(UserProfileUpdateSuccessDto, 200)
  @ApiErrorResponses({
    validation: UserProfileUpdateValidationDto,
    unauthorized: UpdateUserProfileUnauthorizedDto,
    internal: UpdateUserProfileInternalErrorDto,
  })
  @Patch("profile/me")
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
