import { AfterViewInit, Component, EventEmitter, inject, Inject, Input, OnInit, Output } from '@angular/core';
import { initFlowbite, Modal } from 'flowbite';
import { UsersDataService } from '../services/users-data.service';
import { UserWithRole } from '../../../../../models/user.model';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DatepickerComponent } from "../components/datepicker/datepicker.component";
import { ApiError } from '../../../../../models/response.model';

interface FormField {
  key: string;       // Nombre del campo (coincide con formControlName)
  label: string;     // Etiqueta a mostrar
  type: string;      // Tipo de input (text, number, date, etc.)
  role: string[];    // Roles que usan este campo
  options?: { value: string; label: string }[]; // Opciones para campos select
}

@Component({
  selector: 'app-users-upd',
  standalone: true,
  imports: [ReactiveFormsModule, DatepickerComponent],
  templateUrl: './users-upd.component.html',
  styleUrl: './users-upd.component.css'
})
export class UsersUpdComponent implements OnInit, AfterViewInit{
  @Input() id!: number;
  @Output() close = new EventEmitter<void>();
  
  private userDataService = inject(UsersDataService);
  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  
  userUpdModalId!: string;
  userUpdModal!: Modal;
  isClosingUpddModal = false;

  userDeleteModalId!: string;
  userDeleteModal!: Modal;
  isClosingDeleteModal = false;
  
  userUpdForm!: FormGroup;

  user: UserWithRole | null = null;
  todayDate: string | null = null;
  registerDate: String | null = null;
  fieldErrors: ApiError[] = [];

  roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'seller', label: 'Vendedor' },
    { value: 'customer', label: 'Cliente' }
  ];

  genderOptions = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' },
    { value: 'other', label: 'Otro' }
  ];

  staticFields: FormField[] = [
    { key: 'email', label: 'Correo Electrónico', type: 'email', role: [] },
    { key: 'firstname', label: 'Nombre', type: 'text', role: [] },
    { key: 'lastname', label: 'Apellido', type: 'text', role: [] },
    { key: 'is_active', label: 'Estado', type: 'toggle', role: [] },
    { key: 'role', label: 'Rol', type: 'select', role: [], options: this.roleOptions },
  ];

  formFields: FormField[] = [
    { key: 'gender', label: 'Género', type: 'select', role: ['customer', 'seller', 'admin'], options: this.genderOptions },
    { key: 'nationality', label: 'Nacionalidad', type: 'text', role: ['seller'] },
    { key: 'reference', label: 'Referencia', type: 'text', role: ['seller'] },
    { key: 'birth_date', label: 'Fecha de Nacimiento', type: 'date', role: ['admin', 'customer', 'seller'] },
    { key: 'phone_number', label: 'Teléfono', type: 'text', role: ['customer'] },
    { key: 'loyalty_points', label: 'Puntos de Lealtad', type: 'number', role: ['customer'] },
    { key: 'address', label: 'Dirección', type: 'text', role: ['seller', 'admin'] },
    { key: 'city', label: 'Ciudad', type: 'text', role: ['seller', 'admin'] },
    { key: 'department', label: 'Departamento', type: 'text', role: ['seller', 'admin'] },
    { key: 'identity_document', label: 'DNI / Identificación', type: 'text', role: ['admin', 'seller'] }
  ];

  visibleFields: FormField[] = [];

  ngOnInit(): void {
    this.userUpdModalId = `update-${this.id}-user-modal`;
    this.userDeleteModalId = `delete-${this.id}-user-modal`;
    this.initializeForm();
    this.loadUserData();
    this.userUpdForm.get('role')?.valueChanges.subscribe(newRole => {
      if (newRole) {
        this.updateVisibleFields(newRole);
        this.updateValidations(newRole);
        //this.printActiveValidations();
      }
    });
    this.todayDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.setupUserUpdateStatusListener();
  }

  ngAfterViewInit(): void {
    initFlowbite();
    this.initFlowbiteModal();
  }

  initFlowbiteModal() {
    const userModalElement = document.getElementById(this.userUpdModalId);
    if (userModalElement) {
      this.userUpdModal = new Modal(userModalElement, {
        backdrop: 'static',
        closable: true,
        onHide: () => {
          if (!this.isClosingUpddModal ) {
            this.isClosingUpddModal  = true;
            this.closeUserUpdModal();
          }
        }
      });

      this.userUpdModal.show(); 
    }

    const userDeleteModalElement = document.getElementById(this.userDeleteModalId);
    if (userDeleteModalElement) {
      this.userDeleteModal = new Modal(userDeleteModalElement, {
        backdrop: 'dynamic',
        closable: true,
        onHide: () => {
          if (!this.isClosingDeleteModal) {
            this.isClosingDeleteModal = true;
            this.closeDeleteUserModal();
          }
        }
      });
    }
  }

  openUserDeleteModalElement(){
    this.isClosingDeleteModal = false;
    this.userDeleteModal.show();
  }

  closeDeleteUserModal() {
    if (!this.isClosingDeleteModal) {
      this.isClosingDeleteModal = true;
      this.userDeleteModal.hide();
    }
  }

  closeUserUpdModal() {
    if (!this.isClosingUpddModal ) {
      this.isClosingUpddModal  = true;
      this.userUpdModal.hide();
    }
    this.close.emit();
  }

  closeAllModals() {
    if (!this.isClosingDeleteModal) {
      this.isClosingDeleteModal = true;
      this.userDeleteModal.hide();
    }
    
    if (!this.isClosingUpddModal) {
      this.isClosingUpddModal = true;
      this.userUpdModal.hide();
    }
  
    this.close.emit();
  }

  loadUserData() {
    this.userDataService.getUserById(this.id).subscribe({
      next: (user) => {
        this.user = user; 
        if (this.user) {
          const data = { ...this.user.userData, ...this.user.roleData };
          this.userUpdForm.patchValue(data);
          this.updateVisibleFields(this.user.userData.role);
          this.registerDate = this.datePipe.transform(this.user.userData.created_at, 'dd/MM/yyyy');
        }
        console.log('Usuario seleccionado:', JSON.stringify(this.user, null, 2));
        //console.log('Formulario después de cargar datos:', this.userUpdForm.value);
      },
      error: () => {
        console.error('Error al cargar los datos del usuario');
        this.user = null; 
      }
    });
  }

  private initializeForm(): void {
    this.userUpdForm = this.fb.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      is_active: [false], 
      created_at: [''],
      role: ['', [Validators.required]],
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
    });
  }

  private updateVisibleFields(role: string): void {
    this.visibleFields = [
      ...this.staticFields, 
      ...this.formFields.filter(field => field.role.includes(role))
    ];

    this.formFields.forEach(field => {
      const control = this.userUpdForm.get(field.key);
      if (control && !control.value) {
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
  }

  private validationRules: { [key: string]: { [role: string]: ValidatorFn[] } } = {
    address: {
      admin: [Validators.required],
      seller: [Validators.required]
    },
    reference: {
      seller: [Validators.required]
    },
    city: {
      admin: [Validators.required],
      seller: [Validators.required]
    },
    department: {
      admin: [Validators.required],
      seller: [Validators.required]
    },
    nationality: {
      seller: [Validators.required]
    },
    gender: {
      admin: [Validators.required],
      seller: [Validators.required],
      customer: [Validators.required]
    },
    birth_date: {
      admin: [Validators.required],
      customer: [Validators.required],
      seller: [Validators.required]
    },
    identity_document: {
      admin: [Validators.required, Validators.minLength(8)],
      seller: [Validators.required, Validators.minLength(8)]
    },
    phone_number: {
      customer: [Validators.required, Validators.pattern(/^\d+$/)]
    },
    loyalty_points: {
      customer: [Validators.required, Validators.min(0)]
    }
  };

  private updateValidations(role: string): void {
    // 🔥 Primero, limpiar todas las validaciones
    this.formFields.forEach(field => {
      const control = this.userUpdForm.get(field.key);
      if (control) {
        control.clearValidators(); // Elimina validaciones anteriores SOLO de los campos dinámicos
        control.updateValueAndValidity();
      }
    });

    // 🔥 Aplicar solo las validaciones correspondientes al nuevo rol
    Object.keys(this.validationRules).forEach(field => {
      const control = this.userUpdForm.get(field);
      if (control && this.validationRules[field][role]) {
        control.setValidators(this.validationRules[field][role]); // Aplicar validaciones dinámicamente
        control.updateValueAndValidity();
      }
    });
  }
  
  private printActiveValidations(): void {
    Object.keys(this.userUpdForm.controls).forEach(field => {
      const control = this.userUpdForm.get(field);
      if (control) {
        const validators = control.validator ? control.validator({} as AbstractControl) : null;
        if (validators) {
          console.log(`🔹 ${field}:`, Object.keys(validators));
        }
      }
    });
  }

  hasErrors(controlName: string): boolean {
    const control = this.userUpdForm.get(controlName);
    return control != null && control.errors != null && (control.dirty || control.touched);
  }

  isFormValid(): boolean {
    return this.userUpdForm.valid;
  }

  onUpdate() {
    const validData = this.getValidFormData();
    this.userDataService.updateUser(this.id, validData);
    console.log('Datos válidos:', JSON.stringify(validData, null, 2));
    //this.closeUserUpdModal();
  }

  onDeleteConfirm() {
    this.userDataService.deleteUser(this.id).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.closeAllModals();
        }
        this.userDataService.resetFilters();
      },
      error: () => {
        console.error('Error al eliminar usuario');
      }
    });
  }

  private getValidFormData(): any {
    const formData = this.userUpdForm.value;
    const filteredData: any = { userData: {}, roleData: {} };
  
    this.visibleFields.forEach(field => {
      if (this.staticFields.some(staticField => staticField.key === field.key)) {
        filteredData.userData[field.key] = formData[field.key];
      } else {
        filteredData.roleData[field.key] = formData[field.key];
      }
    });
  
    return filteredData;
  }

  private setupUserUpdateStatusListener(): void {
    this.userDataService.userUpdateStatus$.subscribe({
      next: (result) => {
        if (result.status === 'success') {
          this.showToast('success1', 'Usuario actualizado con éxito', true, 1000); // Mostrar 0.75 segundos
          setTimeout(() => {
            this.closeUserUpdModal(); // Cerrar modal después de 0.3 segundos
          }, 300);
        } else if (result.status === 'error') {
          const statusCode = result.statusCode?? 0; // Obtén el código de estado HTTP
          this.fieldErrors = result.errors || []; // Obtén los errores de campo
          if (statusCode === 0) {
            this.showToast('warning1', result.message, true, 2000);
          } else if (statusCode >= 500) {
            this.showToast('warning1', result.message, true, 1500);
          } else if (statusCode >= 400 && statusCode < 500) {
            this.showToast('danger1', result.message, true, 3000, this.fieldErrors);
          } else {
            this.showToast('danger1', result.message, true, 3000);
          }
        }
      },
      error: (err) => {
        console.error('Error inesperado en la creación del usuario:', err);
        this.showToast('warning', 'Error inesperado. Intente nuevamente.', false);
      },
    });
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
}
