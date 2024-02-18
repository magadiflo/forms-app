import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inscription-page',
  templateUrl: './inscription-page.component.html',
  styleUrls: ['./inscription-page.component.scss']
})
export class InscriptionPageComponent {

  public myForm: FormGroup = this._fb.group({
    email: [''],
  });

  constructor(private _fb: FormBuilder) { }

  public onSave(): void {
    console.log(this.myForm.value);
    this.myForm.markAllAsTouched();
  }

}
