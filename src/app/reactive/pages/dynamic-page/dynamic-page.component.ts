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

  //* Necesario agregar la validación para que cuando se dé en el botón agregar, éste se evalúe con el if y no pase
  public newFavorite: FormControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });

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

    this.favoriteGames.clear();
    this.myForm.reset();
  }

  onAddToFavorites(): void {
    if (this.newFavorite.invalid) return;

    //* No mandamos directamente al arreglo el newFavorite ya que podríamos mantener la referencia de la variable dentro del arreglo
    //* y eso podría traer problemas más adelante. Entonces, se opta por crear un nuevo objeto (formControl) y pasarle el valor del newFavorite

    console.log(this.newFavorite.value);
    const newGame = this.newFavorite.value;

    //*Con el this._fb.control(), creamos un new FormControl, usando FormBuilder
    this.favoriteGames.push(this._fb.control(newGame, [Validators.required]));
    this.newFavorite.reset();
  }

  onDeleteFavorite(index: number): void {
    this.favoriteGames.removeAt(index);
  }

  isNotValidField(field: string): boolean {
    const control = this.myForm.controls[field];
    return control && (control.errors || false) && control.touched;
  }

  isNotValidFieldArray(formArray: FormArray, index: number): boolean {
    const control = formArray.controls[index];
    return control && (control.errors || false) && control.touched;
  }

  getErrorMessage(field: string): string {
    const control = this.myForm.controls[field];
    const errors = control.errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required': return `El campo "${field}" es requerido.`;
        case 'minlength': return `El campo "${field}" requiere mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'min': return `El campo "${field}" requiere como valor mínimo ${errors['min'].min}.`;
      }
    }

    return Object.entries(errors).length === 0 ? '' : `El campo ${field} contiene un valor incorrecto.`;
  }

  getErrorMessageArray(formArray: FormArray, index: number): string {
    const control = formArray.controls[index];
    const errors = control.errors || {};
    const field = '';

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required': return `El campo ${field} es requerido.`;
        case 'minlength': return `El campo ${field} requiere mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'min': return `El campo ${field} requiere como valor mínimo ${errors['min'].min}.`;
      }
    }

    return Object.entries(errors).length === 0 ? '' : `El campo ${field} contiene un valor incorrecto.`;
  }

}
