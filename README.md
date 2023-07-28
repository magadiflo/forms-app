# Sección: Formularios Reactivos

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.1.

**NOTA**
> En esta nueva actualización del curso solo vemos **Formularios Reactivos** y no **Formularios por Template**.
> Pero si quiero acceder al proyecto anterior donde trabajamos con **Formularios por Template** ir a la 
> siguiente repositorio [Angular Formularios App (reactivos y template)](https://github.com/magadiflo/angular-formularios-app.git)

## Re-establecer y establecer valor al formulario

En los formularios reactivos tenemos dos maneras de poder resetear sus valores ya sea utilizando ``setValue({...})`` o
utilizando ``reset({...})`` .

### setValue({...})
Reseteamos los campos del formulario, pero **es obligatorio enviarle todos los campos del formulario**, sino nos mostrará un error, solicitandonos valores de los campos faltantes.

```typescript
this.myForm.setValue({ name: 'Nuevo valor por defecto', price: 50, inStorage: 25 });
```


### reset({...})

**[Este es el que usa Fernando Herrera]** Reseteamos el formulario **mandándole únicamente los campos que deseamos establecerle valor.**

> El reset({...}) restablece el control de formulario, **marcándolo como pristine y untouched**, y **restableciendo el valor**. 
> El nuevo valor será el valor proporcionado (si se pasa), nulo o el **valor inicial si se configuró nonNullable** en el constructor a 
> través de **FormControlOptions.**


```typescript
this.myForm.reset({ price: 0, isStorage: 0 });
```

**NOTA**

> Al término **pristine** asociémoslo como **original**, que se mantiene inalterado, puro, tal como era en su forma primera u original.
> Eso signifa que cuando se presenta el formulario por primera vez en pantalla tendrá el **pristine=true** es decir, los datos que se muestran
> son originales, aún el usuario no los ha manipulado. Ahora, si apenas modificamos algún campo, por mínimo que sea el cambio, el pristine
> se colocará en false **pristine=false**, dándonos a entender que los datos presentados **ya no son originales**, el usuario ha manipulado
> los valores.

### reset() con nonNullable - reestablecer valores iniciales

- [Fuente 1](https://angular.io/guide/typed-forms)
- [Fuente 2](https://angular.io/api/forms/FormControl#usage-notes)

Si deseamos establecer siempre los valores iniciales de los campos de nuestro formulario (en lugar de null), podemos **usar la opción nonNullable.**
En mi caso, como estoy utilizando el **formBuilder** para construir los controles del formulario, agregar el **nonNullable** sería de la siguiente manera:

````typescript
public myForm: FormGroup = this._fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0)]],
    inStorage: [0, [Validators.required, Validators.min(0)]],
  });
````

En el código anterior, definimos los valores iniciales par cada campo del formulario, además agregamos el **nonNullable** antes del **group()**,
de manera cuando se haga un **reset()** los valores se reestablecerán a los valores iniciales.

````typescript
onSave(): void {
    if (this.myForm.invalid) return;
    this.myForm.reset();
}
````
En el código anterior estamos usando el **reset()** para resetear el formulario y como **agregamos la opción nonNullable**, se reestablecerá a
sus valores iniciales.

Veamos un ejemplo aplicado a un control tomado de la web oficial de Angular, donde en el segundo apartado usamos la opción **nonNullable**. 
``Si desea que este control no admita valores NULL, puede utilizar la opción nonNullable. Esto hará que el control se restablezca a su valor inicial, en lugar de nulo:``

````typescript
const dog = new FormControl('Nophy');
const thatDog = dog.value; // 'Nopy'

dog.reset();

const whichDog = dog.value; // null

----------------------------------------------------------
Angular v14+ 
----------------------------------------------------------
const dog = new FormControl('Nophy', {nonNullable: true});
const thatDog = dog.value; // 'Nopy'

dog.reset();

const whichDog = dog.value; // 'Nopy'

````


## Métodos de ayuda para los errores

Los campos de los formularios pueden tener muchas validaciones y dependiendo de ellas deberíamos mostrar los mensajes de error correspondientes.

En el formulario de nuestro **basic-page.component.html** agregaremos el siguente código html debamo de cada campo del formulario:

````html
<div>
  <input type="text" class="form-control" formControlName="name">
  <span *ngIf="isNotValidField('name')">
    {{ getErrorMessage('name') }}
  </span>
</div>
<div>
  <input type="number" class="form-control" formControlName="price"">
  <span *ngIf="isNotValidField('price')">
    {{ getErrorMessage('price') }}
  </span>
</div>
<div>
  <input type="number" class="form-control" formControlName="inStorage">
  <span *ngIf="isNotValidField('inStorage')">
    {{ getErrorMessage('inStorage') }}
  </span>
</div>
````
En el código anterior muestro de manera simplificada el código usado, donde, **si el campo no es válido**, ingresamos dentro del span y 
mostramos el mensaje obtenido gracias al método **getErrorMessage('campo')**.

El código en typescript sería el siguiente:

````typescript
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
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();                               // (1)
      return;
    }
    console.log(this.myForm.value);
    this.myForm.reset();
  }

  isNotValidField(field: string): boolean {
    const control = this.myForm.controls[field];
    return control && (control.errors || false) && control.touched; // (2)
  }

  getErrorMessage(field: string): string {
    const control = this.myForm.controls[field];
    const errors = control.errors || {};                            // (3)

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required': return `El campo "${field}" es requerido.`;
        case 'minlength': return `El campo "${field}" requiere mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'min': return `El campo "${field}" requiere como valor mínimo ${errors['min'].min}.`;
      }
    }

    return Object.entries(errors).length === 0 ? '' : `El campo ${field} contiene un valor incorrecto.`; // (4)
  }
}
````
**DONDE**

- **(1)** con esta función marcamos **manualmente** todos los campos como si nosotros hubieramos ido a cada campo y lo hubieramos tocado uno por uno.
  Esto es útil, ya que si el formulario es inválido, nos ayudará a mostrar en cada campo, sus errores.
- **(2)**, dentro de esta línea de código observamos lo siguente **(control.errors || false)**, eso lo colocamos porque cuando el campo **no tiene errores**
  el valor de **control.errors es null** y al colocarle un **|| false**, entonces tomará el valor de **false**.
- **(3)** es similar al punto **(2)**, pero en este caso si el **control.errors es null** el valor que se asignará a la constante errors será el objeto vacío **{}**.
- **(4)** el **Object.entries(mi-objeto)** devuelve un array de valores/clave de las propiedades enumerables de un objeto. Y si en el **(3)** la constante **errors**
  toma el objeto vacío **{}**, entonces con el código que estamos colocando en este punto **(4)** sí sería igual a **cero (0)**.

# Sección: Validaciones

## Validators.required vs Validators.requiredTrue

**Validators.required**, este validador requiere que el control tenga un valor no vacío. Ahora, en el caso de que estemos usando un **checkbox** como en el formulario de la página de los **switches** y tengamos un campo
en nuestro formulario reactivo que tenga la validación **Validators.required** y esté apuntando a este **checkbox**, lo que indicará sera que en el campo del input checkbox **tiene que haber un valor, ya sea true (seleccionado) o false (no seleccionado)**, pero no puede estar vacío o en este caso no puede ser null. El null podría darse cuando nosotros mismos asignamos ese valor como valor inicial del campo.

Parte del formulario html
````html
<input type="checkbox" formControlName="wantNotifications">
````
Parte del formulario reactivo
````typescript
wantNotifications: [true, Validators.required],
````

**Validators.requiredTrue**, este validador requiere que el valor del control sea verdadero. **Este validador se usa comúnmente para las casillas de verificación requeridas.** En pocas palabras, este validador nos dice que el input checkbox **tiene que estar sí o sí en true (seleccionada).**

Parte del formulario html
````html
<input type="checkbox" formControlName="termsAndConditions"">
````
Parte del formulario reactivo
````typescript
termsAndConditions: [false, Validators.requiredTrue]
````

## Destructuración de objetos

En el componente de typescript **SwitchesPageComponent** usamos el siguiente código para destructurar el objeto del valor del formulario:


````typescript
const { termsAndConditions, ...newPerson } = this.myForm.value;
this.person = newPerson;
````

**{ termsAndConditions, ...newPerson }:** La destructuración de objetos se utiliza para extraer propiedades específicas de un objeto en variables independientes. Aquí, tenemos dos partes de la destructuración:

- **termsAndConditions:** Esto extrae el valor del atributo termsAndConditions del objeto **this.myForm.value** y **lo asigna a la variable termsAndConditions.**

- **...newPerson:** El operador de propagación **...** se utiliza para **recopilar el resto de las propiedades en un nuevo objeto llamado newPerson.** Esto significa que **todas las demás propiedades del objeto this.myForm.value** que no se hayan extraído en variables anteriores (como termsAndConditions) **se agruparán en newPerson.**
