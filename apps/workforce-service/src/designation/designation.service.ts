/**
 * @fileoverview Designation Service
 *
 * Business logic for designation CRUD operations in the Workforce microservice.
 * Provides methods to create, retrieve (paginated), find by ID, update, and
 * delete designations with safety checks for system designations and associations.
 */
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { USER_COMMANDS } from "@shared/constants";
import { MongoIdDto, SearchQueryDto } from "@shared/dto";
import { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { Department } from "../schemas/department.schema";
import {
  Designation,
  DesignationDocument,
} from "../schemas/designation.schema";
import { CreateDesignationDto } from "./dto/create-designation.dto";
import { UpdateDesignationDto } from "./dto/update-designation.dto";

@Injectable()
export class DesignationService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
    @InjectModel(Designation.name)
    private readonly designationModel: Model<DesignationDocument>,
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
  ) {}

  /**
   * Create a new designation in the database after checking for duplicate designation names.
   *
   * @param {CreateDesignationDto} createDesignationDto - The data transfer object containing the details of the designation to be created.
   * @returns {Promise<any>} The newly created designation or an error message if a duplicate exists.
   * @remarks This method checks if a designation with the same name (case-insensitive) already exists within the same department before creating a new designation. If a duplicate is found, it returns a conflict message instead of creating a new entry in the database. This helps maintain data integrity and prevents duplicate designations within the same department.
   */
  async createDesignation(createDesignationDto: CreateDesignationDto) {
    // Check if a designation with the same name already exists (case-insensitive), for the same department
    const existingDesignation = await this.designationModel.findOne({
      name: createDesignationDto.name.toUpperCase(),
      departmentId: new Types.ObjectId(createDesignationDto.departmentId),
    });

    if (existingDesignation) {
      return {
        message:
          "Designation with the same name already exists in this department",
        exception: "Conflict",
      };
    }

    return await this.designationModel.create({
      ...createDesignationDto,
      departmentId: new Types.ObjectId(createDesignationDto.departmentId),
    });
  }

  /**
   * Retrieve a paginated list of designations based on the provided search query parameters.
   *
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @return {Promise<{ designations: { _id: string; name: string; description: string; departmentId: string; departmentName: string; createdBy: string; createdAt: Date; updatedAt: Date }[]; total: number; totalPages: number }>} An object containing the list of designations, total count, and total pages based on the search criteria.
   */
  async findDesignations(query: SearchQueryDto): Promise<{
    designations: {
      _id: string;
      name: string;
      description: string;
      departmentId: string;
      departmentName: string;
      createdBy: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
    total: number;
    totalPages: number;
  }> {
    const { pageNo, pageSize } = query;
    const searchKey =
      typeof query.searchKey === "string" ? query.searchKey : "";

    const matchStage: any = {};

    // If a search key is provided, add a case-insensitive regex match for the name and description fields
    if (searchKey) {
      matchStage.$or = [
        { name: { $regex: searchKey, $options: "i" } },
        { description: { $regex: searchKey, $options: "i" } },
      ];
    }

    // Perform aggregation to fetch designations along with their associated department names, and apply pagination
    const [designations, total] = await Promise.all([
      this.designationModel.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "departments",
            localField: "departmentId",
            foreignField: "_id",
            as: "department",
          },
        },
        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            departmentId: 1,
            departmentName: "$department.name",
            createdBy: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        { $skip: (pageNo - 1) * pageSize },
        { $limit: pageSize },
      ]),
      this.designationModel.countDocuments(matchStage),
    ]);

    return {
      designations,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Retrieve a single designation by its unique identifier, including the count of associated designations.
   *
   * @param {MongoIdDto["id"]} id - The unique identifier of the designation to be retrieved.
   * @returns {Promise<{ _id: string; name: string; description?: string; departmentId: string; departmentName: string; createdBy?: string; createdAt: Date; updatedAt: Date } | null>} An object containing the designation details along with the count of associated designations, or null if the designation is not found.
   */
  async findDesignationById(id: MongoIdDto["id"]): Promise<{
    _id: string;
    name: string;
    description?: string;
    departmentId: string;
    departmentName: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    const result = await this.designationModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: "departments",
          localField: "departmentId",
          foreignField: "_id",
          as: "department",
        },
      },
      { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1,
          description: 1,
          departmentId: 1,
          departmentName: "$department.name",
          createdBy: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return result[0] || null;
  }

  /**
   * Update an existing designation by its unique identifier after checking for duplicate designation names and validating the associated department.
   *
   * @param {MongoIdDto["id"]} id - The unique identifier of the designation to be updated.
   * @param {UpdateDesignationDto} updateDesignationDto - The data transfer object containing the updated details of the designation.
   * @returns {Promise<Designation | null>} The updated designation or an error message if the designation is not found, if a duplicate name exists, or if the associated department is not found.
   */
  async updateDesignationById(
    id: MongoIdDto["id"],
    updateDesignationDto: UpdateDesignationDto,
  ) {
    const existingDesignation = await this.designationModel.findById(id);

    if (!existingDesignation) {
      return {
        message: "Designation not found",
        exception: "NotFoundException",
      };
    }

    // If the designation is already exist with the same name, we should not allow update
    if (updateDesignationDto.name) {
      const duplicateDesignation = await this.designationModel.findOne({
        _id: { $ne: id },
        name: updateDesignationDto.name.toUpperCase(),
        departmentId: new Types.ObjectId(existingDesignation.departmentId),
      });

      if (duplicateDesignation) {
        return {
          message:
            "Designation with the same name already exists in this department",
          exception: "Conflict",
        };
      }
    }

    existingDesignation.name = updateDesignationDto.name
      ? updateDesignationDto.name.toUpperCase()
      : existingDesignation.name;

    existingDesignation.description =
      updateDesignationDto.description ?? existingDesignation.description;

    // Check if the department with this id exists or not, if not then we should not allow update
    const department = await this.departmentModel.findById(
      updateDesignationDto.departmentId,
    );

    if (!department) {
      return {
        message: "Department not found",
        exception: "NotFoundException",
      };
    }

    if (updateDesignationDto.departmentId) {
      existingDesignation.departmentId = new Types.ObjectId(
        updateDesignationDto.departmentId,
      );
    }

    return existingDesignation.save();
  }

  /**
   * Retrieve multiple designations by their unique identifiers.
   *
   * @param {MongoIdDto["id"][]} ids - An array of unique identifiers of the designations to be retrieved.
   * @returns {Promise<{ _id: string; name: string; description: string; departmentId: string; departmentName: string; createdBy: string; createdAt: Date; updatedAt: Date }[]>} An array of objects containing the details of the designations along with their associated department names.
   * @remarks This method performs an aggregation query to fetch multiple designations based on the provided array of IDs. It also joins the department collection to include the department name in the result. The method returns an array of designations with their details and associated department names.
   */
  async findDesignationsByIds(ids: MongoIdDto["id"][]) {
    const result = await this.designationModel
      .find({ _id: { $in: ids.map((id) => new Types.ObjectId(id)) } })
      .populate("departmentId", "name")
      .lean();

    return result;
  }

  /**
   * Delete a designation by its unique identifier after checking for its existence and ensuring that no users are associated with it.
   *
   * @param {MongoIdDto["id"]} id - The unique identifier of the designation to be deleted.
   * @returns {Promise<Designation | { message: string; exception: string }>} The deleted designation or an error message if the designation is not found or if there are associated users that prevent deletion.
   * @remarks This method first checks if the designation with the given ID exists. If it does not exist, it returns a "Designation not found" message. If the designation exists, it then checks if there are any users associated with this designation by sending a message to the User Service. If there are associated users, it returns a message indicating that the designation cannot be deleted due to existing associations. If there are no associated users, it proceeds to delete the designation from the database.
   */
  async deleteDesignationById(id: MongoIdDto["id"]) {
    // Check if the designation exists before attempting to delete
    const existingDesignation = await this.designationModel.findById(id);

    if (!existingDesignation) {
      return {
        message: "Designation not found",
        exception: "NotFoundException",
      };
    }

    // Prevent deletion if users are assigned to this designation
    const associatedUsers = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_COUNT_BY_DESIGNATION, id),
    );

    if (associatedUsers > 0) {
      return {
        message: "Designation has associated users and cannot be deleted",
        exception: "Forbidden",
      };
    }

    return this.designationModel.findByIdAndDelete(id);
  }
}
