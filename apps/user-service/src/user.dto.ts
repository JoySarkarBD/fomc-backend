import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Department, UserRole } from './user.model';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEmail()
  secondaryEmail?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(Department)
  department?: Department;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  secondaryEmail?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(Department)
  department?: Department;
}
