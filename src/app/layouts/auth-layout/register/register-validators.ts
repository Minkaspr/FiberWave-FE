import { AbstractControl, ValidatorFn } from '@angular/forms'

export class RegisterValidators {
  static surnameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const regex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

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
      const regex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

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
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

      const validations = [
        { condition: !value, error: { 'required': true } },
        { condition: value?.length < 6, error: { 'length': true } },
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

  static confirmPasswordValidator(password: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = control.root.get(password);

      const validations = [
        { condition: passwordControl && control.value !== passwordControl.value, error: { 'passwordMismatch': true } }
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