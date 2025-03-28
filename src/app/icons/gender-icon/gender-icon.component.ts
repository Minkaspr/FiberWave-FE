import { Component } from '@angular/core';

@Component({
  selector: 'app-gender-icon',
  standalone: true,
  imports: [],
  template: `
    <svg  xmlns="http://www.w3.org/2000/svg"  
      width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  
      stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  
      class="icon icon-tabler icons-tabler-outline icon-tabler-gender-bigender">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M11 11m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      <path d="M19 3l-5 5" /><path d="M15 3h4v4" /><path d="M11 16v6" /><path d="M8 19h6" />
    </svg>
  `,
  styles: ``
})
export class GenderIconComponent {

}
