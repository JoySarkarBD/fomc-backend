import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { CreateUserInput } from './create-user.input';

/**
 * Input type for updating an existing user.
 * Extends CreateUserInput with an additional id field.
 * @class UpdateUserInput
 * @property {string} id - Unique identifier for the user to be updated.
 */
@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID, {
    description: 'Unique identifier for the user to be updated',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsMongoId({ message: 'User ID must be a valid Mongo ID' })
  id!: string;
}
