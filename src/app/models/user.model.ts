export interface User {
  id?: number; 
  email: string; 
  password: string; 
  firstname: string; 
  lastname: string; 
  role: string; 
  is_active: boolean; 
  created_at: string | Date; 
  updated_at: string | Date;
}