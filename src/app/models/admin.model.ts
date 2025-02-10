import { User } from "./user.model";

export interface Admin {
  id?: number;
  user: User; // Relación con la entidad `User`
  address: string;
  city: string;
  department: string;
  gender: string;
  birth_date: string; // Fecha en formato ISO 8601
  identity_document: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}