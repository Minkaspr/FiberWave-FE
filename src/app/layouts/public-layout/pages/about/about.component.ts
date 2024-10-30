import { Component } from '@angular/core';
import { PortfolioComponent } from "./components/portfolio/portfolio.component";
import { BlogComponent } from "./components/blog/blog.component";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [PortfolioComponent, BlogComponent],
  template: `
    <app-portfolio/>
    <app-blog/>
  `,
  styles: ``
})
export class AboutComponent {

}
