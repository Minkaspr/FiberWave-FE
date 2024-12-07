import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiError, ApiResponse } from '../../../models/response.model';
import { UserDTO } from '../../../models/user-dto.model';
import { UserSessionService } from '../../../services/user-session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private FormBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private userSessionService: UserSessionService
  ) {
    this.loginForm = this.createValidatorLoginForm();
  }

  private createValidatorLoginForm(): FormGroup {
    return this.FormBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false]
    })
  }

  hasErrors(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control !== null && control.errors !== null && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      this.errorMessage = 'Complete todos los campos.';
      return;
    }

    const { email, password, remember } = this.loginForm.value;
    /* if (email === 'test@domain.com' && password === '123456') {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos.';
    } */
    this.authService.login({ email, password }).subscribe({
      next: (response: ApiResponse<any>) => {
        console.log(response);
        if (response.status === 'success' && response.token && response.refreshToken) {
          this.userSessionService.setRememberMe(remember);
          this.userSessionService.setToken(response.token);
          this.userSessionService.setRefreshToken(response.refreshToken);
          this.userSessionService.setUserData(response.data.user);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message;
          if (response.errors) {
            response.errors.forEach(err => {
              console.error(`Error en el campo ${err.field}: ${err.message}`);
            });
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        const apiResponse: ApiResponse<ApiError[]> = error.error;
        if (apiResponse && apiResponse.status === 'error' && apiResponse.errors) {
          let specificError = apiResponse.errors.find(err => err.field === 'credential-error');
          if (specificError) {
            this.errorMessage = specificError.message;
          } else {
            this.errorMessage = 'Hubo un problema al iniciar sesión. Inténtalo de nuevo.';
          }
        } else if (error.status >= 500) {
          this.errorMessage = 'Error del servidor. Inténtalo más tarde.';
        } else {
          this.errorMessage = 'Hubo un problema al iniciar sesión. Inténtalo de nuevo.';
        }
      },
      complete: () => {
        console.log('Inicio de sesión completado');
      }
    });
  }
}
