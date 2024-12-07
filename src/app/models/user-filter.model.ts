export interface RoleFilter {
  name: string;
  userCount: string;
}

export interface StatusFilter {
  is_active: boolean;
  userCount: number;
}

export interface Filters {
  roles: RoleFilter[];
  statuses: StatusFilter[];
  searchTerm?: string;
}

export interface FiltersResponse {
  filters: Filters;
}

export interface SelectedFilters {
  roles?: string[];
  status?: boolean;
  searchTerm?: string;
}