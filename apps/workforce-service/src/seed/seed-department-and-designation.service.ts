/**
 * @fileoverview Seed Department & Designation Service
 *
 * Automatically seeds default departments (HR, Sales, Operations) and
 * their associated designations (e.g., Software Engineer, Sales Manager)
 * into MongoDB on module initialization via `onModuleInit`.
 */
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Department } from "../schemas/department.schema";
import { Designation } from "../schemas/designation.schema";

@Injectable()
export class SeedDepartmentAndDesignationService {
  private readonly logger = new Logger(
    SeedDepartmentAndDesignationService.name,
  );

  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,

    @InjectModel(Designation.name)
    private readonly designationModel: Model<Designation>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    this.logger.log("Starting database seeding...");

    const departmentMap = await this.seedDepartments();
    await this.seedDesignations(departmentMap);

    this.logger.log("Database seeding completed successfully.");
  }

  // ===============================
  // Seed Departments
  // ===============================
  private async seedDepartments() {
    const departmentsData = [
      {
        name: "HR",
        description: "Human Resources department",
        isSystem: true,
      },
      {
        name: "SALES",
        description: "Sales department",
        isSystem: true,
      },
      {
        name: "Operations",
        description: "Operations & Software Engineering department",
        isSystem: true,
      },
    ];

    const departmentMap: Record<string, any> = {};

    for (const dept of departmentsData) {
      const updatedDepartment = await this.departmentModel.findOneAndUpdate(
        { name: dept.name },
        { $set: dept },
        { upsert: true, returnDocument: "after" },
      );

      departmentMap[dept.name] = updatedDepartment;
    }

    this.logger.log("Departments seeded/upserted successfully.");

    return departmentMap;
  }

  // ===============================
  // Seed Designations
  // ===============================
  private async seedDesignations(departmentMap: Record<string, any>) {
    const designationsData = [
      // ================= HR =================
      {
        name: "HR Manager",
        description: "Manages HR operations",
        departmentName: "HR",
      },
      {
        name: "Recruiter",
        description: "Handles recruitment process",
        departmentName: "HR",
      },

      // ================= Sales =================
      {
        name: "Sales Executive",
        description: "Handles client sales",
        departmentName: "SALES",
      },
      {
        name: "Sales Manager",
        description: "Manages sales team",
        departmentName: "SALES",
      },

      // ================= Operations (All Software Roles) =================
      {
        name: "Frontend Developer",
        description: "Develops frontend applications",
        departmentName: "Operations",
      },
      {
        name: "Backend Developer",
        description: "Develops backend services and APIs",
        departmentName: "Operations",
      },
      {
        name: "Full Stack Developer",
        description: "Handles both frontend and backend development",
        departmentName: "Operations",
      },
      {
        name: "Mobile App Developer",
        description: "Develops Android and iOS applications",
        departmentName: "Operations",
      },
      {
        name: "Shopify Developer",
        description: "Develops and maintains Shopify e-commerce stores",
        departmentName: "Operations",
      },
      {
        name: "WordPress Developer",
        description: "Develops and maintains WordPress websites",
        departmentName: "Operations",
      },
      {
        name: "DevOps Engineer",
        description: "Manages CI/CD pipelines and infrastructure",
        departmentName: "Operations",
      },
      {
        name: "QA Engineer",
        description: "Ensures software quality and testing",
        departmentName: "Operations",
      },
      {
        name: "UI/UX Designer",
        description: "Designs user interface and user experience",
        departmentName: "Operations",
      },
      {
        name: "Software Architect",
        description: "Designs scalable system architecture",
        departmentName: "Operations",
      },
      {
        name: "Database Administrator",
        description: "Manages databases and performance tuning",
        departmentName: "Operations",
      },
      {
        name: "Cyber Security Engineer",
        description: "Handles system and data security",
        departmentName: "Operations",
      },
      {
        name: "Cloud Engineer",
        description: "Manages cloud infrastructure (AWS, Azure, GCP)",
        departmentName: "Operations",
      },
      {
        name: "AI/ML Engineer",
        description: "Develops machine learning models and AI systems",
        departmentName: "Operations",
      },
      {
        name: "Data Scientist",
        description: "Analyzes data and builds predictive models",
        departmentName: "Operations",
      },
      {
        name: "Technical Project Manager",
        description: "Manages software development projects",
        departmentName: "Operations",
      },
      {
        name: "Product Manager",
        description: "Defines product vision and roadmap",
        departmentName: "Operations",
      },
      {
        name: "Technical Support Engineer",
        description: "Provides technical support to clients",
        departmentName: "Operations",
      },
      {
        name: "IT Support Specialist",
        description: "Provides IT support and troubleshooting",
        departmentName: "Operations",
      },
      {
        name: "System Administrator",
        description: "Manages and maintains IT systems",
        departmentName: "Operations",
      },
      {
        name: "Network Engineer",
        description: "Designs and manages network infrastructure",
        departmentName: "Operations",
      },
      {
        name: "Software Trainer",
        description: "Provides training on software tools and technologies",
        departmentName: "Operations",
      },
    ];

    for (const desg of designationsData) {
      const department = departmentMap[desg.departmentName];

      if (!department) continue;

      await this.designationModel.updateOne(
        { name: desg.name },
        {
          $set: {
            name: desg.name,
            description: desg.description,
            departmentId: department._id,
          },
        },
        { upsert: true },
      );
    }

    this.logger.log("Designations seeded/upserted successfully.");
  }
}
