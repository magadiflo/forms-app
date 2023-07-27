import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-basic-page',
  templateUrl: './basic-page.component.html',
  styles: [
  ]
})
export class BasicPageComponent {

  public myForm: FormGroup = this._fb.group({
    name: [''],
    price: [0],
    inStorage: [0],
  });

  constructor(private _fb: FormBuilder) { }

  onSave(): void {
    console.log(this.myForm.value);
  }

}
