import { IsMongoId } from 'class-validator';

export class UserParamDto {
  @IsMongoId({ message: 'ID must be a valid Mongo ID' })
  id!: string;
}
