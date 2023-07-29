import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { cantBeStrider } from '../../../shared/validators/validators';



@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: [
  ]
})
export class RegisterPageComponent {

  public myForm: FormGroup = this._fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    username: ['', [Validators.required, cantBeStrider]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    'password-confirm': ['', [Validators.required]],
  });

  constructor(private _fb: FormBuilder) { }

  onSave(): void {
    this.myForm.markAllAsTouched();
  }

  isInvalidField(field: string) {
    // TODO: Obtener validación desde un servicio
  }

}
