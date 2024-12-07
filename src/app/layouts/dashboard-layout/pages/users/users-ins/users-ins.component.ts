import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { DatepickerComponent } from "../components/datepicker/datepicker.component";

@Component({
  selector: 'app-users-ins',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DatepickerComponent],
  templateUrl: './users-ins.component.html',
  styleUrl: './users-ins.component.css'
})
export class UsersInsComponent implements OnInit {
  // Control del paso actual
  currentStep = 1;

  // Valor seleccionado del rol
  selectedRole: string = '';
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    initFlowbite();
  }
  ngOnInit(): void {
    this.userForm = this.fb.group({
      step1: this.fb.group({
        firstname: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        role: ['', [Validators.required]],
        password: ['', [Validators.required]],
        repeatPassword: ['', [Validators.required]],
      }),
      step2: this.fb.group({
        address: ['', []], // Inicialmente sin validadores
        reference: ['', []],
        city: ['', []],
        department: ['', []],
        nationality: ['', []],
        identityDocument: ['', []],
        gender: ['', []],
        birthDate: ['', []],
        phoneNumber: ['', []],
        loyaltyPoints: ['', []],
      }),
    });

    this.userForm.get('step1.role')?.valueChanges.subscribe(role => { 
      this.selectedRole = role; 
      this.updateDynamicFields(role); 
    });
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (this.userForm.get('step1')?.valid) {
        console.log('Paso 1 es válido', this.userForm.get('step1')?.value);
        this.currentStep++;
      } else {
        console.log('Paso 1 no es válido');
      }
    } else if (this.currentStep === 2) {
      if (this.userForm.get('step2')?.valid) {
        console.log('Paso 2 es válido', this.userForm.get('step2')?.value);
        // Aquí puedes agregar el código para enviar el formulario
      } else {
        console.log('Paso 2 no es válido');
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Formulario completo:', this.userForm.value);
    } else {
      console.log('Formulario no válido');
    }
  }

  isStepValid() { return this.userForm.get('step1')?.valid; }

  hasErrors(step: string, controlName: string): boolean {
    const control = this.userForm.get(step)?.get(controlName);
    return control != null && control.errors != null && (control.dirty || control.touched);
  }

  updateDynamicFields(role: string) {
    const step2 = this.userForm.get('step2') as FormGroup;

    // Reiniciamos el grupo para evitar validaciones innecesarias
    Object.keys(step2.controls).forEach((field) => {
      const control = step2.get(field);
      control?.clearValidators();
      control?.updateValueAndValidity();
    });
  

    if (role === 'admin') {
      step2.get('address')?.setValidators([Validators.required]);
      step2.get('city')?.setValidators([Validators.required]);
      step2.get('department')?.setValidators([Validators.required]);
      step2.get('gender')?.setValidators([Validators.required]);
      step2.get('birthDate')?.setValidators([Validators.required]);
      step2.get('identityDocument')?.setValidators([Validators.required]);
    } else if (role === 'seller') {
      step2.get('address')?.setValidators([Validators.required]);
      step2.get('reference')?.setValidators([Validators.required]);
      step2.get('city')?.setValidators([Validators.required]);
      step2.get('department')?.setValidators([Validators.required]);
      step2.get('nationality')?.setValidators([Validators.required]);
      step2.get('gender')?.setValidators([Validators.required]);
      step2.get('birthDate')?.setValidators([Validators.required]);
      step2.get('identityDocument')?.setValidators([Validators.required]);
    } else if (role === 'customer') {
      step2.get('gender')?.setValidators([Validators.required]);
      step2.get('birthDate')?.setValidators([Validators.required]);
      step2.get('phoneNumber')?.setValidators([Validators.required]);
      step2.get('loyaltyPoints')?.setValidators([Validators.required]);
    }

    // Actualiza las validaciones de todos los controles
    Object.keys(step2.controls).forEach((field) => {
      const control = step2.get(field);
      control?.updateValueAndValidity();
    });

    this.logDynamicValidators();
  }

  logDynamicValidators() {
    const step2Controls = (this.userForm.get('step2') as FormGroup)?.controls || {};
    console.log(`Validadores actuales para el rol: ${this.selectedRole}`);

    Object.keys(step2Controls).forEach((key) => {
      const control = step2Controls[key];
      if (control.validator) {
        const validators = control.validator({} as AbstractControl);
        console.log(`Campo "${key}":`, validators ? Object.keys(validators) : 'Sin validadores');
      } else {
        console.log(`Campo "${key}": Sin validadores`);
      }
    });
  }
}
