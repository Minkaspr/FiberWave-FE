import { AfterViewInit, Component, Input } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UsersUpdComponent } from "../../users-upd/users-upd.component";
import { UsersDetComponent } from "../../users-det/users-det.component";
import { UsersDelComponent } from "../../users-del/users-del.component";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [UsersUpdComponent, UsersDetComponent, UsersDelComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements AfterViewInit{
  @Input() id!: string | number;
  
  ngAfterViewInit(): void {
    initFlowbite();
  }
}
