import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-page',
  templateUrl: './basic-page.component.html',
  styles: [
  ]
})
export class BasicPageComponent {

  public myForm: FormGroup = this._fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0)]],
    inStorage: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(private _fb: FormBuilder) { }

  onSave(): void {
    if (this.myForm.invalid) return;
    console.log(this.myForm.value);
    this.myForm.reset();
  }

}
