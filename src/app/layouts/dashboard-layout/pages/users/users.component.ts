import { Component, OnInit } from '@angular/core';
import { UsersSelComponent } from "./users-sel/users-sel.component";
import { UsersInsComponent } from "./users-ins/users-ins.component";
import type { DropdownOptions } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import { UsersLkpComponent } from "./users-lkp/users-lkp.component";
import { UsersDataService } from './services/users-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Modal } from 'flowbite';
import { ProcessStatus } from '../../../../models/response.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UsersSelComponent,
    UsersInsComponent,
    UsersLkpComponent
  ],
  template: `
    <section class="relative bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased h-full">
      <div class="mx-auto max-w-screen-xl px-4 lg:px-7">
        <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg">
          <div class="flex flex-row px-4 pt-3 pb-1 space-y-3 items-center justify-between lg:space-y-0 lg:space-x-4">
            <div class="flex items-center flex-1 space-x-4">
              <h5 class="mr-3 font-semibold dark:text-white text-xl">Gestionar Usuarios</h5>
            </div>
            <div class="flex flex-row flex-shrink-0 gap-2">
              <button type="button" class="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="w-4 h-4 sm:mr-2 icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
                <span class="hidden sm:block">Sincronizar 1/250</span>
              </button>
              <button type="button" class="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="w-4 h-4 sm:mr-2 icon icon-tabler icons-tabler-outline icon-tabler-upload"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 9l5 -5l5 5" /><path d="M12 4l0 12" /></svg>
                <span class="hidden sm:block">Export</span>
              </button>
            </div>
          </div>
          <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <app-users-lkp/>
              <div class="flex items-center space-x-3 w-full md:w-auto">
                <!--Filter-->
                <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown"
                  class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  type="button">
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="h-4 w-4 mr-2 text-gray-400 icon icon-tabler icons-tabler-filled icon-tabler-filter"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 3h-16a1 1 0 0 0 -1 1v2.227l.008 .223a3 3 0 0 0 .772 1.795l4.22 4.641v8.114a1 1 0 0 0 1.316 .949l6 -2l.108 -.043a1 1 0 0 0 .576 -.906v-6.586l4.121 -4.12a3 3 0 0 0 .879 -2.123v-2.171a1 1 0 0 0 -1 -1z" /></svg>
                  Filtro
                  <svg class="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clip-rule="evenodd" fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                <div id="filterDropdown" [formGroup]="filterForm" class="z-10 hidden w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
                  <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Roles</h6>
                  <ul class="space-y-2 text-sm" aria-labelledby="filterDropdownButton" formGroupName="roles">
                  @if (roles.length > 0) {
                    @for (role of roles; track role.name) {
                      <li class="flex items-center">
                        <input
                          id="{{ role.name }}"
                          type="checkbox"
                          [formControlName]="role.name"
                          class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="{{ role.name }}"
                          class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          @switch (role.name) {
                            @case ('customer') { Cliente }
                            @case ('seller') { Vendedor }
                            @case ('admin') { Administrador }
                            @default { No Definido }
                          }
                          ({{ role.userCount }})
                        </label>
                      </li>
                    }
                  } @else {
                    <li class="text-sm text-gray-500 dark:text-gray-400">No hay roles disponibles</li>
                  }
                  </ul>
                  <h6 class="mb-3 mt-5 text-sm font-medium text-gray-900 dark:text-white">Estados</h6>
                  <ul class="space-y-2 text-sm" aria-labelledby="filterDropdownButton" formGroupName="statuses">
                  @if (statuses.length > 0) {
                    @for (status of statuses; track status.is_active) {
                      <li class="flex items-center">
                        <input
                          id="{{ status.is_active ? 'active' : 'inactive' }}"
                          [formControlName]="'status'"
                          [value]="status.is_active"
                          type="radio"
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          for="{{ status.is_active ? 'active' : 'inactive' }}"
                          class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          {{ status.is_active ? 'Activo' : 'Inactivo' }} ({{ status.userCount }})
                        </label>
                      </li>
                    }
                  } @else {
                    <li class="text-sm text-gray-500 dark:text-gray-400">No hay estados disponibles</li>
                  }
                  </ul>
                </div>

                <!--Action-->
                <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown"
                  class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  type="button">
                  Opciones
                  <svg class="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clip-rule="evenodd" fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                <div id="actionsDropdown"
                  class="hidden z-10 w-52 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                  <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="actionsDropdownButton">
                    <li>
                      <a (click)="onClearFilters(); onActionSelect()" 
                        class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Refrescar Filtros</a>
                    </li>
                  </ul>
                  <div class="py-1">
                    <a (click)="openDeleteSelectedUsersModal(); onActionSelect()"
                      class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                      Eliminar seleccionados ({{ selectedUsers.length }})
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex flex-row w-full justify-end md:w-auto space-y-2 md:space-y-0 items-stretch md:items-center md:space-x-3 flex-shrink-0">
              <app-users-ins/>
            </div>
          </div>
          <app-users-sel (selectedUsersChanged)="updateSelectedUsers($event)"/>
        </div>

        <!-- Modal para eliminar usuarios seleccionados -->
        <div id="{{deleteSelectedUsersModalId}}" tabindex="-1" aria-hidden="true"
          class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div class="relative p-4 w-full max-w-md max-h-full">
            <!-- Modal content -->
            <div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <button type="button" (click)="closeDeleteSelectedUsersModal()"
                class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
              
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="w-11 h-11 mb-3.5 mx-auto icon icon-tabler icons-tabler-outline icon-tabler-trash">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 7l16 0" />
                  <path d="M10 11l0 6" />
                  <path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              <p class="mb-4 text-gray-500 dark:text-gray-300">
                @if (deleteStatus?.status !== 'loading') {
                  ¿Estás seguro de que deseas eliminar a
                  <strong class="text-gray-900 dark:text-white">{{ selectedUsers.length }}</strong> usuarios de los registros?
                }@else {
                  <p class="mb-4 text-gray-500 dark:text-gray-300 flex justify-center items-center gap-2">
                    <svg aria-hidden="true" class="size-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                    <span class="sr-only">Eliminando...</span>
                    Eliminando {{ selectedUsers.length }} usuario(s)...
                  </p>
                }
              </p>
              <div class="flex justify-center items-center space-x-4">
                <button type="submit" (click)="deleteSelectedUsers(); onActionSelect()" [disabled]="isDeleting" [class.animate-pulse]="isDeleting" [class.cursor-not-allowed]="isDeleting"
                  class="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                  @if( isDeleting ){
                    Eliminando...
                  } @else {
                    Sí, eliminar
                  }
                </button>
                <button type="button" (click)="closeDeleteSelectedUsersModal()"
                  class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                  No, cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
    
  `,
  styles: ``
})
export class UsersComponent implements OnInit {

  roles: { name: string; userCount: string }[] = [];
  statuses: { is_active: boolean; userCount: number }[] = [];

  filterForm: FormGroup;
  private filtersDropdown: any;
  private actionsDropdown: any;

  selectedUsers: number[] = [];

  deleteSelectedUsersModal!: Modal;
  deleteSelectedUsersModalId!: string;
  isCloseDeleteSelectedUsersModal = false;
  isDeleting: boolean = false;

  deleteStatus: ProcessStatus | null = null;
  
  constructor(private usersDataService: UsersDataService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      roles: this.fb.group({}),
      statuses: this.fb.group({})
    });
  }

  ngOnInit(): void {
    this.loadFilters();
    this.initFiltersDropdown();
    this.initActionsDropdown();
    this.deleteSelectedUsersModalId = 'delete-selected-users-modal';
  }

  ngOnDestroy(): void {
    this.usersDataService.resetFilters();
  }

  initFlowbiteModal(): void {
    const deleteSelectedUsersModalElement = document.getElementById(this.deleteSelectedUsersModalId);
    if (deleteSelectedUsersModalElement) {
      this.deleteSelectedUsersModal = new Modal(deleteSelectedUsersModalElement, {
        backdrop: 'static',
        closable: true,
        onHide: () => {
          if (!this.isCloseDeleteSelectedUsersModal) {
            this.isCloseDeleteSelectedUsersModal = true;
            this.closeDeleteSelectedUsersModal();
          }
        }
      });

      this.deleteSelectedUsersModal.show();
    }
  }

  private loadFilters(): void {
    this.usersDataService.fetchFilters();
    this.usersDataService.filters$.subscribe((filters) => {
      if (filters) {
        this.roles = filters.roles;
        this.statuses = filters.statuses;

        this.setRoles();
        this.setStatuses();
      }
    });
  }

  private setRoles(): void {
    const rolesGroup = this.filterForm.get('roles') as FormGroup;
    this.roles.forEach(role => {
      rolesGroup.addControl(role.name, this.fb.control(false));
    });
  }

  private setStatuses(): void {
    const statusesGroup = this.filterForm.get('statuses') as FormGroup;
    statusesGroup.addControl('status', this.fb.control(null));
  }

  private initFiltersDropdown(): void {
    const $targetEl = document.getElementById('filterDropdown');
    const $triggerEl = document.getElementById('filterDropdownButton');

    const options: DropdownOptions = {
      onHide: () => {
        this.applyFilters();
      },
      onShow: () => {
      },
      onToggle: () => {
      },
    };
    const instanceOptions: InstanceOptions = {
      id: 'filtersDropdownMenu',
      override: true
    };

    import('flowbite').then((module) => {
      const Dropdown = module.Dropdown;
      this.filtersDropdown = new Dropdown($targetEl!, $triggerEl!, options, instanceOptions);
    });
  }

  private initActionsDropdown(): void {
    const $targetEl = document.getElementById('actionsDropdown');
    const $triggerEl = document.getElementById('actionsDropdownButton');

    const options: DropdownOptions = {
      onHide: () => {
      },
      onShow: () => {
      },
      onToggle: () => {
      },
    };
    const instanceOptions: InstanceOptions = {
      id: 'actionsDropdownMenu',
      override: true
    };

    import('flowbite').then((module) => {
      const Dropdown = module.Dropdown;
      this.actionsDropdown = new Dropdown($targetEl!, $triggerEl!, options, instanceOptions);
    });
  }

  onActionSelect(): void {
    this.actionsDropdown.hide();
  }

  applyFilters(): void {
    const selectedRoles = Object.entries(this.filterForm.value.roles)
      .filter(([_, checked]) => checked)
      .map(([role]) => role);

    const selectedStatus = this.filterForm.value.statuses?.status;
    const filters = {
      roles: selectedRoles.length > 0 ? selectedRoles : undefined,
      status: selectedStatus !== undefined ? selectedStatus : undefined,
    };

    this.usersDataService.applySelectedFilters(filters);
  }

  onClearFilters(): void {
    this.usersDataService.resetFilters();

    this.filterForm.reset({
      roles: {},      // Desmarca todos los roles
      statuses: { status: null } // Deselecciona el estado (null o undefined)
    });

    this.usersDataService.triggerClearSelection();
  }

  updateSelectedUsers(ids: number[]) {
    this.selectedUsers = ids;
  }

  deleteSelectedUsers() {
    if(this.selectedUsers.length > 0){
      const payload = { userIds: this.selectedUsers }; 
      this.isDeleting = true; // Deshabilitar botones mientras se elimina
      this.deleteStatus = { status: 'loading', message: `Eliminando ${payload.userIds.length} usuario(s)...` };

      this.usersDataService.deleteMultipleUsers(payload).subscribe({
        next: (status) => {
          this.deleteStatus = status;
          setTimeout(() => {
            this.isDeleting = false; // Reactivar SOLO después de la respuesta exitosa
            this.usersDataService.triggerClearSelection();
            this.usersDataService.resetFilters();
            this.closeDeleteSelectedUsersModal();
          }, 1000);
        },
        error: (error) => {
          this.deleteStatus = {
            status: 'error',
            message: error.error?.message || 'Error al eliminar los usuarios'
          };
          this.isDeleting = false; // Reactivar SOLO después del error
        }
      });
      // console.log('Eliminar estos IDs:', this.selectedUsers);
    }
  }

  openDeleteSelectedUsersModal() {
    if(this.selectedUsers.length > 0){
      if (!this.deleteSelectedUsersModal) {
        this.initFlowbiteModal(); 
      }
      this.isCloseDeleteSelectedUsersModal = false;
      this.deleteSelectedUsersModal?.show();
    }
  }

  closeDeleteSelectedUsersModal() {
    if (!this.isCloseDeleteSelectedUsersModal ) {
      this.isCloseDeleteSelectedUsersModal  = true;
      this.deleteSelectedUsersModal.hide();
    }
  }
}
