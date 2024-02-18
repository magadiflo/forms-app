import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor() { }

  public isNotValidField(form: FormGroup, field: string): boolean {
    const control = form.controls[field];
    return control && (control.errors || false) && control.touched;
  }

  public getErrorMessageTwoField(form: FormGroup, field: string, field2?: string): string {
    const control = form.controls[field];
    const errors = control.errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required': return `El campo ${field} es requerido.`;
        case 'minlength': return `El campo ${field} requiere mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'min': return `El campo ${field} requiere como valor mínimo ${errors['min'].min}.`;
        case 'notEqual': return `Los campos ${field} y ${field2} deben ser iguales.`;
        case 'email': return `Formato de email inválido.`;
        case 'emailDomain': return `El dominio ingresado no es válido.`;
      }
    }

    return Object.entries(errors).length === 0 ? '' : `El campo ${field} contiene un valor incorrecto.`;
  }

  public emailDomainValidator(domain: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value as string;
      return email.endsWith(`@${domain}`) ? null : { 'emailDomain': true };
    }
  }
}
