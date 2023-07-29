import { FormControl, ValidationErrors } from "@angular/forms";

export const firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
export const emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

export const cantBeStrider = (control: FormControl): ValidationErrors | null => {
  const value: string = (control.value as string).trim().toLowerCase();
  return value === 'strider' ? { noStrider: true } : null;
}
