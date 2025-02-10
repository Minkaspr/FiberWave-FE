import { User } from "./user.model";

export interface Customer {
  id?: number; // ID del registro en la tabla `customer`
  user: User;  // Relación con la entidad `User`
  gender: string;
  birth_date: string; // Fecha en formato ISO 8601
  phone_number: string;
  loyalty_points?: number; // Puntos de lealtad, valor por defecto 0
  created_at?: string | Date;
  updated_at?: string | Date;
}
