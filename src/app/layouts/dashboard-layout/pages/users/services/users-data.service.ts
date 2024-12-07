import { inject, Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../../../../../models/user.model';
import { Filters, SelectedFilters } from '../../../../../models/user-filter.model';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {
  private userService = inject(UsersService);

  // Estado interno de datos
  private usersSubject = new BehaviorSubject<User[]>([]);
  private errorUsersSubject = new BehaviorSubject<string | null>(null);
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private totalPagesSubject = new BehaviorSubject<number>(1);
  private currentPageSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(10);
  private sortBySubject = new BehaviorSubject<string>('created_at');
  private sortOrderSubject = new BehaviorSubject<'asc' | 'desc'>('desc');
  private filtersSubject = new BehaviorSubject<Filters | null>(null);
  private selectedFiltersSubject = new BehaviorSubject<SelectedFilters | null>(null);

  // Observables públicos
  public users$ = this.usersSubject.asObservable();
  public errorUsers$ = this.errorUsersSubject.asObservable();
  public totalItems$ = this.totalItemsSubject.asObservable();
  public totalPages$ = this.totalPagesSubject.asObservable();
  public currentPage$ = this.currentPageSubject.asObservable();
  public pageSize$ = this.pageSizeSubject.asObservable();
  public sortBy$ = this.sortBySubject.asObservable();
  public sortOrder$ = this.sortOrderSubject.asObservable();
  public filters$ = this.filtersSubject.asObservable();
  public selectedFilters$ = this.selectedFiltersSubject.asObservable();

  fetchUsers(
    currentPage: number = this.currentPageSubject.value,
    pageSize: number = this.pageSizeSubject.value,
    filters: SelectedFilters = {}
  ): void {
    const roles = filters.roles || [];
    const isActive = filters.status !== undefined ? filters.status : null;
    const searchTerm = filters.searchTerm || null;
    const sortBy = this.sortBySubject.value;
    const sortOrder = this.sortOrderSubject.value;

    this.userService.fetchUsers(currentPage, pageSize, roles, isActive, searchTerm, sortBy, sortOrder).subscribe({
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
        console.error('Error en fetchUsers:', err);
      },
    });
  }

  fetchFilters() {
    this.userService.getFilters().subscribe({
      next: (response) => {
        const filters: Filters = response.data?.filters || { roles: [], statuses: [] };
        this.filtersSubject.next(filters);
      },
      error: (err) => {
        console.error('Error al obtener filtros:', err);
        this.filtersSubject.next(null);
      }
    });
  }

  applySelectedFilters(filters: SelectedFilters) {
    const combinedFilters = { ...this.selectedFiltersSubject.value, ...filters };
    this.selectedFiltersSubject.next(combinedFilters);
    this.currentPageSubject.next(1);
    this.fetchUsers(1, this.pageSizeSubject.value, combinedFilters);
  }

  resetFilters(): void {
    const defaultFilters: SelectedFilters = {};
    this.selectedFiltersSubject.next(defaultFilters);
    this.currentPageSubject.next(1);
    this.pageSizeSubject.next(10);
    this.sortBySubject.next('created_at');
    this.sortOrderSubject.next('desc');
    this.fetchUsers(1, 10, {});
  }

  setCurrentPage(page: number): void {
    this.currentPageSubject.next(page);
    this.fetchUsers(page, this.pageSizeSubject.value, this.selectedFiltersSubject.value || {});
  }

  setSortOrder(sortBy: string, sortOrder: 'asc' | 'desc') {
    this.sortBySubject.next(sortBy);
    this.sortOrderSubject.next(sortOrder);
  
    this.fetchUsers(
      this.currentPageSubject.value,
      this.pageSizeSubject.value,
      this.selectedFiltersSubject.value || {}
    );
  }

  // Obtener usuario por ID
  getUserById(id: number): Observable<User> {
    return this.userService.getUserById(id).pipe(
      map(response => {
        if (!response.data?.user) {
          throw new Error('User no encontrado');
        }
        return response.data.user;
      }),
      //catchError(this.handleError.bind(this))
    );
  }

  // Crear un nuevo usuario
  createUser(userData: User): Observable<User> {
    return this.userService.createUser(userData).pipe(
      map(response => {
        if (!response.data?.user) {
          throw new Error('Error al crear el usuario');
        }
        return response.data.user;
      }),
      //catchError(this.handleError.bind(this))
    );
  }

  // Actualizar un usuario
  updateUser(id: number, userData: User): Observable<void> {
    return this.userService.updateUser(id, userData).pipe(
      map(() => { }),
      //catchError(this.handleError.bind(this))
    );
  }
}
