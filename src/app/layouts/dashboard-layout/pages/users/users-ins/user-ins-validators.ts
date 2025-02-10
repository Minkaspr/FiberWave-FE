import { AbstractControl, ValidatorFn } from '@angular/forms'

export class UserInsValidators {
  static firstnameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const regex = /^[\p{L}]+(?:\s[\p{L}]+)*$/u;

      const validations = [
        { condition: !value, error: { 'required': true } },
        { condition: value?.length < 3 || value?.length > 128, error: { 'length': true } },
        { condition: value?.startsWith(' ') || value?.endsWith(' '), error: { 'whitespace': true } },
        { condition: !regex.test(value), error: { 'pattern': true } }
      ];

      for (const validation of validations) {
        if (validation.condition) {
          return validation.error;
        }
      }

      return null;
    };
  }

  static lastnameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const regex = /^[\p{L}]+(?:\s[\p{L}]+)*$/u;

      const validations = [
        { condition: !value, error: { 'required': true } },
        { condition: value?.length < 3 || value?.length > 128, error: { 'length': true } },
        { condition: value?.startsWith(' ') || value?.endsWith(' '), error: { 'whitespace': true } },
        { condition: !regex.test(value), error: { 'pattern': true } }
      ];

      for (const validation of validations) {
        if (validation.condition) {
          return validation.error;
        }
      }

      return null;
    };
  }

  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const validations = [
        { condition: !value, error: { 'required': true } },
        { condition: !regex.test(value), error: { 'pattern': true } }
      ];

      for (const validation of validations) {
        if (validation.condition) {
          return validation.error;
        }
      }

      return null;
    };
  }

  static passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      const validations = [
        { condition: !value, error: { 'required': true } },
        { condition: value?.length < 8, error: { 'length': true } },
        { condition: !regex.test(value), error: { 'pattern': true } }
      ];

      for (const validation of validations) {
        if (validation.condition) {
          return validation.error;
        }
      }

      return null;
    };
  }

  static repeatPasswordValidator(passwordFieldName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control.parent; 
      if (!formGroup) return null;

      const passwordControl = formGroup.get(passwordFieldName);
      if (!passwordControl) return null;

      const isMismatch = control.value !== passwordControl.value;
      return isMismatch ? { passwordMismatch: true } : null;
    };
  }

  static noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      const validations = [
        { condition: !value, error: { required: true } }, // Si el campo está vacío, sigue marcándolo como requerido
        { condition: value?.trim().length === 0, error: { required: true } }, // Si solo hay espacios, también es requerido
        { condition: value !== value?.trim(), error: { noWhitespace: true } } // Si hay espacios al inicio o final, error
      ];

      for (const validation of validations) {
        if (validation.condition) {
          return validation.error;
        }
      }

      return null;
    };
  }
}