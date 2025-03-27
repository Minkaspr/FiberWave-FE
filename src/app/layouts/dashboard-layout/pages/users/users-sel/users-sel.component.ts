import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsersDataService } from '../services/users-data.service';
import { User } from '../../../../../models/user.model';
import { initFlowbite } from 'flowbite';
import { CommonModule, DatePipe } from '@angular/common';
import { DropdownComponent } from "../components/dropdown/dropdown.component";

@Component({
  selector: 'app-users-sel',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  providers: [DatePipe],
  templateUrl: './users-sel.component.html',
  styleUrl: './users-sel.component.css'
})

export class UsersSelComponent implements OnInit {

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  users: User[] = [];
  totalItems: number = 0;
  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;

  errorMessage: string | null = null;

  sortedColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Orden inicial

  constructor(
    private usersDataService: UsersDataService,
    private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.usersDataService.fetchUsers();
    this.subscribeToDataUpdates();
  }

  // Método para subscribirse a las actualizaciones de datos de paginación
  subscribeToDataUpdates(): void {
    this.usersDataService.users$.subscribe({
      next: (data) => {
        this.users = this.transformUserDates(data); 
        this.cdRef.detectChanges();
        console.log('Usuarios actualizados:', this.users);
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
    this.usersDataService.currentPage$.subscribe((page) => (this.currentPage = page));
    this.usersDataService.pageSize$.subscribe((size) => (this.pageSize = size));
    this.usersDataService.totalPages$.subscribe(totalPages => {
      this.totalPages = totalPages;
    });

    this.usersDataService.totalItems$.subscribe(totalItems => {
      this.totalItems = totalItems;
    });

    this.usersDataService.errorUsers$.subscribe({
      next: (errorMsg) => {
        this.errorMessage = errorMsg;
        if (errorMsg) {
          //console.error('Error recibido:', errorMsg);
        }
      },
    });
  }

  // Método para transformar las fechas de los usuarios
  private transformUserDates(users: User[]): User[] {
    return users.map(user => ({
      ...user,
      created_at: user.created_at && !isNaN(new Date(user.created_at).getTime())
        ? this.datePipe.transform(new Date(user.created_at), 'dd MMM yyyy, hh:mm a') || user.created_at
        : user.created_at, // Dejar el valor original
      updated_at: user.updated_at && !isNaN(new Date(user.updated_at).getTime())
        ? this.datePipe.transform(new Date(user.updated_at), 'medium') || user.updated_at
        : user.updated_at, // Dejar el valor original
    }));
  }

  getDisplayedRangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  // Método para cambiar la página
  onPageChange(page: string | number): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.usersDataService.setCurrentPage(page);
      // Espera a que los datos se carguen y luego desplaza el scroll
      setTimeout(() => {
        if (this.tableContainer) {
          const headerOffset = 62 + 8; // Altura del header (62px) + separación (8px)
          const elementPosition = this.tableContainer.nativeElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }

  getVisiblePages(): (string | number)[] {
    const visiblePages: (string | number)[] = [];
    const { currentPage, totalPages } = this;

    if (totalPages <= 7) {
      // Mostrar todas las páginas si el total es menor o igual a 7
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
      return visiblePages;
    }

    // Si la página actual está cerca del inicio (diferencia <= 4)
    if (currentPage <= 4) {
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        visiblePages.push(i);
      }
      if (totalPages > 5) visiblePages.push('...', totalPages);
      return visiblePages;
    }

    // Si la página actual está cerca del final (diferencia <= 4)
    if (currentPage >= totalPages - 3) {
      visiblePages.push(1, '...');
      for (let i = Math.max(totalPages - 4, 1); i <= totalPages; i++) {
        visiblePages.push(i);
      }
      return visiblePages;
    }

    // En cualquier otro caso (aplicar 7 botones)
    visiblePages.push(1, '...');
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      visiblePages.push(i);
    }
    visiblePages.push('...', totalPages);

    return visiblePages;
  }

  isPreviousDisabled(): boolean {
    return this.currentPage === 1;
  }

  isNextDisabled(): boolean {
    return this.currentPage === this.totalPages;
  }

  /* sortTable(column: string): void {
    if (this.sortedColumn === column) {
      // Alternar el orden si es la misma columna
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es una nueva columna, reiniciar a ascendente
      this.sortedColumn = column;
      this.sortOrder = 'asc';
    }

    // Imprimir en consola para debug
    console.log(`Ordenando por: ${column}, Orden: ${this.sortOrder}`);

    // Ordenar la tabla en memoria
    this.users.sort((a, b) => {
      const aValue = a[column as keyof User];
      const bValue = b[column as keyof User];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0; // Para casos en los que no se puedan comparar directamente
    });
  } */
  sortTable(column: string): void {
    if (this.sortedColumn === column) {
      // Alternar el orden si es la misma columna
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es una nueva columna, reiniciar a ascendente
      this.sortedColumn = column;
      this.sortOrder = 'asc';
    }

    // Actualizar el orden en el servicio
    this.usersDataService.setSortOrder(this.sortedColumn, this.sortOrder);

    console.log(`Ordenando por: ${column}, Orden: ${this.sortOrder}`);
  }

  getProcessedName(user: User): string {
    const firstName = user.firstname.split(' ')[0]; // Tomar solo el primer nombre
    const lastName = user.lastname; // Apellido completo
    return `${firstName} ${lastName}`; // Concatenar con un espacio
  }
}
