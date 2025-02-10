import { User } from "./user.model";

export interface Seller {
  id?: number; // ID del registro en la tabla `seller`
  user: User;  // Relación con la entidad `User`
  address: string;
  reference?: string;
  city: string;
  department: string;
  nationality: string;
  gender: string;
  birth_date: string; // Fecha en formato ISO 8601
  identity_document: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}
