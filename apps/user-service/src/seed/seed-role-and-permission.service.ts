/** @fileoverview Seed service for roles and permissions. Upserts default roles and their associated permissions on module initialisation. @module user-service/seed/seed-role-and-permission.service */
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Permission, PermissionName } from "../schemas/permission.schema";
import { Role } from "../schemas/role.schema";

@Injectable()
export class SeedRoleAndPermissionService {
  private readonly logger = new Logger(SeedRoleAndPermissionService.name);

  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  async onModuleInit() {
    await this.seedRolesAndPermissions();
  }

  async seedRolesAndPermissions() {
    // -----------------------
    // Roles Upsert
    // -----------------------
    const rolesData = [
      {
        name: "SUPER ADMIN",
        description: "Super Admin role with all permissions",
        isSystem: true,
      },
      {
        name: "DIRECTOR",
        description: "Director role with all permissions",
        isSystem: true,
      },
      {
        name: "HR",
        description: "HR role with permissions to manage users and departments",
        isSystem: true,
      },
      {
        name: "PROJECT MANAGER",
        description:
          "Project Manager role with permissions to manage projects and teams",
        isSystem: true,
      },
      {
        name: "TEAM LEADER",
        description:
          "Team Leader role with permissions to manage team members and tasks",
        isSystem: true,
      },
      {
        name: "EMPLOYEE",
        description: "Employee role with basic permissions",
        isSystem: true,
      },
      {
        name: "INTERN",
        description: "Intern role with limited permissions",
        isSystem: true,
      },
    ];

    for (const roleData of rolesData) {
      await this.roleModel.updateOne(
        { name: roleData.name },
        { $set: roleData },
        { upsert: true },
      );
    }
    this.logger.log("Roles seeded/upserted successfully.");

    // -----------------------
    // Fetch roles
    // -----------------------
    const roles = await this.roleModel.find().exec();
    const getRoleId = (name: string) => roles.find((r) => r.name === name)?._id;

    // -----------------------
    // Permissions Upsert
    // -----------------------
    const permissionsData = [
      // DIRECTOR
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.USER,
        description: "Manage users",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.DEPARTMENT,
        description: "Manage departments",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.ROLE,
        description: "Manage roles",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.DESIGNATION,
        description: "Manage designations",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.PERMISSION,
        description: "Manage permissions",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.ATTENDANCE,
        description: "Manage attendance",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.LEAVE,
        description: "Manage leaves",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.TASK,
        description: "Manage tasks",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.PROJECT,
        description: "Manage projects",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.DCR,
        description: "Manage DCRs",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.SHIFT,
        description: "Manage shifts",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("DIRECTOR"),
        name: PermissionName.LEARNING,
        description: "Manage training and development",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },

      // SUPER ADMIN - ALL PERMISSIONS (same as director but with an additional system role flag)
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.USER,
        description: "Manage users",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.DEPARTMENT,
        description: "Manage departments",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.ROLE,
        description: "Manage roles",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.DESIGNATION,
        description: "Manage designations",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.PERMISSION,
        description: "Manage permissions",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.ATTENDANCE,
        description: "Manage attendance",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.LEAVE,
        description: "Manage leaves",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.TASK,
        description: "Manage tasks",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.PROJECT,
        description: "Manage projects",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.DCR,
        description: "Manage DCRs",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.SHIFT,
        description: "Manage shifts",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("SUPER ADMIN"),
        name: PermissionName.LEARNING,
        description: "Manage training and development",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },

      // PROJECT MANAGER
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.TASK,
        description: "Manage tasks and assign to team members",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.DCR,
        description: "View team DCRs and provide feedback",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.PROJECT,
        description: "Manage projects and assign to team members",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.USER,
        description: "View team members",
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.ATTENDANCE,
        description: "Manage attendance for his own and team members",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.LEAVE,
        description: "Manage team leaves",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.SHIFT,
        description: "Manage shifts for his own and team members",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.LEARNING,
        description: "Assign training to team members",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },

      // TEAM LEADER
      {
        role: getRoleId("TEAM LEADER"),
        name: PermissionName.TASK,
        description: "Manage tasks and assign to team members",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      {
        role: getRoleId("TEAM LEADER"),
        name: PermissionName.PROJECT,
        description: "View projects and tasks assigned to team members",
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        role: getRoleId("TEAM LEADER"),
        name: PermissionName.DCR,
        description: "View team DCRs and provide feedback",
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("TEAM LEADER"),
        name: PermissionName.USER,
        description: "View team members",
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        role: getRoleId("TEAM LEADER"),
        name: PermissionName.ATTENDANCE,
        description: "Manage attendance for his own and team members",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("TEAM LEADER"),
        name: PermissionName.LEAVE,
        description: "Manage team leaves",
        canCreate: true,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        role: getRoleId("TEAM LEADER"),
        name: PermissionName.SHIFT,
        description: "Manage shifts for his own and team members",
        canCreate: true,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        role: getRoleId("TEAM LEADER"),
        name: PermissionName.LEARNING,
        description: "Assign training to team members",
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },

      // EMPLOYEE
      {
        role: getRoleId("EMPLOYEE"),
        name: PermissionName.TASK,
        description: "View assigned tasks",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("EMPLOYEE"),
        name: PermissionName.DCR,
        description: "Create and view own DCRs",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("EMPLOYEE"),
        name: PermissionName.ATTENDANCE,
        description: "Mark attendance and view own attendance records",
        canCreate: true,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        role: getRoleId("EMPLOYEE"),
        name: PermissionName.LEAVE,
        description: "Apply for leave and view own leave records",
        canCreate: true,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        role: getRoleId("EMPLOYEE"),
        name: PermissionName.SHIFT,
        description: "View own shifts",
        canCreate: true,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        role: getRoleId("EMPLOYEE"),
        name: PermissionName.LEARNING,
        description: "View and enroll in training programs",
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
    ];

    for (const perm of permissionsData) {
      if (!perm.role) continue; // Skip if role not found
      await this.permissionModel.updateOne(
        { role: perm.role, name: perm.name },
        { $set: { ...perm, isSystem: true } },
        { upsert: true },
      );
    }

    this.logger.log("Permissions seeded/upserted successfully.");
  }
}
