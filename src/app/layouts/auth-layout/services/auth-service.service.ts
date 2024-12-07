import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '../../../services/api-config.service';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { ApiResponse } from '../../../models/response.model';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiConfigService = inject(ApiConfigService);
  
  // Método para registrar un usuario 
  register(userData: User): Observable<ApiResponse<User>> { 
    return this.apiConfigService.post<ApiResponse<User>>('auth/register', userData); 
  } 
  
  // Método para iniciar sesión 
  login(credentials: any): Observable<ApiResponse<any>> { 
    return this.apiConfigService.post<any>('auth/login', credentials); 
  }

  // Método para cerrar sesión 
  logout(refreshToken: any): Observable<any> { 
    return this.apiConfigService.post<any>('auth/logout', { refreshToken }); 
  } 
  // Método para refrescar el token 
  refreshToken(refreshToken: any): Observable<any> { 
    return this.apiConfigService.post<any>('auth/refresh-token', { refreshToken }); 
  }
}
