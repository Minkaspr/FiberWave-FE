import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../../../models/user-dto.model';
import { UserSessionService } from '../../../../services/user-session.service';
import { AuthService } from '../../../auth-layout/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent implements OnInit{
  user: UserDTO | null = null;
  constructor(
    private userSessionService: UserSessionService,
    private authService: AuthService, 
    private router: Router  
  ) {}

  ngOnInit(): void {
    const userData = this.userSessionService.getUserData();
    if (userData) {
      this.user = userData; 
    }
  }

  onLogout(): void {
    const refreshToken = this.userSessionService.getRefreshToken();  // Recuperamos el refreshToken

    if (refreshToken) {
      // Llamamos al método logout de AuthService y le pasamos el refreshToken
      this.authService.logout(refreshToken).subscribe({
        next: () => {
          // Si el logout es exitoso, limpiamos la sesión y redirigimos al login
          this.userSessionService.clearSession();
          this.router.navigate(['/auth/login']);  // Redirigimos al login
        },
        error: (err) => {
          console.error('Error during logout', err);
          // Podrías mostrar un mensaje de error si es necesario
        }
      });
    } else {
      // Si no hay refreshToken, solo limpiamos la sesión
      this.userSessionService.clearSession();
      this.router.navigate(['/auth/login']);  // Redirigimos al login
    }
  }
}
