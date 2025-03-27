import { AfterViewInit, Component, ElementRef, Input, ViewChild, forwardRef, Optional, Inject } from '@angular/core';
import { Datepicker } from 'flowbite';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ControlContainer } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})

export class DatepickerComponent implements AfterViewInit, ControlValueAccessor {
  @Input() minDate: string | null = null;
  @Input() maxDate: string | null = null;
  @Input() orientation: string = 'top';
  @Input() format: string = 'dd/mm/yyyy';
  @Input() id: string = 'datepicker-custom';

  @ViewChild('datepickerInput', { static: true }) datepickerInput!: ElementRef;

  private datepickerInstance!: Datepicker;
  private _value: string | null = null;
  private _lastErrorState: boolean = false;

  constructor(@Optional() private controlContainer: ControlContainer, private datePipe: DatePipe) { }

  get control(): FormControl | null {
    const controlName = this.id; // Usa el `id` como el nombre del control
    if (this.controlContainer && controlName) {
      const formGroup = this.controlContainer.control;
      return formGroup?.get(controlName) as FormControl;
    }
    return null;
  }

  writeValue(value: string | null): void {
    this._value = value;
    /* if (value) {
      this.setSelectedDate(value);
    } */
    if (value) {
      // Convertir la fecha al formato esperado (dd/mm/yyyy)
      const formattedDate = this.datePipe.transform(value, 'dd/MM/yyyy');
      
      if (formattedDate) {
        this._value = formattedDate;
        this.setSelectedDate(formattedDate);
      }
    } else {
      this._value = null;
      this.setSelectedDate('');
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.datepickerInput) {
      this.datepickerInput.nativeElement.disabled = isDisabled;
    }
  }

  private onChange: (value: string | null) => void = () => { };
  onTouched: () => void = () => { };

  ngAfterViewInit(): void {
    this.initializeDatepicker();
    this.applyLocales();
  }

  private initializeDatepicker(): void {
    if (!this.datepickerInput) {
      console.error('El elemento datepickerInput no está inicializado');
      return;
    }

    const options = {
      format: this.format,
      maxDate: this.maxDate,
      minDate: this.minDate,
      orientation: this.orientation,
      autoSelectToday: 1,
      autohide: true,
    };

    this.datepickerInstance = new Datepicker(this.datepickerInput.nativeElement, options);

    if (this._value) {
      this.setSelectedDate(this._value);
    }

    this.datepickerInput.nativeElement.addEventListener('changeDate', () => {
      const selectedDate = this.getSelectedDate();
      this.updateValue(selectedDate || null);
    });
  }

  private updateValue(value: string | null): void {
    this._value = value;
    this.onChange(value);
    const control = this.control;
    if (control) {
      control.setValue(value);
      control.markAsTouched();
    }
  }

  private applyLocales(): void {
    setTimeout(() => {
      const locales = this.getLocales();
      const datepickerEl = this.datepickerInput.nativeElement;
      const datepickerInstance = datepickerEl.datepicker;

      if (datepickerInstance) {
        Object.assign(datepickerInstance.constructor.locales, locales);
        datepickerInstance.setOptions({ language: 'es' });
      }
    }, 100);
  }

  get hasError(): boolean {
    // Aseguramos que isInvalid siempre sea un booleano
    const isInvalid = (this.control?.touched && this.control?.invalid) ?? false;
    // Solo logueamos cuando el estado cambia
    if (isInvalid !== this._lastErrorState) {
      //console.log('hasError:', isInvalid);
      this._lastErrorState = isInvalid;  // Guardamos el último estado para evitar logs repetidos
    }

    return isInvalid;
  }

  // Detectar cambios en el valor del input
  onInputChange(): void {
    // Actualizamos el valor del control al escribir
    const value = this.datepickerInput.nativeElement.value;
    this.updateValue(value);

    // Actualizamos el estado de error
    if (value === '' && this.control?.touched) {
      this._lastErrorState = true;
    } else if (this.control?.valid) {
      this._lastErrorState = false;
    }
  }

  /* getSelectedDate(): string | undefined {
    return this.datepickerInstance?.getDate() as string | undefined;
  } */

  setSelectedDate(date: string): void {
    this.datepickerInstance?.setDate(date);
  }

  private getLocales() {
    return {
      es: {
        days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        today: 'Hoy',
        monthsTitle: 'Meses',
        clear: 'Borrar',
        weekStart: 1,
        format: 'dd/mm/yyyy',
      },
    };
  }

  getSelectedDate(): string | undefined {
    const date = this.datepickerInstance?.getDate(); // Puede ser string | Date | string[] | undefined
  
    if (!date) return undefined;
  
    if (Array.isArray(date)) {
      console.error("Error: Datepicker devolvió un array inesperado", date);
      return undefined;
    }
  
    try {
      // Si date es un string, intenta convertirlo a Date
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return this.datePipe.transform(parsedDate, 'yyyy-MM-dd') ?? undefined;
      }
    } catch (error) {
      console.error("Error al parsear la fecha:", error);
    }
  
    console.error("Error: Tipo de fecha desconocido", date);
    return undefined;
  }
  
}
