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

  public phoneNumberValidator(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phone = control.value as string;
      //* Definimos los criterios de validación del phone usando expresión regular
      const phonePattern = new RegExp(`^[0-9]{${length}}$`);
      return phonePattern.test(phone) ? null : { 'phoneNumber': true };
    }
  }

  public urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const url = control.value as string;
      //* Definimos los criterios de validación de la url usando expresión regular
      const urlPattern = /^((http|https|ftp):\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
      return urlPattern.test(url) ? null : { 'url': true };
    }
  }

  public dateFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const date = control.value as string;
      //* Definimos el formato de validación de la fecha usando expresión regular
      const datePattern = /^\d{4}-\d{2}-\d{2}$/; //* Example: YYYY-MM-DD
      return datePattern.test(date) ? null : { 'dateFormat': true };
    }
  }

  public equalityValidator(controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const confirmPassword = control.value as string;
      const passwordControl = control.parent?.get(controlName);
      return (passwordControl && confirmPassword !== passwordControl.value) ? { 'equality': true } : null;
    }
  }

  public fileTypeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const image = control.value as string;
      const extension = image?.slice(image?.lastIndexOf('.') + 1).toLowerCase();
      return (image && allowedTypes.includes(extension)) ? null : { 'fileTypeValidation': true };
    }
  }

  //* Otra forma de definir las funciones

  public creditCardValidator = (control: AbstractControl): ValidationErrors | null => {
    const cardNumber = control.value as string;
    //* Definimos criterios de validación de la tarjeta de crédito usando expresión regular
    const cardPattern = /^4[0-9]{12}(?:[0-9]{3})?$/; //* Example: Visa card
    return cardPattern.test(cardNumber) ? null : { 'creditCard': true };
  }

  public numericValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    //* Define criterios de validación de números usando expresión regular
    const numericPattern = /^\d+$/;
    return numericPattern.test(value) ? null : { 'numeric': true };
  }
}
