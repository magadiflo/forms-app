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

  public isFieldOneEqualFieldTwo(fieldOne: string, fieldTwo: string) {
    return (form: AbstractControl): ValidationErrors | null => {
      const fieldOneValue = form.get(fieldOne)?.value;
      const fieldTwoValue = form.get(fieldTwo)?.value;

      console.log({ fieldOneValue, fieldTwoValue });

      let error = null;
      if (fieldOneValue !== fieldTwoValue) {
        error = { notEqual: true };
      }

      form.get(fieldTwo)?.setErrors(error);
      return error;
    }
  }

}
