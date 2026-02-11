import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Department, UserRole } from '../../../../user/src/schemas/user.schema';

export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsString({ message: 'Employee ID must be a string' })
  @IsOptional()
  employeeId?: string;

  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsEmail({}, { message: 'Secondary email must be a valid email address' })
  @IsOptional()
  secondaryEmail?: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsEnum(UserRole, { message: 'Role must be a valid UserRole' })
  @IsOptional()
  role?: UserRole;

  @IsEnum(Department, { message: 'Department must be a valid Department' })
  @IsOptional()
  department?: Department;
}
