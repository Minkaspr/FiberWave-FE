import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Modal } from 'flowbite';
import { UsersDataService } from '../services/users-data.service';
import { UserWithRole } from '../../../../../models/user.model';
import { CommonModule, DatePipe } from '@angular/common';

enum userStatus {
  ACTIVE = 'Habilitado',
  INACTIVE = 'Inhabilitado'
}

enum userRoles {
  ADMIN = 'Administrador',
  SELLER = 'Vendedor',
  CUSTOM = 'Cliente'
}

@Component({
  selector: 'app-users-det',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './users-det.component.html',
  styleUrl: './users-det.component.css'
})
export class UsersDetComponent implements OnInit, AfterViewInit {
  @Input() id!: number;
  @Output() close = new EventEmitter<void>();
  @Output() actionEvent = new EventEmitter<string>(); 

  userReadModal!: Modal;
  userReadModalId!: string;
  isClosingReadModal = false;
  userStatusModal!: Modal;
  userUpdStatusModalId!: string
  isClosingStatusModal  = false;
  accion: string = '';
  isUpdatingStatus = false;

  user: UserWithRole | null = null;

  sectionsWithData: { title: string; fields: { label: string; value: any }[] }[] = [];

  constructor(private usersDataService: UsersDataService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.userReadModalId = `read-${this.id}-user-modal`;
    this.userUpdStatusModalId = `upd-status-${this.id}-user-modal`;
    this.loadUserData();
    this.usersDataService.userStatusUpdate$.subscribe({
      next: (status) => {
        this.isUpdatingStatus = status.status === 'loading';
      }
    });
  }

  ngAfterViewInit(): void {
    this.initFlowbiteModal();
  }

  initFlowbiteModal() {
    const userModalElement = document.getElementById(this.userReadModalId);
    if (userModalElement) {
      this.userReadModal = new Modal(userModalElement, {
        backdrop: 'static',
        closable: true,
        onHide: () => {
          if (!this.isClosingReadModal ) {
            this.isClosingReadModal  = true;
            this.cerrarUserReadModal();
          }
        }
      });

      this.userReadModal.show(); 
    }

    const userStatusModalElement = document.getElementById(this.userUpdStatusModalId);
    if (userStatusModalElement) {
      this.userStatusModal = new Modal(userStatusModalElement, {
        backdrop: 'dynamic',
        closable: true,
        onHide: () => {
          if (!this.isClosingStatusModal) {
            this.isClosingStatusModal = true;
            this.cerrarUserStatusModal();
          }
        }
      });
    }
  }

  cerrarUserReadModal() {
    if (!this.isClosingReadModal ) {
      this.isClosingReadModal  = true;
      this.userReadModal.hide();
    }
    this.close.emit();
  }

  cerrarUserStatusModal() {
    if (!this.isClosingStatusModal) {
      this.isClosingStatusModal = true;
      this.userStatusModal.hide();
    }
    console.log('Cerrando modal de cambio de estado');
  }

  loadUserData() {
    this.usersDataService.getUserById(this.id).subscribe({
      next: (user) => {
        this.user = user; // Asignamos el usuario cargado
        this.accion = user.userData.is_active ? 'Inhabilitar' : 'Habilitar';
        if(this.user) {
          this.sectionsWithData = this.getSectionsWithDataFromApi(this.user);
        }
        console.log('Usuario seleccionado:', JSON.stringify(this.user, null, 2));
      },
      error: () => {
        console.error('Error al cargar los datos del usuario');
        this.user = null; // Limpiar usuario en caso de error
      }
    });
  }

  openUserStatusModalElement() {
    // Abrir modal para cambiar estado del usuario
    this.isClosingStatusModal = false;
    this.userStatusModal.show();
  }

  updateUserStatus() {
    if (!this.user) {
      console.error('No se puede actualizar el estado del usuario porque no hay datos');
      return;
    }

    const newStatus = !this.user.userData.is_active;
    this.usersDataService.updateUserStatus(this.id, newStatus).subscribe({
      next: () => {
        this.user!.userData.is_active = newStatus;
        this.accion = newStatus ? 'Inhabilitar' : 'Habilitar';
        this.userStatusModal.hide();
        this.userReadModal.hide();
        this.usersDataService.resetFilters();
      },
      error: () => {
        console.error('Error al actualizar el estado del usuario');
      }});
  }

  getUserStateLabel(isEnabled: boolean): string {
    return isEnabled ? userStatus.ACTIVE : userStatus.INACTIVE;
  }

  getUserRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return userRoles.ADMIN;
      case 'seller': return userRoles.SELLER;
      case 'customer': return userRoles.CUSTOM;
    }
    return 'Desconocido';
  }

  getSectionsWithDataFromApi(user: UserWithRole): { title: string; fields: { label: string; value: any }[] }[] {
    const roleFieldMap: { [key: string]: string[] } = {
      admin: ['email', 'address', 'city', 'department', 'gender', 'birth_date', 'identity_document'],
      seller: ['email', 'address', 'reference', 'city', 'department', 'nationality', 'gender', 'birth_date', 'identity_document'],
      customer: ['email', 'gender', 'birth_date', 'phone_number', 'loyalty_points'],
    };

    // Definir el mapa de campos y sus secciones
    const sectionFieldMap: { [key: string]: string[] } = {
      "Información Personal": ["birth_date", "identity_document", "gender"],
      "Información de Contacto": ["email", "address", "city", "department"],
      "Otros": ["created_at"]
    };
  
    // Labels para los campos
    const fieldLabels: { [key: string]: string } = {
      email: "Correo Electrónico",
      gender: "Género",
      birth_date: "Fecha de Nacimiento",
      identity_document: "Documento de Identidad",
      address: "Dirección",
      city: "Ciudad",
      department: "Departamento",
      created_at: "Fecha de Creación"
    };
  
    // Traducciones para valores específicos
    const genderTranslations: { [key: string]: string } = {
      male: "Masculino",
      female: "Femenino",
      other: "Otro"
    };
  
    // Extraer datos del API
    const userData = user.userData || {};
    const roleData = user.roleData || {};
    const selectedFields = roleFieldMap[user?.userData?.role] || [];
  
    // Combinar los datos planos
    const combinedData: { [key: string]: any } = { ...userData, ...roleData };
  
    const sections = Object.entries(sectionFieldMap)
      .map(([sectionTitle, fieldsEsperados]) => ({
        title: sectionTitle,
        fields: fieldsEsperados
          .filter((field) => selectedFields.includes(field))
          .map((field) => {
            let value = combinedData[field] || "N/A";

            // Aplicar traducciones según el campo
            if (field === "gender") {
              value = genderTranslations[value] || value;
            }

            // Formatear fechas si es necesario
            if (field === "birth_date" || field === "created_at") {
              value = this.datePipe.transform(value, 'dd/MM/yyyy');
            }
            
            return {
              label: fieldLabels[field] || field,
              value
            };
          })
      }))
      .filter((section) => section.fields.length > 0);

    return sections;
  }

  editUser() {
    this.cerrarUserReadModal();
    this.actionEvent.emit('edit');
  }

  deleteUser() {
    this.cerrarUserReadModal();
    this.actionEvent.emit('delete');
  }
}
