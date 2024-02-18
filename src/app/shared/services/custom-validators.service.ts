import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  public emailDomainValidator(domain: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value as string;
      return email.endsWith(`@${domain}`) ? null : { 'emailDomain': true };
    }
  }

  public passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value as string;
      //* Definimos los criterios de seguridad de la contraseña usando una expresión regular
      const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return strongPasswordPattern.test(password) ? null : { 'passwordStrength': true };
    }
  }
}
