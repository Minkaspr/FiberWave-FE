import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterValidators } from './register-validators';
import { initFlowbite, Tooltip } from 'flowbite';
import { AuthService } from '../services/auth-service.service';
import { User } from '../../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse, ApiError } from '../../../models/response.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  showTooltip: boolean = false;
  tooltipInstance!: Tooltip;

  emailMsg: string = "Correo válido.";

  constructor(
    private FormBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.createValidatorRegisterForm();
  }

  ngOnInit(): void {
    initFlowbite();
    this.initializeTooltip();
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  createValidatorRegisterForm(): FormGroup {
    return this.FormBuilder.group({
      firstname: ['', [Validators.required, RegisterValidators.firstnameValidator()]],
      lastname: ['', [Validators.required, RegisterValidators.lastnameValidator()]],
      email: ['', [Validators.required, RegisterValidators.emailValidator()]],
      password: ['', [Validators.required, RegisterValidators.passwordValidator()]],
      confirmPassword: ['', [Validators.required, RegisterValidators.confirmPasswordValidator('password')]],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  hasErrors(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return control !== null && control.errors !== null && (control.dirty || control.touched);
  }

  hasSuccess(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return control !== null && control.valid && (control.dirty || control.touched);
  }

  initializeTooltip(): void {
    const triggerEl = document.getElementById('terms');
    const tooltipEl = document.getElementById('terms-tooltip-bottom');
    this.tooltipInstance = new Tooltip(tooltipEl, triggerEl, {
      placement: 'bottom',
      triggerType: 'none'
    });
  }

  toggleTooltip(show: boolean): void {
    if (show) {
      this.tooltipInstance.show();
    } else {
      this.tooltipInstance.hide();
    }
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      const user: User = this.registerForm.value;
      this.authService.register(user)
        .subscribe({
          next: (response: ApiResponse<User>) => {
            console.log(response);
            if (response.status === 'success') {
              this.router.navigate(['/auth/login']);
            }
          },
          error: (error: HttpErrorResponse) => {
            const apiResponse: ApiResponse<ApiError[]> = error.error;
            if (apiResponse && apiResponse.status === 'error' && apiResponse.errors) {
              apiResponse.errors.forEach(err => {
                if (err.field === 'email') {
                  this.registerForm.get('email')?.setErrors({ serverError: err.message });
                }
              });
            }
            console.error('Error en la solicitud de registro:', JSON.stringify(error, null, 2));
          },
          complete: () => { 
            console.log('Registration completed'); 
          }
        });
      console.log('Formulario válido', this.registerForm.value);
    } else {
      this.showTooltip = this.registerForm.controls['terms'].invalid;
      this.toggleTooltip(this.showTooltip);
    }
  }
}
