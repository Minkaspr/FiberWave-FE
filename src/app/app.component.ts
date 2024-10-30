import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const fragment = this.router.url.split('#')[1];
        if (fragment) {
          this.scrollToSection(fragment);
          /*const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }*/
        } else {
          window.scrollTo({ top: 0 });
        }
      }
    });
  }

  ngOnInit(): void {
    initFlowbite();
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
}
