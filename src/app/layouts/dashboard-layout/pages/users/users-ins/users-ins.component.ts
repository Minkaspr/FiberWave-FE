import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { initFlowbite, Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import { DatepickerComponent } from "../components/datepicker/datepicker.component";
import { ChangeDetectorRef } from '@angular/core';
import { UserInsValidators } from './user-ins-validators';
import { User, UserWithRole } from '../../../../../models/user.model';
import { UsersDataService } from '../services/users-data.service';
import { UserIconComponent } from '../../../../../icons/user-icon/user-icon.component';
import { CalendarIconComponent } from '../../../../../icons/calendar-icon/calendar-icon.component';
import { BuildingsIconComponent } from '../../../../../icons/buildings-icon/buildings-icon.component';
import { UserCogIconComponent } from '../../../../../icons/user-cog-icon/user-cog-icon.component';
import { LockPasswordIconComponent } from '../../../../../icons/lock-password-icon/lock-password-icon.component';
import { MapPinIconComponent } from '../../../../../icons/map-pin-icon/map-pin-icon.component';
import { EPassportIconComponent } from '../../../../../icons/epassport-icon/epassport-icon.component';
import { GenderIconComponent } from '../../../../../icons/gender-icon/gender-icon.component';
import { MailIconComponent } from '../../../../../icons/mail-icon/mail-icon.component';
import { Map2IconComponent } from '../../../../../icons/map2-icon/map2-icon.component';
import { ApiError } from '../../../../../models/response.model';
import { CoinsIconComponent } from '../../../../../icons/coins-icon/coins-icon.component';
import { GlobeIconComponent } from '../../../../../icons/globe-icon/globe-icon.component';
import { LocationPinIconComponent } from '../../../../../icons/location-pin-icon/location-pin-icon.component';
import { PhoneIconComponent } from '../../../../../icons/phone-icon/phone-icon.component';
import { Admin } from '../../../../../models/admin.model';
import { Customer } from '../../../../../models/customer.model';
import { Seller } from '../../../../../models/seller.model';

@Component({
  selector: 'app-users-ins',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DatepickerComponent],
  providers: [DatePipe],
  templateUrl: './users-ins.component.html',
  styleUrl: './users-ins.component.css'
})
export class UsersInsComponent implements OnInit, AfterViewInit {
  // Formulario y control de pasos
  userInsForm!: FormGroup;
  currentStep = 1;
  completedSteps: boolean[] = [false, false, false];
  selectedRole: string = '';
  todayDate: string;
  fieldErrors: ApiError[] = [];

  @ViewChildren('datepickerInput') datepickerInputs!: QueryList<ElementRef>;

  sectionsWithData: {
    title: string;
    fields: { icon: string; label: string; value: any }[]
  }[] = [];

  roleFieldMap: { [key: string]: string[] } = {
    admin: ['firstname', 'lastname', 'email', 'password', 'role', 'address', 'city', 'department', 'gender', 'birth_date', 'identity_document'],
    seller: ['firstname', 'lastname', 'email', 'password', 'role', 'address', 'reference', 'city', 'department', 'nationality', 'gender', 'birth_date', 'identity_document'],
    customer: ['firstname', 'lastname', 'email', 'password', 'role', 'gender', 'birth_date', 'phone_number', 'loyalty_points'],
  };

  iconComponentMap = {
    'app-user-icon': UserIconComponent,
    'app-calendar-icon': CalendarIconComponent,
    'app-lock-password-icon': LockPasswordIconComponent,
    'app-user-cog-icon': UserCogIconComponent,
    'app-map-pin-icon': MapPinIconComponent,
    'app-location-pin-icon': LocationPinIconComponent,
    'app-mail-icon': MailIconComponent,
    'app-gender-icon': GenderIconComponent,
    'app-buildings-icon': BuildingsIconComponent,
    'app-map2-icon': Map2IconComponent,
    'app-globe-icon': GlobeIconComponent,
    'app-epassport-icon': EPassportIconComponent,
    'app-phone-icon': PhoneIconComponent,
    'app-coins-icon': CoinsIconComponent,
  };

  // Modal
  private productModal!: ModalInterface;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private usersDataService: UsersDataService, private datePipe: DatePipe) {
    const today = new Date();
    this.todayDate = this.datePipe.transform(today, 'dd/MM/yyyy')!;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.handleRoleChanges();
    this.initProductModal();
    this.userInsForm.get('step1.password')?.valueChanges.subscribe(() => {
      this.userInsForm.get('step1.repeatPassword')?.updateValueAndValidity();
    });
    this.setupUserCreateStatusListener();
    this.sectionsWithData = [];

    this.userInsForm.statusChanges.subscribe(() => {
      const step1Valid = this.userInsForm.get('step1')?.valid || false;
      const step2Valid = this.userInsForm.get('step2')?.valid || false;

      if (step1Valid && step2Valid) {
        this.sectionsWithData = this.getSectionsWithData();
      }
    });
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  private initializeForm(): void {
    this.userInsForm = this.fb.group({
      step1: this.fb.group({
        firstname: ['', [Validators.required, UserInsValidators.firstnameValidator()]],
        lastname: ['', [Validators.required, UserInsValidators.lastnameValidator()]],
        email: ['', [Validators.required, Validators.email, UserInsValidators.emailValidator()]],
        role: ['', [Validators.required]],
        password: ['', [Validators.required, UserInsValidators.passwordValidator()]],
        repeatPassword: ['', [Validators.required, UserInsValidators.repeatPasswordValidator('password')]],
      }),
      step2: this.fb.group({
        address: ['', []],
        reference: ['', []],
        city: ['', []],
        department: ['', []],
        nationality: ['', []],
        identity_document: ['', []],
        gender: ['', []],
        birth_date: ['', []],
        phone_number: ['', []],
        loyalty_points: ['', []],
      }),
    });
  }

  private handleRoleChanges(): void {
    this.userInsForm.get('step1.role')?.valueChanges.subscribe(role => {
      this.selectedRole = role;
      this.updateDynamicFields(role);
      this.updateCompletedSteps();
    });
  }

  private initProductModal() {
    const $modalElement = document.getElementById('createProductModal');

    if (!$modalElement) {
      console.error('El elemento modal no existe');
      return;
    }

    const options: ModalOptions = {
      onHide: () => this.resetForm(),
      onShow: () => {
        //console.log('Modal abierto')
      },
      onToggle: () => console.log('Modal alternado'),
      backdrop: 'dynamic',
      closable: false,
    }

    this.productModal = new Modal($modalElement, options);
  }

  openModal() {
    if (!this.productModal) {
      //console.error('El modal no está inicializado.');
      return;
    }

    this.productModal.show();
    //console.log('Modal abierto manualmente.');
  }

  closeModal() {
    if (!this.productModal) {
      //console.error('El modal no está inicializado.');
      return;
    }

    this.productModal.hide();
    //console.log('Modal cerrado manualmente.');
  }

  // Gestión del formulario
  resetForm() {
    this.userInsForm.reset(); // Resetea todos los valuees del formulario
    this.userInsForm.get('step1.role')?.setValue('');
    this.currentStep = 1; // Regresa al primer paso
    this.completedSteps = [false, false, false]; // Reinicia pasos completados
    //console.log('Formulario reseteado');
  }

  isStepValid(step: number): boolean {
    const stepKey = `step${step}`;
    const isValid = this.userInsForm.get(stepKey)?.valid ?? false;
    this.updateCompletedSteps();
    return isValid;
  }

  updateCompletedSteps(): void {
    const step1Valid = this.userInsForm.get('step1')?.valid ?? false;
    const step2Valid = this.selectedRole !== '' && (this.userInsForm.get('step2')?.valid ?? false);
    let step3Valid = this.completedSteps[2] && step1Valid && step2Valid;

    if (!step1Valid || (!step2Valid && this.completedSteps[2])) {
      step3Valid = false;
    }

    const newCompletedSteps = [step1Valid, step2Valid, step3Valid];

    // Solo actualiza si hay cambios reales
    if (JSON.stringify(this.completedSteps) !== JSON.stringify(newCompletedSteps)) {
      this.completedSteps = newCompletedSteps;
      this.cdr.detectChanges(); // Fuerza la detección solo si hay cambios
    }
  }

  nextStep(): void {
    if (this.isStepValid(this.currentStep)) {
      this.currentStep++;
      if (this.currentStep === 3) {
        this.completedSteps[2] = true; // Marcar el paso 3 como completado si se llega a él
      }
    } else {
      console.log(`Paso ${this.currentStep} no es válido`);
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  roleTranslations: { [key: string]: string } = {
    admin: 'Administrador',
    seller: 'Vendedor',
    customer: 'Cliente'
  };

  genderTranslations: { [key: string]: string } = {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro'
  };

  maskPassword(password: string): string {
    return '•'.repeat(password.length);
  }

  getIconComponent(nombre: string) {
    return this.iconComponentMap[nombre as keyof typeof this.iconComponentMap] || null;
  }

  getSectionsWithData(): { title: string; fields: { icon: string; label: string; value: any }[] }[] {
    // Mapa de secciones y los fields que pertenecen a cada una
    const sectionFieldMap: { [key: string]: string[] } = {
      "Información Personal": ["firstname", "lastname", "birth_date", "identity_document", "gender", "nationality"],
      "Información de Contacto": ["email", "phone_number", "address", "reference", "city", "department"],
      "Información de Cuenta": ["role", "password"],
      "Información Adicional": ["loyalty_points"] // Solo para el rol de cliente
    };

    // Mapa de iconos por campo
    const fieldIconMap: { [key: string]: string } = {
      firstname: 'app-user-icon',
      lastname: 'app-user-icon',
      birth_date: 'app-calendar-icon',
      email: 'app-mail-icon',
      role: 'app-user-cog-icon',
      gender: 'app-gender-icon',
      address: 'app-map-pin-icon',
      reference: 'app-location-pin-icon', // -
      city: 'app-buildings-icon',
      department: 'app-map2-icon',
      nationality: 'app-globe-icon', // -
      identity_document: 'app-epassport-icon',
      password: 'app-lock-password-icon',
      phone_number: 'app-phone-icon', // -
      loyalty_points: 'app-coins-icon', // -
    };

    // Volcar datos del formulario y fields permitidos por el rol
    const userInsForm = this.userInsForm;
    const selectedRole = this.selectedRole;
    const selectedFields = this.roleFieldMap[selectedRole] || [];
    const step1Data = userInsForm.get('step1')?.value || {};
    const step2Data = userInsForm.get('step2')?.value || {};
    const combinedData = { ...step1Data, ...step2Data };


    // Filtrar y mapear los datos en secciones
    const sections = Object.entries(sectionFieldMap)
      .map(([title, fieldsEsperados]) => ({
        title,
        fields: fieldsEsperados
          .filter((field) => selectedFields.includes(field)) // Solo incluir fields permitidos por el rol
          .map((field) => ({
            icon: fieldIconMap[field] || 'app-user-icon', // Icono por campo
            label: this.getFieldLabel(field), // label amigable
            value: combinedData[field] || 'N/A', // value del campo o 'N/A' si no existe
          })),
      }))
      .filter(section => section.fields.length > 0);

    return sections;
  }

  getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      firstname: 'Nombre',
      lastname: 'Apellido',
      email: 'Correo Electrónico',
      role: 'Rol',
      password: 'Contraseña',
      address: 'Dirección',
      reference: 'Referencia',
      city: 'Ciudad',
      department: 'Departamento',
      nationality: 'Nacionalidad',
      identity_document: 'Documento de Identidad',
      gender: 'Género',
      birth_date: 'Fecha de Nacimiento',
      phone_number: 'Teléfono',
      loyalty_points: 'Puntos de Fidelidad',
    };
  
    return labels[field] || field;
  }

  private showToast(id: string, message: string, autoClose: boolean = true, autoCloseDelay: number = 3000, fieldErrors: ApiError[] = []): void {
    const toastElement = document.getElementById(`toast-${id}`);
    if (!toastElement) {
      console.error(`Toast con ID "${id}" no encontrado.`);
      return;
    }

    // Actualizar el mensaje principal
    const messageElement = toastElement.querySelector('.toast-message');
    if (messageElement) {
      messageElement.textContent = message;
    }

    // Actualizar la lista de errores
    const errorListElement = toastElement.querySelector('.toast-errors');
    if (errorListElement) {
      errorListElement.innerHTML = ''; // Siempre limpiar el contenido
    
      // Verificar si hay errores antes de iterar
      if (fieldErrors && fieldErrors.length > 0) {
        fieldErrors.forEach((error) => {
          if (!error.field) return;
          const fieldLabel = this.getFieldLabel(error.field);
          const formattedMessage = error.message.replace(error.field, fieldLabel);
          const li = document.createElement('li');
          li.innerHTML = `<span class="font-semibold">${fieldLabel}:</span> ${formattedMessage}.`;
          errorListElement.appendChild(li);
        });
      }
    }

    // Mostrar el toast
    toastElement.classList.remove('hidden', 'opacity-0');
    toastElement.classList.add('flex', 'opacity-100');

    // Configurar cierre automático
    if (autoClose) {
      this.hideToast(id, autoCloseDelay); // Pasamos el delay al método hideToast
    }
  }

  private hideToast(id: string, delay: number | null = null): void {
    const toastElement = document.getElementById(`toast-${id}`);
    if (!toastElement) {
      console.error(`Toast con ID "${id}" no encontrado.`);
      return;
    }

    // Si hay un delay, esperamos antes de ocultar
    if (delay !== null) {
      setTimeout(() => {
        this.hideToastImmediately(toastElement);
      }, delay);
    } else {
      // Si no hay delay, ocultamos inmediatamente
      this.hideToastImmediately(toastElement);
    }
  }

  private hideToastImmediately(toastElement: HTMLElement): void {
    // Ocultar el toast
    toastElement.classList.remove('opacity-100');
    toastElement.classList.add('opacity-0');

    // Después de la transición, agregar "hidden"
    setTimeout(() => {
      if (toastElement.classList.contains('opacity-0')) {
        toastElement.classList.remove('flex');
        toastElement.classList.add('hidden');
      }
    }, 300); // Duración de la transición
  }

  private setupUserCreateStatusListener(): void {
    this.usersDataService.userCreateStatus$.subscribe({
      next: (result) => {
        if (result.status === 'success') {
          this.showToast('success', 'Usuario creado con éxito', true, 1000); // Mostrar 0.75 segundos
          setTimeout(() => {
            this.closeModal(); // Cerrar modal después de 0.3 segundos
          }, 300);
        } else if (result.status === 'error') {
          const statusCode = result.statusCode?? 0; // Obtén el código de estado HTTP
          this.fieldErrors = result.errors || []; // Obtén los errores de campo
          if (statusCode === 0) {
            this.showToast('warning', result.message, true, 2000);
          } else if (statusCode >= 500) {
            this.showToast('warning', result.message, true, 1500);
          } else if (statusCode >= 400 && statusCode < 500) {
            this.showToast('danger', result.message, true, 3000, this.fieldErrors);
          } else {
            this.showToast('danger', result.message, true, 3000);
          }
        }
      },
      error: (err) => {
        console.error('Error inesperado en la creación del usuario:', err);
        this.showToast('warning', 'Error inesperado. Intente nuevamente.', false);
      },
    });
  }

  generateFormJson(): UserWithRole {
    const selectedFields = this.roleFieldMap[this.selectedRole] || [];
    const step1Data = this.userInsForm.get('step1')?.value || {};
    const step2Data = this.userInsForm.get('step2')?.value || {};
  
    // Combinar los datos de todos los pasos
    const combinedData = { ...step1Data, ...step2Data };
  
    // Filtrar solo los fields relevantes para el rol seleccionado
    const filteredData = selectedFields.reduce((result, field) => {
      if (combinedData[field] !== null && combinedData[field] !== undefined) {
        result[field] = combinedData[field];
      }
      return result;
    }, {} as { [key: string]: any });
  
    // Separar los datos del usuario y del rol
    const { firstname, lastname, email, role, password, is_active, ...roleSpecificData } = filteredData;
  
    // Determinar el tipo específico de roleData según el rol seleccionado
    let roleData: Admin | Customer | Seller | undefined;
    switch (this.selectedRole) {
      case 'admin':
        roleData = roleSpecificData as Admin;
        break;
      case 'customer':
        roleData = roleSpecificData as Customer;
        break;
      case 'seller':
        roleData = roleSpecificData as Seller;
        break;
      default:
        roleData = undefined;
    }
  
    // Retornar los datos estructurados en el formato UserWithRole
    return {
      userData: {
        firstname,
        lastname,
        email,
        password,
        role,
        is_active: is_active !== undefined ? is_active : true, // Valor por defecto
      },
      roleData,
    };
  }
  
  onSubmit() {
    if (this.userInsForm.valid) {
      this.usersDataService.createUser(this.generateFormJson());
    } else {
      console.log('Formulario no válido');
    }
  }

  hasErrors(step: string, controlName: string): boolean {
    const control = this.userInsForm.get(step)?.get(controlName);
    return control != null && control.errors != null && (control.dirty || control.touched);
  }

  updateDynamicFields(role: string) {
    const step2 = this.userInsForm.get('step2') as FormGroup;

    // Limpia los valuees y validadores de todos los fields
    Object.keys(step2.controls).forEach((field) => {
      const control = step2.get(field);
      control?.clearValidators();
      control?.reset(); // Limpia el value del campo
      control?.updateValueAndValidity();
    });

    // Asigna validadores según el rol seleccionado
    if (role === 'admin') {
      step2.get('address')?.setValidators([Validators.required, Validators.minLength(5), UserInsValidators.noWhitespaceValidator()]);
      step2.get('city')?.setValidators([Validators.required, Validators.minLength(3), UserInsValidators.noWhitespaceValidator()]);
      step2.get('department')?.setValidators([Validators.required, Validators.minLength(3), UserInsValidators.noWhitespaceValidator()]);
      step2.get('gender')?.setValidators([Validators.required]);
      step2.get('gender')?.setValue('');
      step2.get('birth_date')?.setValidators([Validators.required]);
      step2.get('identity_document')?.setValidators([Validators.required, Validators.minLength(8), Validators.pattern(/^\d+$/)]);
    } else if (role === 'seller') {
      step2.get('address')?.setValidators([Validators.required, Validators.minLength(5), UserInsValidators.noWhitespaceValidator()]);
      step2.get('reference')?.setValidators([Validators.required, UserInsValidators.noWhitespaceValidator()]);
      step2.get('city')?.setValidators([Validators.required, UserInsValidators.noWhitespaceValidator()]);
      step2.get('department')?.setValidators([Validators.required, UserInsValidators.noWhitespaceValidator()]);
      step2.get('nationality')?.setValidators([Validators.required, UserInsValidators.noWhitespaceValidator()]);
      step2.get('gender')?.setValidators([Validators.required]);
      step2.get('gender')?.setValue('');
      step2.get('birth_date')?.setValidators([Validators.required]);
      step2.get('identity_document')?.setValidators([Validators.required, Validators.minLength(8), Validators.pattern(/^\d+$/)]);
    } else if (role === 'customer') {
      step2.get('gender')?.setValidators([Validators.required]);
      step2.get('gender')?.setValue('');
      step2.get('birth_date')?.setValidators([Validators.required]);
      step2.get('phone_number')?.setValidators([Validators.required, Validators.minLength(9), Validators.pattern(/^\d+$/)]);
      step2.get('loyalty_points')?.setValidators([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+$/)]);
    }

    // Actualiza las validaciones de todos los controles
    Object.keys(step2.controls).forEach((field) => {
      const control = step2.get(field);
      control?.updateValueAndValidity();
    });

    //console.log(`fields actualizados para el rol: ${role}`);
    //this.logDynamicValidators();
  }

  logDynamicValidators() {
    const step2Controls = (this.userInsForm.get('step2') as FormGroup)?.controls || {};
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
