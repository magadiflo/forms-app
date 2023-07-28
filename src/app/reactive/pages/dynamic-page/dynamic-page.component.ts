import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-page',
  templateUrl: './dynamic-page.component.html',
  styles: [
  ]
})
export class DynamicPageComponent {

  public myForm: FormGroup = this._fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this._fb.array([ //* <-- Este sí es un arreglo
      ['Fifa 2008', Validators.required], //* <-- Es un formControl pero en versión FormBuilder
      ['Crash Car', Validators.required]
    ]),
  });

  constructor(private _fb: FormBuilder) { }

  public get favoriteGames() {
    return this.myForm.controls['favoriteGames'] as FormArray;
  }


  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    };
    console.log(this.myForm.value);
    this.myForm.reset();
  }

}
