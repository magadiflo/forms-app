import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomValidatorsService } from './../../../shared/services/custom-validators.service';

@Component({
  selector: 'app-inscription-page',
  templateUrl: './inscription-page.component.html',
  styleUrls: ['./inscription-page.component.scss']
})
export class InscriptionPageComponent {

  public myForm: FormGroup = this._fb.group({
    email: ['martin@gmail.com', [Validators.required, Validators.email, this._customValidators.emailDomainValidator('gmail.com')]],
  });

  constructor(
    private _fb: FormBuilder,
    private _customValidators: CustomValidatorsService) { }

  public onSave(): void {
    console.log(this.myForm.value);
    this.myForm.markAllAsTouched();
  }

  isNotValidField(field: string) {
    return this._customValidators.isNotValidField(this.myForm, field);
  }

  getErrorMessage(field: string, field2?: string): string {
    return this._customValidators.getErrorMessageTwoField(this.myForm, field, field2);
  }

}
