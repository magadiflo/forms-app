import { FormControl } from "@angular/forms";

export const cantBeStrider = (control: FormControl) => {
  const value: string = (control.value as string).trim().toLowerCase();
  return value === 'strider' ? { noStrider: true } : null;
}
