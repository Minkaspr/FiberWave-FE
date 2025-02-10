export interface ErrorMessages {
  [fieldName: string]: string;
}

export interface ApiError {
  field?: string; 
  message: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string; 
  data?: T;
  errors?: ApiError[];
  token?: string;
  refreshToken?: string;
}

export interface ProcessStatus<T = null> {
  status: 'idle' | 'loading' | 'success' | 'error'; // Estados posibles
  message: string; // Mensaje general opcional
  statusCode?: number; // Código HTTP opcional
  data?: T; // Datos en caso de éxito (opcional)
  errors?: ApiError[]; // Errores en caso de fallo
}
