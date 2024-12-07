import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ApiConfigService } from './services/api-config.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private apiConfigService: ApiConfigService, private http: HttpClient) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const fragment = this.router.url.split('#')[1];
        if (fragment) {
          this.scrollToSection(fragment);
        } else {
          window.scrollTo({ top: 0 });
        }
      }
    });
  }

  ngOnInit(): void {
    initFlowbite();
    this.checkApiHealth();
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    const headerOffset = 60; // Ajusta este valor según el tamaño de tu header.
    const elementPosition = section?.getBoundingClientRect().top ?? 0;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  checkApiHealth(): void {
    this.apiConfigService.checkHealth().subscribe(
      response => {
        console.log('API Health Check:', response.message);
      },
      error => {
        console.error('API Health Check failed:', error);
      }
    );
  }
}
