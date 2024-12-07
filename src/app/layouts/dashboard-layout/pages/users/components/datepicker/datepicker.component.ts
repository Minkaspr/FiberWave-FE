import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Datepicker } from 'flowbite';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css'
})
export class DatepickerComponent implements AfterViewInit {
  @ViewChild('datepickerInput') datepickerInput!: ElementRef;

  ngAfterViewInit(): void {

    const locales = {
      es: {
        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: "Hoy",
        monthsTitle: "Meses",
        clear: "Borrar",
        weekStart: 1,
        format: "dd/mm/yyyy"
      }
    };

    const applyLocales = () => {
      setTimeout(() => {
        // Obtener instancias activas del Datepicker
        const datepickerEl = this.datepickerInput.nativeElement;
        const datepickerInstance = datepickerEl.datepicker;

        // Configurar locales personalizados
        if (datepickerInstance) {
          Object.assign(datepickerInstance.constructor.locales , locales);
          datepickerInstance.setOptions({ language: 'es' });
        }
      }, 100);
    };

    // Inicializar Datepicker con opciones base
    const today = new Date().toISOString().split('T')[0];
    const options = {
      format: 'dd/mm/yyyy',
      maxDate: today,
      minDate: '01/01/2020',
      orientation: 'top',
      autohide: true,
    };

    new Datepicker(this.datepickerInput.nativeElement, options);

    // Aplicar configuración de idioma
    applyLocales();
  }
}
