import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../../models/response.model';
import { User } from '../../../../../models/user.model';
import { FiltersResponse } from '../../../../../models/user-filter.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiConfigService = inject(ApiConfigService);

  // Obtener todos los usuarios
  fetchUsers(
    currentPage: number = 1,
    pageSize: number = 10,
    roles: string[] = [],
    isActive: boolean | null = null,
    searchTerm: string | null = null,
    sortBy: string = 'created_at',
    sortOrder: string = 'desc'
  ): Observable<ApiResponse<{
    users: User[],
    totalItems: number,
    totalPages: number
  }>> {
    let queryParams = `currentPage=${currentPage}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    
    // Filtros opcionales
    if (roles.length > 0) {
      queryParams += `&roles=${roles.join(',')}`;
    }
    if (isActive !== null) {
      queryParams += `&isActive=${isActive}`;
    }
    if (searchTerm) {
      queryParams += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }

    return this.apiConfigService.get<ApiResponse<{
      users: User[],
      totalItems: number,
      totalPages: number
    }>>(`user/fetchUsers?${queryParams}`);
  }

  // Obtener todos los filtros
  getFilters(): Observable<ApiResponse<FiltersResponse>> {
    return this.apiConfigService.get<ApiResponse<FiltersResponse>>('user/filters');
  }

  // Obtener usuario por ID
  getUserById(id: number): Observable<ApiResponse<{ user: User }>> {
    return this.apiConfigService.get<ApiResponse<{ user: User }>>(`user/getById/${id}`);
  }

  // Crear un nuevo usuario
  createUser(userData: User): Observable<ApiResponse<{ user: User }>> {
    return this.apiConfigService.post<ApiResponse<{ user: User }>>('user/create', userData);
  }

  // Actualizar un usuario
  updateUser(id: number, userData: User): Observable<ApiResponse<any>> {
    return this.apiConfigService.put<ApiResponse<any>>(`user/update/${id}`, userData);
  }

  // Actualizar contraseña
  updatePassword(id: number, oldPassword: string, newPassword: string): Observable<ApiResponse<any>> {
    return this.apiConfigService.put<ApiResponse<any>>(`user/update-password/${id}`, { oldPassword, newPassword });
  }

  // Actualizar perfil de usuario
  updateProfile(id: number, profileData: any): Observable<ApiResponse<any>> {
    return this.apiConfigService.put<ApiResponse<any>>(`user/update-profile/${id}`, profileData);
  }

  // Eliminar usuario
  deleteUser(id: number): Observable<ApiResponse<any>> {
    return this.apiConfigService.delete<ApiResponse<any>>(`user/delete/${id}`);
  }
}
