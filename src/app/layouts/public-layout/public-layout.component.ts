import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { PublicHeaderComponent } from "./components/public-header/public-header.component";
import { PublicFooterComponent } from "./components/public-footer/public-footer.component";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterModule, PublicHeaderComponent, PublicFooterComponent],
  template: `
    <app-public-header/>
    <router-outlet/>
    <app-public-footer/>
  `,
  styles: ``
})
export class PublicLayoutComponent implements OnInit{
  ngOnInit(): void {
    initFlowbite();
  }
}
