import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private FormBuilder: FormBuilder, private router: Router){
    this.loginForm = this.createValidatorLoginForm();
  }

  private createValidatorLoginForm(): FormGroup {
    return this.FormBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
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

    // Simulación de verificación de credenciales
    const { email, password } = this.loginForm.value;
    if (email === 'test@domain.com' && password === '123456') {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos.';
    }
  }
}
