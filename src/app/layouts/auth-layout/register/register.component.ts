import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterValidators } from './register-validators';
import { initFlowbite, Tooltip } from 'flowbite';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  errorMessage: string | null = null;
  showTooltip: boolean = false;
  tooltipInstance!: Tooltip;

  constructor(private FormBuilder: FormBuilder, private router: Router){
    this.registerForm = this.createValidatorRegisterForm();
  }

  ngOnInit(): void {
    initFlowbite();
    this.initializeTooltip();
  }

  createValidatorRegisterForm(): FormGroup {
    return this.FormBuilder.group({
      surname: ['', [Validators.required, RegisterValidators.surnameValidator()]],
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
      console.log('Formulario válido', this.registerForm.value);
      this.router.navigate(['/login']);
    } else {
      this.showTooltip = this.registerForm.controls['terms'].invalid; 
      this.toggleTooltip(this.showTooltip);
    }
  }
}
