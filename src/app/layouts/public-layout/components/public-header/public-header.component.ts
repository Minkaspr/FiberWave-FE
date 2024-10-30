import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.css'
})
export class PublicHeaderComponent implements OnInit{
  activeUrl: string | null = null;
  activeFragment: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveFragment();
      }
    });
    this.setActiveFragment();
  }

  setActiveFragment(): void {
    const url = this.router.url.split('#');
    this.activeUrl = url[0];
    this.activeFragment = url[1] || 'hero';
  }

  isActive(url: string, fragment: string | null = null): boolean {
    if (fragment) {
      return this.activeUrl === url && this.activeFragment === fragment;
    }
    return this.activeUrl === url;
  }
}
