import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { DashboardHeaderComponent } from "./components/dashboard-header/dashboard-header.component";
import { DashboardSidebarComponent } from "./components/dashboard-sidebar/dashboard-sidebar.component";

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, DashboardHeaderComponent, DashboardSidebarComponent],
  template: `
    <div class="antialiased bg-gray-50 dark:bg-gray-900">
      <app-dashboard-header/>
      <app-dashboard-sidebar/>
      <main class="p-4 lg:ml-64 min-h-screen pt-20">
        <router-outlet/>
        
      </main>
    </div>
  `,
  styles: ``
})
export class DashboardLayoutComponent implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }
}
