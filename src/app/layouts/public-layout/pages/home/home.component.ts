import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroComponent } from "./components/hero/hero.component";
import { PromoComponent } from "./components/promo/promo.component";
import { ServicesComponent } from "./components/services/services.component";
import { PriceComponent } from "./components/price/price.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, PromoComponent, ServicesComponent, PriceComponent],
  template: `
    <app-hero id="hero"/>
    <app-promo />
    <app-services id="services"/>
    <app-price id="price"/>
  `,
  styles: ``
})
export class HomeComponent implements OnInit{
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.fragment.subscribe(fragmentId => {
      this.navigateTo(fragmentId);
    })
  }

  navigateTo(selectorId:any){
    document.getElementById(selectorId)?.scrollIntoView({behavior:'smooth'})
  }
}
