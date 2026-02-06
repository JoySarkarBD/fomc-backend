import { IsMongoId } from 'class-validator';

/**
 * DTO for validating a single MongoDB ID.
 * Ensures that the provided ID is a valid MongoDB ObjectId.
 */
export class MongoIdDto {
  @IsMongoId({ message: 'Invalid MongoDB ID' })
  id!: string;
}

/**
 * DTO for validating an array of MongoDB IDs.
 * Ensures that each ID in the array is a valid MongoDB ObjectId.
 */
export class MongoIdsDto {
  @IsMongoId({ each: true, message: 'Invalid MongoDB ID in array' })
  ids!: string[];
}
