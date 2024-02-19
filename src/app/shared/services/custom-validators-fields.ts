import { FormGroup } from "@angular/forms";

export function isNotValidField(form: FormGroup, field: string): boolean {
  const control = form.controls[field];
  return control && (control.errors || false) && control.touched;
}

export function getErrorMessageTwoField(form: FormGroup, field: string, field2?: string): string {
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
      case 'passwordStrength': return `El password debe contener: al menos una letra minúscula,
                                        al menos una letra mayúscula, al menos un dígito,
                                        al menos un carácter especial entre @, $, !, %, *, ?, & y
                                        la longitud mínima de la contraseña debe ser de 8 caracteres.`;
      case 'phoneNumber': return `El campo ${field} debe contener exactamente 9 números.`;
    }
  }

  return Object.entries(errors).length === 0 ? '' : `El campo ${field} contiene un valor incorrecto.`;
}
