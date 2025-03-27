import { AfterViewInit, Component, ComponentRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UsersUpdComponent } from "../../users-upd/users-upd.component";
import { UsersDetComponent } from "../../users-det/users-det.component";
import { UsersDelComponent } from "../../users-del/users-del.component";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements AfterViewInit{
  @Input() id!: number;
  @Input() name!: string;
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  componentRef!: ComponentRef<any>;
  
  ngAfterViewInit(): void {
    initFlowbite();
  }

  async loadComponent(type: string) {
    // Limpiamos el contenedor para que solo haya un modal activo a la vez
    this.container.clear();

    // Importamos y creamos el componente dinámicamente
    let component: any;
    if (type === 'details') {
      component = UsersDetComponent;
    } else if (type === 'edit') {
      component = UsersUpdComponent;
    } else if (type === 'delete') {
      component = UsersDelComponent;
    }

    if (component) {
      this.componentRef = this.container.createComponent(component);
      // Pasamos el `id` a todos los componentes
      this.componentRef.instance.id = this.id;

      // Solo pasamos el `name` si el componente es UsersDelComponent 
      if (type === 'delete' && this.componentRef.instance.hasOwnProperty('name')) {
        this.componentRef.instance.name = this.name;
      }

      // Escuchar el evento "actionEvent" solo en UsersDetComponent
      if (type === 'details' && this.componentRef.instance.actionEvent) {
        this.componentRef.instance.actionEvent.subscribe((action: string) => {
          this.loadComponent(action); // Abre el nuevo modal
        });
      }

      // Si el componente tiene un evento "close", lo escuchamos para destruirlo
      if (this.componentRef.instance.close) {
        this.componentRef.instance.close.subscribe(() => this.destroyComponent());
      }
    }
  }

  destroyComponent() {
    this.container.clear(); // Borra el modal cuando se cierra
  }
}
