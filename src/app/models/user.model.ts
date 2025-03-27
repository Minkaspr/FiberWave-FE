import { Admin } from "./admin.model";
import { Customer } from "./customer.model";
import { Seller } from "./seller.model";

export interface User {
  id?: number; 
  email: string; 
  password: string; 
  firstname: string; 
  lastname: string; 
  role: string; 
  is_active: boolean; 
  created_at?: string | Date; 
  updated_at?: string | Date;
}

export interface UserWithRole {
  userData: User;
  roleData?: Admin | Customer | Seller;
}

export interface UserResponse {
  user: UserWithRole;
}

export interface UsersResponse {
  users: User[];
  totalItems: number;
  totalPages: number;
}