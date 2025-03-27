import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../../models/response.model';
import { User, UserResponse, UsersResponse, UserWithRole } from '../../../../../models/user.model';
import { FiltersResponse } from '../../../../../models/user-filter.model';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiConfigService = inject(ApiConfigService);

  // Obtener todos los usuarios
  fetchUsers(queryParams: string): Observable<ApiResponse<UsersResponse>> {
    return this.apiConfigService.get<ApiResponse<UsersResponse>>(`user/fetchUsers?${queryParams}`);
  }

  // Obtener todos los filtros
  getFilters(): Observable<ApiResponse<FiltersResponse>> {
    return this.apiConfigService.get<ApiResponse<FiltersResponse>>('user/filters');
  }

  // Obtener usuario por ID
  getUserById(id: number): Observable<ApiResponse<UserResponse>> {
    return this.apiConfigService.get<ApiResponse<UserResponse>>(`user/getById/${id}`);
  }

  // Crear un nuevo usuario
  createUserWithRole(userWithRole : UserWithRole): Observable<ApiResponse<any>> {
    return this.apiConfigService.post<ApiResponse<any>>('user/create', userWithRole);
  }

  // Actualizar el estado de un usuario
  updateUserStatus(id: number, status: boolean): Observable<ApiResponse<any>> {
    return this.apiConfigService.put<ApiResponse<any>>(`user/${id}/status`, { "is_active": status });
  }

  // Actualizar un usuario
  updateUser(id: number, userData: UserWithRole): Observable<ApiResponse<any>> {
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
