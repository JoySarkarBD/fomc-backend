/**
 * AuthUser interface defines the structure of the authenticated user object that is attached to the request by the authentication guards (e.g., JwtAuthGuard) in the API Gateway.
 * This interface includes properties such as id, name, email, role, department, and designation, which represent the essential information about the authenticated user that may be needed for authorization and business logic within the controllers and services of the API Gateway.
 * The AuthUser interface serves as a contract for the shape of the user object, ensuring that any code that interacts with the authenticated user can rely on a consistent structure and type safety when accessing user properties.
 * By defining this interface, developers can easily access and utilize the authenticated user's information in a type-safe manner throughout the API Gateway, improving code readability and maintainability while also facilitating better integration with TypeScript's type system.
 */
export interface AuthUser {
  id?: string;
  _id?: string;
  name?: string;
  employeeId?: string;
  phoneNumber?: string;
  email?: string;
  secondaryEmail?: string;
  role?: string;
  department?: string;
  designation?: string;
}
