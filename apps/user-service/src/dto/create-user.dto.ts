import { Department, UserRole } from '../model/user.schema';

export class CreateUserDto {
  name!: string;
  phoneNumber!: string;
  email!: string;
  password!: string;
  employeeId?: string;
  secondaryEmail?: string;
  role?: UserRole;
  department?: Department;
}
