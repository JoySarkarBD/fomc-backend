import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRole {
  DIRECTOR = 'DIRECTOR',
  HR = 'HR',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  EMPLOYEE = 'EMPLOYEE',
}

export enum Department {
  SHOPIFY = 'SHOPIFY',
  WORDPRESS = 'WORDPRESS',
  CUSTOM = 'CUSTOM',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsEmail()
  email!: string;

  @IsEmail()
  @IsOptional()
  secondaryEmail?: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsEnum(Department)
  @IsOptional()
  department?: Department;
}
