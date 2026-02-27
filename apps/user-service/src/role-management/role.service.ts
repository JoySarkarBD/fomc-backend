/** @fileoverview Role service. Business logic for role CRUD, permission aggregation, and user-role association. @module user-service/role/role.service */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MongoIdDto } from "@shared/dto/mongo-id.dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import { Model, Types } from "mongoose";
import { Permission } from "../schemas/permission.schema";
import { Role, RoleDocument } from "../schemas/role.schema";
import { User } from "../schemas/user.schema";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

/**
 * Role Service
 *
 * Handles business logic related to roles, including creating, retrieving, updating, and deleting roles. It also manages the relationships between roles, permissions, and users.
 * Responsible for database interaction using Mongoose models for Role, Permission, and User schemas.
 */
@Injectable()
export class RoleService {
  /**
   * Creates an instance of RoleService.
   *
   * @param {Model<RoleDocument>} roleModel - Injected Mongoose model for Role schema.
   * @param {Model<Permission>} permissionModel - Injected Mongoose model for Permission schema.
   */
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Creates a new role in the database after checking for duplicate role names.
   *
   * @param {CreateRoleDto} createRoleDto - The data transfer object containing the details of the role to be created.
   * @returns {Promise<Role | { message: string; exception: string }>} The created role document or an error message if a role with the same name already exists.
   * @remarks This method first checks if a role with the same name (case-insensitive) already exists in the database. If it does, it returns an object containing an error message and an exception type. If no such role exists, it proceeds to create a new role using the provided data transfer object and returns the created role document.
   */
  async createRole(createRoleDto: CreateRoleDto) {
    // Check if a role with the same name already exists
    const existingRole = await this.roleModel.findOne({
      name: createRoleDto.name.toUpperCase(),
    });

    if (existingRole) {
      return {
        message: "Role with the same name already exists",
        exception: "Conflict",
      };
    }

    return await this.roleModel.create(createRoleDto);
  }

  /**
   * Retrieves a paginated list of roles based on the provided search query parameters.
   *
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @returns {Promise<{ roles: [{role: string, associateUserCount: number, permissionCount: number}] ; total: number; totalPages: number }>} An object containing the list of roles, total count, and total pages.
   */
  async findRoles(query: SearchQueryDto): Promise<{
    roles: {
      _id: string;
      name: string;
      description?: string;
      isSystem: boolean;
      createdBy?: string;
      createdAt: Date;
      updatedAt: Date;
      associateUserCount: number;
      permissionCount: number;
    }[];
    total: number;
    totalPages: number;
  }> {
    const { pageNo, pageSize } = query;
    const searchKey =
      typeof query.searchKey === "string" ? query.searchKey : "";

    // Roles with associate user count and permission count
    const [roles, total] = await Promise.all([
      this.roleModel.aggregate([
        {
          $match: {
            $or: [
              { name: { $regex: searchKey, $options: "i" } },
              { description: { $regex: searchKey, $options: "i" } },
            ],
          },
        },
        {
          $lookup: {
            from: "permissions",
            localField: "_id",
            foreignField: "role",
            as: "permissions",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "role",
            as: "users",
          },
        },
        {
          $addFields: {
            associateUserCount: { $size: "$users" },
            permissionCount: { $size: "$permissions" },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            isSystem: 1,
            createdBy: 1,
            createdAt: 1,
            updatedAt: 1,
            associateUserCount: 1,
            permissionCount: 1,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: (pageNo - 1) * pageSize },
        { $limit: pageSize },
      ]),
      this.roleModel.countDocuments({
        $or: [
          { name: { $regex: searchKey, $options: "i" } },
          { description: { $regex: searchKey, $options: "i" } },
        ],
      }),
    ]);

    return {
      roles,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Retrieves a single role by its ID.
   *
   * @param {MongoIdDto["id"]} id - The ID of the role to be retrieved.
   * @return {Promise<Role | null>} The role document if found, otherwise null.
   */
  async findRoleById(id: MongoIdDto["id"]): Promise<{
    _id: string;
    name: string;
    description?: string;
    isSystem: boolean;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
    associateUserCount: number;
    permissionCount: number;
    permissions: {
      _id: string;
      name: string;
      description?: string;
      canCreate: boolean;
      canRead: boolean;
      canUpdate: boolean;
      canDelete: boolean;
    }[];
  } | null> {
    const result = await this.roleModel
      .aggregate([
        {
          $match: { _id: new Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: "permissions", // permissions collection
            localField: "_id",
            foreignField: "role",
            as: "permissions",
          },
        },
        {
          $lookup: {
            from: "users", // users collection
            localField: "_id",
            foreignField: "role",
            as: "users",
          },
        },
        {
          $addFields: {
            associateUserCount: { $size: "$users" },
            permissionCount: { $size: "$permissions" },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            isSystem: 1,
            createdBy: 1,
            createdAt: 1,
            updatedAt: 1,
            associateUserCount: 1,
            permissionCount: 1,
            permissions: {
              _id: 1,
              name: 1,
              description: 1,
              canCreate: 1,
              canRead: 1,
              canUpdate: 1,
              canDelete: 1,
            },
          },
        },
      ])
      .exec();

    return result[0] || null;
  }

  /**
   * Updates a role by its ID with the provided update data.
   *
   * @param {MongoIdDto["id"]} id - The ID of the role to be updated.
   * @param {UpdateRoleDto} updateRoleDto - The data transfer object containing the updated role information.
   * @returns {Promise<Role | null>} The updated role document or null if the role was not found.
   */
  async updateRoleById(id: MongoIdDto["id"], updateRoleDto: UpdateRoleDto) {
    const existingRole = await this.roleModel.findById(id);

    if (!existingRole) {
      return {
        message: "Role not found",
        exception: "NotFoundException",
      };
    }

    if (existingRole.isSystem) {
      return {
        message: "System roles cannot be updated",
        exception: "Forbidden",
      };
    }

    // If the role is already exist with the same name, we should not allow update
    if (updateRoleDto.name) {
      const duplicateRole = await this.roleModel.findOne({
        _id: { $ne: id },
        name: updateRoleDto.name.toUpperCase(),
      });

      if (duplicateRole) {
        return {
          message: "Role with the same name already exists",
          exception: "Conflict",
        };
      }
    }

    existingRole.name = updateRoleDto.name
      ? updateRoleDto.name.toUpperCase()
      : existingRole.name;
    existingRole.description = updateRoleDto.description
      ? updateRoleDto.description
      : existingRole.description;

    return await existingRole.save();
  }

  /**
   * Deletes a role by its ID, ensuring that system roles and roles associated with permissions or users cannot be deleted.
   *
   * @param {MongoIdDto["id"]} id - The ID of the role to be deleted.
   * @returns {Promise<Role | { message: string; exception: string }>} The deleted role document or an error message if deletion is not allowed.
   * @throws {ForbiddenException} If the role is a system role or is associated with existing permissions or users, a ForbiddenException is thrown to prevent deletion.
   * @remarks This method first checks if the role is a system role, then verifies if it is associated with any permissions or users. If any of these conditions are met, it returns an appropriate error message and exception type. If the role can be safely deleted, it proceeds to delete the role from the database and returns the deleted document.
   */
  async deleteRoleById(id: MongoIdDto["id"]) {
    // If the role is a system role, we should not allow deletion
    const existingRole = await this.roleModel.findById(id);

    if (!existingRole) {
      return {
        message: "Role not found",
        exception: "NotFoundException",
      };
    }

    if (existingRole.isSystem) {
      return {
        message: "System roles cannot be deleted",
        exception: "Forbidden",
      };
    }

    // If the role associated with any permissions, we should not allow deletion
    const associatedPermissions = await this.permissionModel.find({
      role: new Types.ObjectId(id),
    });

    if (associatedPermissions.length > 0) {
      return {
        message:
          "Role cannot be deleted as it is associated with existing permissions",
        exception: "Forbidden",
      };
    }

    // If the role associated with any users, we should not allow deletion
    const associatedUsers = await this.userModel.find({ role: id });

    if (associatedUsers.length > 0) {
      return {
        message:
          "Role cannot be deleted as it is associated with existing users",
        exception: "Forbidden",
      };
    }

    return await this.roleModel.findByIdAndDelete(id);
  }
}
