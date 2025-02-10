import { Role } from "./role.model";

export interface User {
  id?: number; 
  email: string; 
  password: string; 
  firstname: string; 
  lastname: string; 
  role: string | Role; 
  is_active: boolean; 
  created_at?: string | Date; 
  updated_at?: string | Date;
}