import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-switches-page',
  templateUrl: './switches-page.component.html',
  styles: [
  ]
})
export class SwitchesPageComponent implements OnInit {

  public myForm: FormGroup = this._fb.nonNullable.group({
    gender: ['M', Validators.required],
    wantNotifications: [true, Validators.required],
    termsAndConditions: [false, Validators.requiredTrue]
  });

  //* Suponiendo que esta información viene de algún API y es el que queremos establecer en el formulario
  public person = {
    gender: 'F',
    wantNotifications: false,
  }

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm.reset(this.person);
  }

  onSave(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log(this.myForm.value);

    //* Suponiendo que queremos enviar this.person al backend. Si lo asignamos directamente a this.myForm.value
    //* le agregará el termsAndConditions, lo que para nuestro caso, no requerimos.
    const { termsAndConditions, ...newPerson } = this.myForm.value;
    this.person = newPerson;

    console.log(this.person);

    this.myForm.reset();
  }

  isNotValidField(field: string): boolean {
    const control = this.myForm.controls[field];
    return control && (control.errors || false) && control.touched;
  }

}
