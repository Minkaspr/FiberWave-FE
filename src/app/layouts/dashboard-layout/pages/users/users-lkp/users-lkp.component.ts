import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersDataService } from '../services/users-data.service';

@Component({
  selector: 'app-users-lkp',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './users-lkp.component.html',
  styleUrl: './users-lkp.component.css'
})
export class UsersLkpComponent implements OnInit {
  searchForm: FormGroup;

  constructor(private fb: FormBuilder, private usersDataService: UsersDataService) {
    this.searchForm = this.fb.group({
      searchTerm: ['', [Validators.required, Validators.minLength(2)]]
    });
  }
  ngOnInit(): void {
    this.usersDataService.selectedFilters$.subscribe((filters) => {
      if (filters && Object.keys(filters).length === 0) {
        this.searchForm.patchValue({ searchTerm: '' }, { emitEvent: false });
      }
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const rawValue = this.searchForm.value.searchTerm;
      const sanitizedValue = rawValue
        .trim()
        .replace(/\s+/g, ' ');
      this.usersDataService.applySelectedFilters({ searchTerm: sanitizedValue });
    }
  }
}
