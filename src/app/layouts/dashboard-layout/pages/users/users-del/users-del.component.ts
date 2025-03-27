import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Modal } from 'flowbite';
import { UsersDataService } from '../services/users-data.service';

@Component({
  selector: 'app-users-del',
  standalone: true,
  imports: [],
  templateUrl: './users-del.component.html',
  styleUrl: './users-del.component.css'
})
export class UsersDelComponent implements OnInit, AfterViewInit {
  @Input() id!: number;
  @Input() name!: string;
  @Output() close = new EventEmitter<void>();

  userDeleteModal!: Modal;
  userDeleteModalId!: string;
  isClosingDeleteModal = false;
  isDeleting = false;

  constructor(private usersDataService: UsersDataService) {}
  
  ngOnInit(): void {
    this.userDeleteModalId = `delete-${this.id}-user-modal`;
  }

  ngAfterViewInit(): void {
    this.initFlowbiteModal();
  }

  deleteUserById() {
    this.isDeleting = true;
    this.usersDataService.deleteUser(this.id).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.closeDeleteModal();
        }
        this.isDeleting = false;
        this.usersDataService.resetFilters();
      },
      error: () => {
        console.error('Error al eliminar usuario');
        this.isDeleting = false;
      }
    });
  }

  initFlowbiteModal() {
    const userModalElement = document.getElementById(this.userDeleteModalId);
    if (userModalElement) {
      this.userDeleteModal = new Modal(userModalElement, {
        backdrop: 'static',
        closable: true,
        onHide: () => {
          if (!this.isClosingDeleteModal) {
            this.isClosingDeleteModal = true;
            this.closeDeleteModal();
          }
        }
      });

      this.userDeleteModal.show();
    }
  }

  closeDeleteModal() {
    if (!this.isClosingDeleteModal ) {
      this.isClosingDeleteModal  = true;
      this.userDeleteModal.hide();
    }
    this.close.emit();
  }
}
