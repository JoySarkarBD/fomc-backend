import {
  Department,
  UserRole,
} from "../../../../user-service/src/schemas/user.schema";

export interface AuthUser {
  id?: string;
  _id?: string;
  name?: string;
  employeeId?: string;
  phoneNumber?: string;
  email?: string;
  secondaryEmail?: string;
  role?: UserRole;
  department?: Department;
}
