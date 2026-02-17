import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Permission, PermissionName } from "../schemas/permission.schema";
import { Role } from "../schemas/role.schema";

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

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

      // HR
      {
        role: getRoleId("HR"),
        name: PermissionName.USER,
        description: "Manage users",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("HR"),
        name: PermissionName.DEPARTMENT,
        description: "Manage departments",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("HR"),
        name: PermissionName.ATTENDANCE,
        description: "View attendance",
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        role: getRoleId("HR"),
        name: PermissionName.LEAVE,
        description: "Approve leaves",
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },

      // PROJECT MANAGER
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.USER,
        description: "Update team users",
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.DESIGNATION,
        description: "Assign roles",
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.ATTENDANCE,
        description: "Track attendance",
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("PROJECT MANAGER"),
        name: PermissionName.LEAVE,
        description: "Approve leaves",
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },

      // TEAM LEADER
      {
        role: getRoleId("TEAM LEADER"),
        name: PermissionName.USER,
        description: "Manage team members",
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("TEAM LEADER"),
        name: PermissionName.ATTENDANCE,
        description: "Track attendance",
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        role: getRoleId("TEAM LEADER"),
        name: PermissionName.LEAVE,
        description: "Approve leaves",
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },

      // EMPLOYEE
      {
        role: getRoleId("EMPLOYEE"),
        name: PermissionName.ATTENDANCE,
        description: "View attendance",
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        role: getRoleId("EMPLOYEE"),
        name: PermissionName.LEAVE,
        description: "Request leave",
        canCreate: true,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },

      // INTERN
      {
        role: getRoleId("INTERN"),
        name: PermissionName.ATTENDANCE,
        description: "View attendance",
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        role: getRoleId("INTERN"),
        name: PermissionName.LEAVE,
        description: "Request leave",
        canCreate: true,
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
