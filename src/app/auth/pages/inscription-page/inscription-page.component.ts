import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomValidatorsService } from './../../../shared/services/custom-validators.service';
import { getErrorMessageTwoField, isNotValidField } from 'src/app/shared/services/custom-validators-fields';

@Component({
  selector: 'app-inscription-page',
  templateUrl: './inscription-page.component.html',
  styleUrls: ['./inscription-page.component.scss']
})
export class InscriptionPageComponent {

  public myForm: FormGroup = this._fb.group({
    email: ['martin@gmail.com', [Validators.required, Validators.email, this._customValidators.emailDomainValidator('gmail.com')]],
    password: ['aA12345@55', [Validators.required, this._customValidators.passwordStrengthValidator()]],
    phone: ['943852968', [Validators.required, this._customValidators.phoneNumberValidator(9)]],
    url: ['http://www.google.com/seach=videos', [Validators.required, this._customValidators.urlValidator()]],
    date: ['2024-08-02', [Validators.required, this._customValidators.dateFormatValidator()]]
  });

  constructor(
    private _fb: FormBuilder,
    private _customValidators: CustomValidatorsService) { }

  public onSave(): void {
    console.log(this.myForm.value);
    this.myForm.markAllAsTouched();
  }

  isNotValidField(field: string) {
    return isNotValidField(this.myForm, field);
  }

  getErrorMessage(field: string, field2?: string): string {
    return getErrorMessageTwoField(this.myForm, field, field2);
  }

}
