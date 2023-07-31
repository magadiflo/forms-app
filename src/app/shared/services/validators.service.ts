import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  public static firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public static emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  public cantBeStrider = (control: FormControl): ValidationErrors | null => {
    const value: string = (control.value as string).trim().toLowerCase();
    return value === 'strider' ? { noStrider: true } : null;
  }

  public isNotValidField(form: FormGroup, field: string): boolean {
    const control = form.controls[field];
    return control && (control.errors || false) && control.touched;
  }

  getErrorMessage(form: FormGroup, field: string): string {
    return this.getErrorMessageTwoField(form, field);
  }


  getErrorMessageTwoField(form: FormGroup, field: string, field2?: string): string {
    const control = form.controls[field];
    const errors = control.errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required': return `El campo ${field} es requerido.`;
        case 'minlength': return `El campo ${field} requiere mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'min': return `El campo ${field} requiere como valor mínimo ${errors['min'].min}.`;
        case 'notEqual': return `Los campos ${field} y ${field2} deben ser iguales.`;
      }
    }

    return Object.entries(errors).length === 0 ? '' : `El campo ${field} contiene un valor incorrecto.`;
  }

  public isFieldOneEqualFieldTwo(fieldOne: string, fieldTwo: string) {
    return (form: AbstractControl): ValidationErrors | null => {
      const pass1 = form.get(fieldOne)?.value;
      const pass2 = form.get(fieldTwo)?.value;

      const fieldTwoErrors = form.get(fieldTwo)?.errors;

      if (fieldTwoErrors && !form.get(fieldTwo)?.hasError('notEqual')) {
        form.get(fieldTwo)?.setErrors(fieldTwoErrors);
        return fieldTwoErrors;
      }

      let error = null;
      if (pass1 !== pass2) {
        error = { notEqual: true };
      }

      form.get(fieldTwo)?.setErrors(error);
      return error;
    }
  }

}
