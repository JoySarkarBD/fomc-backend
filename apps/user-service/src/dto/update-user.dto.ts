import { Department, UserRole } from '../model/user.schema';

export class UpdateUserDto {
  name?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  employeeId?: string;
  secondaryEmail?: string;
  role?: UserRole;
  department?: Department;
}

export class UpdateUserPayload {
  id!: string;
  update!: UpdateUserDto;
}
