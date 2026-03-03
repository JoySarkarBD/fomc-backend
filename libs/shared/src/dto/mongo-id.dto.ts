/**
 * @fileoverview DTO for validating a single MongoDB ObjectId parameter.
 *
 * Use with `@Param()` on any endpoint that accepts an `:id` route param
 * to ensure it is a valid 24-character hex ObjectId.
 */

import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty } from "class-validator";

export class MongoIdDto {
  /** A valid 24-character MongoDB ObjectId. */
  @IsMongoId({ message: "ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "ID is required" })
  id!: string;
}

export class MongoIdsDto {
  @IsArray({ message: "ids must be an array" })
  @ArrayNotEmpty({ message: "IDs array cannot be empty" })
  @IsMongoId({
    each: true,
    message: "Each ID must be a valid MongoDB ObjectId",
  })
  ids!: string[];
}

export class UserIdDto {
  /** A valid 24-character MongoDB ObjectId representing a user ID. */
  @IsMongoId({ message: "User ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "User ID is required" })
  userId!: string;
}

export class AssignedByDto {
  /** A valid 24-character MongoDB ObjectId representing the ID of the user who assigned a shift. */
  @IsMongoId({ message: "AssignedBy ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "AssignedBy ID is required" })
  assignedBy!: string;
}

export class ApprovedByDto {
  /** A valid 24-character MongoDB ObjectId representing the ID of the user who approved a shift exchange request. */
  @IsMongoId({ message: "ApprovedBy ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "ApprovedBy ID is required" })
  approvedBy!: string;
}

export class RejectedByDto {
  /** A valid 24-character MongoDB ObjectId representing the ID of the user who rejected a shift exchange request. */
  @IsMongoId({ message: "RejectedBy ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "RejectedBy ID is required" })
  rejectedBy!: string;
}

export class ExchangeIdDto {
  /** A valid 24-character MongoDB ObjectId representing the ID of a shift exchange request. */
  @IsMongoId({ message: "Exchange ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "Exchange ID is required" })
  exchangeId!: string;
}

export class SalesDeptIdDto {
  /** A valid 24-character MongoDB ObjectId representing the ID of the Sales department. */
  @IsMongoId({
    message: "Sales Department ID must be a valid MongoDB ObjectId",
  })
  @IsNotEmpty({ message: "Sales Department ID is required" })
  salesDeptId!: string;
}
