import { AfterViewInit, Component, Input } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements AfterViewInit{
  @Input() id!: string | number;
  
  ngAfterViewInit(): void {
    initFlowbite();
  }
}
