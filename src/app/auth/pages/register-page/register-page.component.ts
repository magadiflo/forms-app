import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ValidatorsService } from './../../../shared/services/validators.service';
import { EmailValidatorService } from './../../../shared/validators/email-validator.service';





@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: [
  ]
})
export class RegisterPageComponent {

  public myForm: FormGroup = this._fb.group({
    name: ['', [Validators.required, Validators.pattern(ValidatorsService.firstNameAndLastnamePattern)]],
    email: ['', [Validators.required, Validators.pattern(ValidatorsService.emailPattern)], [this._emailValidatorService]],
    username: ['', [Validators.required, this._validatorsService.cantBeStrider]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    'password-confirm': ['', [Validators.required]],
  });

  constructor(
    private _fb: FormBuilder,
    private _validatorsService: ValidatorsService,
    private _emailValidatorService: EmailValidatorService) { }

  onSave(): void {
    this.myForm.markAllAsTouched();
  }

  isNotValidField(field: string) {
    return this._validatorsService.isNotValidField(this.myForm, field);
  }

}
