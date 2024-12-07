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