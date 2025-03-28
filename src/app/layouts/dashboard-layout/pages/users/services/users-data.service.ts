import { inject, Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { BehaviorSubject, catchError, map, Observable, of, startWith, Subject } from 'rxjs';
import { User, UserResponse, UserWithRole } from '../../../../../models/user.model';
import { Filters, SelectedFilters } from '../../../../../models/user-filter.model';
import { ApiError, ApiResponse, ProcessStatus } from '../../../../../models/response.model';

@Injectable({
  providedIn: 'root'
})

export class UsersDataService {
  private userService = inject(UsersService);

  /**
   * Subjects y Observables para la gestión de usuarios.
   */

  // Lista de usuarios cargados
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  // Error al cargar usuarios
  private errorUsersSubject = new BehaviorSubject<string | null>(null);
  public errorUsers$ = this.errorUsersSubject.asObservable();

  // Usuario seleccionado
  private userSelectedSubject = new BehaviorSubject<UserWithRole | null>(null);
  public userSelected$ = this.userSelectedSubject.asObservable();

  // Estado de creación de usuario
  private userCreateStatusSubject = new Subject<ProcessStatus>();
  public userCreateStatus$ = this.userCreateStatusSubject.asObservable();

  // Estado de actualizacion del estado de un usuario
  private userStatusUpdateSubject = new Subject<ProcessStatus>();
  public userStatusUpdate$ = this.userStatusUpdateSubject.asObservable();

  // Estado de actualización de usuario
  private userUpdateStatusSubject = new Subject<ProcessStatus>();
  public userUpdateStatus$ = this.userUpdateStatusSubject.asObservable();

  // Estado de eliminación de usuario
  private userDeleteStatusSubject = new Subject<ProcessStatus>();
  public userDeleteStatus$ = this.userDeleteStatusSubject.asObservable();

  // Total de usuarios disponibles
  private totalItemsSubject = new BehaviorSubject<number>(0);
  public totalItems$ = this.totalItemsSubject.asObservable();

  // Total de páginas
  private totalPagesSubject = new BehaviorSubject<number>(1);
  public totalPages$ = this.totalPagesSubject.asObservable();

  // Página actual
  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();

  // Tamaño de página
  private pageSizeSubject = new BehaviorSubject<number>(10);
  public pageSize$ = this.pageSizeSubject.asObservable();

  // Ordenar por columna
  private sortBySubject = new BehaviorSubject<string>('created_at');
  public sortBy$ = this.sortBySubject.asObservable();

  // Dirección del orden
  private sortOrderSubject = new BehaviorSubject<'asc' | 'desc'>('desc');
  public sortOrder$ = this.sortOrderSubject.asObservable();

  // Filtros disponibles (roles, estados)
  private filtersSubject = new BehaviorSubject<Filters | null>(null);
  public filters$ = this.filtersSubject.asObservable();

  // Filtros aplicados actualmente
  private selectedFiltersSubject = new BehaviorSubject<SelectedFilters | null>(null);
  public selectedFilters$ = this.selectedFiltersSubject.asObservable();

  // Limpiar los usuarios seleccionados
  private clearSelectionSubject = new Subject<void>(); 
  clearSelection$ = this.clearSelectionSubject.asObservable();

  /**
   * Obtener lista de usuarios con paginación y filtros.
   */
  fetchUsers(
    currentPage: number = this.currentPageSubject.value,
    pageSize: number = this.pageSizeSubject.value,
    filters: SelectedFilters = {}
  ): void {
    const roles = filters.roles || [];
    const isActive = filters.status !== undefined ? filters.status : null;
    const searchTerm = filters.searchTerm || null;
    const sortBy = this.sortBySubject.value || 'created_at';
    const sortOrder = this.sortOrderSubject.value || 'desc';

    let queryParams = `currentPage=${currentPage}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

    if (roles.length > 0) {
      queryParams += `&roles=${roles.join(',')}`;
    }
    if (isActive !== null) {
      queryParams += `&isActive=${isActive}`;
    }
    if (searchTerm) {
      queryParams += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }

    this.userService.fetchUsers(queryParams).subscribe({
      next: (response) => {
        const users = response.data?.users ?? [];
        const totalItems = response.data?.totalItems ?? 0;
        const totalPages = response.data?.totalPages ?? 0;

        this.usersSubject.next(users);
        this.totalItemsSubject.next(totalItems);
        this.totalPagesSubject.next(totalPages);
      },
      error: (err) => {
        const errorMsg = err?.message || 'Error al obtener los usuarios.';
        this.errorUsersSubject.next(errorMsg);
      },
    });
  }

  /**
   * Obtener filtros para rol y estado de usuario.
   */
  fetchFilters(): void {
    this.userService.getFilters().subscribe({
      next: (response) => {
        const filters: Filters = response.data?.filters || { roles: [], statuses: [] };
        this.filtersSubject.next(filters);
      },
      error: (err) => {
        this.filtersSubject.next(null);
      }
    });
  }

  /**
   * Aplicar filtros seleccionados para tener la nueva lista de usuarios.
   */
  applySelectedFilters(filters: SelectedFilters) {
    const combinedFilters = { ...this.selectedFiltersSubject.value, ...filters };
    this.selectedFiltersSubject.next(combinedFilters);
    this.currentPageSubject.next(1);
    this.fetchUsers(1, this.pageSizeSubject.value, combinedFilters);
  }

  /**
   * Resetear filtros a sus valores predeterminados.
   */
  resetFilters(): void {
    const defaultFilters: SelectedFilters = {};
    this.selectedFiltersSubject.next(defaultFilters);
    this.currentPageSubject.next(1);
    this.pageSizeSubject.next(10);
    this.sortBySubject.next('created_at');
    this.sortOrderSubject.next('desc');
    this.fetchUsers(1, 10, {});
  }

  /**
   * Configurar la página actual.
   */
  setCurrentPage(page: number): void {
    this.currentPageSubject.next(page);
    this.fetchUsers(page, this.pageSizeSubject.value, this.selectedFiltersSubject.value || {});
  }

  /**
   * Configurar el orden de los resultados.
   */
  setSortOrder(sortBy: string, sortOrder: 'asc' | 'desc') {
    this.sortBySubject.next(sortBy);
    this.sortOrderSubject.next(sortOrder);

    this.fetchUsers(
      this.currentPageSubject.value,
      this.pageSizeSubject.value,
      this.selectedFiltersSubject.value || {}
    );
  }

  /**
   * Crear un nuevo usuario.
   */
  createUser(userWithRole: UserWithRole): void {
    this.userCreateStatusSubject.next({ status: 'loading', message: 'Creando usuario...' });
    this.userService.createUserWithRole(userWithRole).subscribe({
      next: () => {
        this.userCreateStatusSubject.next({
          status: 'success',
          message: 'Usuario creado con éxito',
        });
        this.resetFilters();
      },
      error: (error) => {
        console.error('🛑 Error recibido de la API:', JSON.stringify(error, null, 2));
        const statusCode = error.status;
        let errorMsg = 'Error al crear el usuario.';
        let fieldErrors: ApiError[] | undefined;
        const apiError = error.error;

        if (statusCode === 0) {
          errorMsg = 'No se pudo conectar al servidor. Verifique su conexión a Internet.';
        } else if (statusCode === 400 && apiError?.errors) {
          errorMsg = apiError.message || 'Errores en la creación del usuario';
          fieldErrors = apiError.errors;
        } else if (statusCode === 409 && apiError?.errors) {
          errorMsg = apiError.message || 'Conflicto: algunos datos ya están registrados.';
          fieldErrors = apiError.errors;
        } else if (statusCode >= 500) {
          errorMsg = 'Error del servidor. Intente nuevamente más tarde.';
        } else if (statusCode >= 400 && statusCode < 500) {
          errorMsg = apiError?.message || 'Error en la solicitud. Verifique los datos enviados.';
        }

        this.userCreateStatusSubject.next({
          status: 'error',
          message: errorMsg,
          statusCode,
          errors: fieldErrors,
        });
      },
    });
  }

  /**
   * Resetear el estado de creación de usuario. - Pendiente Toast
   */
  resetUserCreateStatus(): void {
    this.userCreateStatusSubject.next({ status: 'idle', message: '' });
  }

  /**
   * Obtener un usuario por su ID, reutilizando datos si ya están cargados.
   */
  getUserById(id: number): Observable<UserWithRole> {
    const cachedUser = this.userSelectedSubject.value;

    if (cachedUser && cachedUser.userData.id === id) {
      // Si el usuario ya está cargado, retornamos un observable con los datos existentes
      return new Observable(observer => {
        observer.next(cachedUser);
        observer.complete();
      });
    }

    // Si no está cargado, hacemos la petición y actualizamos el estado
    return this.userService.getUserById(id).pipe(
      map(response => {
        if (!response.data?.user) {
          throw new Error('Usuario no encontrado');
        }

        const userResponse: UserResponse = response.data;
        const userWithRole: UserWithRole = {
          userData: userResponse.user.userData, // Asegurar que sea el dato correcto
          roleData: userResponse.user.roleData // Asegurar que tenga el rol
        };

        this.userSelectedSubject.next(userWithRole);

        return userWithRole;
      })
    );
  }

  /**
   * Actualizar un usuario
   */
  updateUser(id: number, userData: UserWithRole): void {
    this.userUpdateStatusSubject.next({ status: 'loading', message: 'Creando usuario...' });
    this.userService.updateUser(id,userData).subscribe({
      next: () => {
        this.userUpdateStatusSubject.next({
          status: 'success',
          message: 'Usuario actualizado con éxito',
        });
        this.userSelectedSubject.next(null);
        this.resetFilters();
      },
      error: (error) => {
        const statusCode = error.status;
        let errorMsg = 'Error al crear el usuario.';
        let fieldErrors: ApiError[] | undefined;
        const apiError = error.error;

        if (statusCode === 0) {
          errorMsg = 'No se pudo conectar al servidor. Verifique su conexión a Internet.';
        } else if (statusCode === 400 && apiError?.errors) {
          errorMsg = apiError.message || 'Errores en la creación del usuario';
          fieldErrors = apiError.errors;
        } else if (statusCode === 409 && apiError?.errors) {
          errorMsg = apiError.message || 'Conflicto: algunos datos ya están registrados.';
          fieldErrors = apiError.errors;
        } else if (statusCode >= 500) {
          errorMsg = 'Error del servidor. Intente nuevamente más tarde.';
        } else if (statusCode >= 400 && statusCode < 500) {
          errorMsg = apiError?.message || 'Error en la solicitud. Verifique los datos enviados.';
        }

        this.userUpdateStatusSubject.next({
          status: 'error',
          message: errorMsg,
          statusCode,
          errors: fieldErrors,
        });
      }
    });
  }

  // Actualizar el estado de un usuario
  updateUserStatus(id: number, status: boolean): Observable<ProcessStatus> {
    this.userStatusUpdateSubject.next({ status: 'loading', message: 'Actualizando estado...' });
    return this.userService.updateUserStatus(id, status).pipe(
      map(() => {
        const successResponse: ProcessStatus = {
          status: 'success',
          message: 'Estado actualizado con éxito',
        };
        this.userStatusUpdateSubject.next(successResponse);
        return successResponse;
      }),
      catchError((error) => {
        console.error('Error en actualización de estado:', error);

        const errorResponse: ProcessStatus = {
          status: 'error',
          message: error.error?.message || 'Error al actualizar el estado',
          statusCode: error.status,
          errors: error.error?.errors || [],
        };
        this.userStatusUpdateSubject.next(errorResponse);
        return of(errorResponse);
      })
    );
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<ProcessStatus> {
    return this.userService.deleteUser(id).pipe(
      startWith<ProcessStatus>({ status: 'loading', message: 'Eliminando usuario...' }), 
      map(() => ({
        status: 'success',
        message: 'Usuario eliminado con éxito'
      } as ProcessStatus)), 
      catchError((error) =>
        of({
          status: 'error',
          message: error.error?.message || 'Error al eliminar el usuario',
          statusCode: error.status,
          errors: error.error?.errors || []
        } as ProcessStatus) 
      )
    );
  }

  // Eliminar usuarios
  deleteMultipleUsers(payload: any): Observable<ProcessStatus> {
    return this.userService.deleteMultipleUsers(payload).pipe(
      startWith<ProcessStatus>({
        status: 'loading',
        message: `Eliminando ${payload.userIds.length} usuario(s)...`
      }),
      map(() => ({
        status: 'success',
        message: `${payload.userIds.length} usuario(s) eliminado(s) con éxito`
      } as ProcessStatus)),
      catchError((error) =>
        of({
          status: 'error',
          message: error.error?.message || 'Error al eliminar los usuarios',
          statusCode: error.status,
          errors: error.error?.errors || []
        } as ProcessStatus)
      )
    );
  }
  
  triggerClearSelection() {
    this.clearSelectionSubject.next(); 
  }
}
