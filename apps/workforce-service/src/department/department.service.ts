import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "apps/user-service/src/schemas/user.schema";
import { Model, Types } from "mongoose";
import { MongoIdDto } from "../../../api-gateway/src/common/dto/mongo-id.dto";
import { SearchQueryDto } from "../../../api-gateway/src/common/dto/search-query.dto";
import { Department, DepartmentDocument } from "../schemas/department.schema";
import {
  Designation,
  DesignationDocument,
} from "../schemas/designation.schema";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
    @InjectModel(Designation.name)
    private readonly designationModel: Model<DesignationDocument>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Create a new department in the database after checking for duplicate department names.
   *
   * @param {CreateDepartmentDto} createDepartmentDto - The data transfer object containing the details of the department to be created.
   * @returns {Promise<any>} The newly created department or an error message if a department with the same name already exists.
   * @remarks This method first checks if a department with the same name (case-insensitive) already exists in the database. If it does, it returns a conflict message. If not, it proceeds to create and save the new department using the departmentModel.
   */
  async createDepartment(createDepartmentDto: CreateDepartmentDto) {
    // Check if department with the same name already exists
    const existingDepartment = await this.departmentModel.findOne({
      name: createDepartmentDto.name.toUpperCase(),
    });

    if (existingDepartment) {
      return {
        message: "Department with the same name already exists",
        exception: "Conflict",
      };
    }

    return await this.departmentModel.create(createDepartmentDto);
  }

  /**
   * Retrieve a paginated list of departments based on the provided search query parameters.
   *
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @return {Promise<{ departments: any[]; total: number; totalPages: number }>} An object containing the list of departments, total count, and total pages based on the search criteria.
   */
  async findDepartments(query: SearchQueryDto): Promise<{
    departments: {
      _id: string;
      name: string;
      description?: string;
      isSystem: boolean;
      createdBy?: string;
      createdAt: Date;
      updatedAt: Date;
      designationsCount: number;
    }[];
    total: number;
    totalPages: number;
  }> {
    const { pageNo, pageSize, searchKey } = query;

    // Departments with associated designations count
    const [departments, total] = await Promise.all([
      this.departmentModel.aggregate([
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
            from: "designations",
            localField: "_id",
            foreignField: "departmentId",
            as: "designations",
          },
        },
        {
          $addFields: {
            designationsCount: { $size: "$designations" },
          },
        },
        {
          $project: {
            name: 1,
            description: 1,
            isSystem: 1,
            createdBy: 1,
            createdAt: 1,
            updatedAt: 1,
            designationsCount: 1,
          },
        },
        { $skip: (pageNo - 1) * pageSize },
        { $limit: pageSize },
      ]),
      this.departmentModel.countDocuments({
        $or: [
          { name: { $regex: searchKey, $options: "i" } },
          { description: { $regex: searchKey, $options: "i" } },
        ],
      }),
    ]);

    return {
      departments,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Retrieve a single department by its unique identifier, including the count of associated designations.
   *
   * @param {MongoIdDto["id"]} id - The unique identifier of the department to be retrieved.
   * @returns {Promise<{ _id: string; name: string; description?: string; isSystem: boolean; createdBy?: string; createdAt: Date; updatedAt: Date; designationsCount: number } | null>} An object containing the department details along with the count of associated designations, or null if the department is not found.
   */
  async findDepartmentById(id: MongoIdDto["id"]): Promise<{
    _id: string;
    name: string;
    description?: string;
    isSystem: boolean;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
    designationsCount: number;
  } | null> {
    const result = await this.departmentModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: "designations",
          localField: "_id",
          foreignField: "departmentId",
          as: "designations",
        },
      },
      {
        $addFields: {
          designationsCount: { $size: "$designations" },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          isSystem: 1,
          createdBy: 1,
          createdAt: 1,
          updatedAt: 1,
          designationsCount: 1,
        },
      },
    ]);

    return result[0] || null;
  }

  /**
   * Update an existing department by its unique identifier after checking for duplicate department names.
   *
   * @param {MongoIdDto["id"]} id - The unique identifier of the department to be updated.
   * @param {UpdateDepartmentDto} updateDepartmentDto - The data transfer object containing the details of the department to be updated, including the fields to be updated.
   * @returns {Promise<Department | null>} The updated department document or an error message if the department is not found or if a department with the same name already exists.
   */
  async updateDepartmentById(
    id: MongoIdDto["id"],
    updateDepartmentDto: UpdateDepartmentDto,
  ) {
    const existingDepartment = await this.departmentModel.findById(id);

    if (!existingDepartment) {
      return {
        message: "Department not found",
        exception: "NotFoundException",
      };
    }

    if (existingDepartment.isSystem) {
      return {
        message: "System department cannot be updated",
        exception: "Forbidden",
      };
    }

    // If the department is already exist with the same name, we should not allow update
    if (updateDepartmentDto.name) {
      const duplicateDepartment = await this.departmentModel.findOne({
        _id: { $ne: id },
        name: updateDepartmentDto.name.toUpperCase(),
      });

      if (duplicateDepartment) {
        return {
          message: "Department with the same name already exists",
          exception: "Conflict",
        };
      }
    }

    existingDepartment.name = updateDepartmentDto.name
      ? updateDepartmentDto.name.toUpperCase()
      : existingDepartment.name;
    existingDepartment.description = updateDepartmentDto.description
      ? updateDepartmentDto.description
      : existingDepartment.description;

    return await existingDepartment.save();
  }

  /**
   * Delete a department its ID, ensuring that system departments, departments with associated designations, or departments associated with users cannot be deleted.
   *
   * @param {MongoIdDto["id"]} id - The unique identifier of the department to be deleted.
   * @return {Promise<{ message: string; exception: string } | DepartmentDocument | null>} An object containing an error message and exception type if the department cannot be deleted due to being a system department, having associated designations, or being associated with users; otherwise, the deleted department document or null if the department is not found.
   * @remarks This method first checks if the department exists. If it does not, it returns a not found message. If the department is a system department, it returns a forbidden message. Then it checks if there are any designations associated with the department;
   *
   */
  async deleteDepartmentById(id: MongoIdDto["id"]) {
    // If the department is system, we should not allow delete
    const existingDepartment = await this.departmentModel.findById(id);

    if (!existingDepartment) {
      return {
        message: "Department not found",
        exception: "NotFoundException",
      };
    }

    if (existingDepartment.isSystem) {
      return {
        message: "System department cannot be deleted",
        exception: "Forbidden",
      };
    }

    // If the department has associated designations, we should not allow delete
    const associatedDesignations = await this.designationModel.find({
      departmentId: new Types.ObjectId(id),
    });

    if (associatedDesignations.length > 0) {
      return {
        message: "Department has associated designations and cannot be deleted",
        exception: "Forbidden",
      };
    }

    // If the department is associated with any user, we should not allow delete
    const associatedUsers = await this.userModel.find({
      departmentId: new Types.ObjectId(id),
    });

    if (associatedUsers.length > 0) {
      return {
        message: "Department has associated users and cannot be deleted",
        exception: "Forbidden",
      };
    }

    return this.departmentModel.findByIdAndDelete(id);
  }
}
