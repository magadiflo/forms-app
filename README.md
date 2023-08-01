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


## Verificar que dos campos sean iguales

Antes de ver la validación de los campos iguales, veamos lo siguiente:

````typescript
public myForm: FormGroup = this._fb.group({
    name: ['', [Validators.required, Validators.pattern(ValidatorsService.firstNameAndLastnamePattern)]], // Validaciones aplicadas a nivel de control control
    email: ['', [Validators.required, Validators.pattern(ValidatorsService.emailPattern)], [this._emailValidatorService]],
    username: ['', [Validators.required, this._validatorsService.cantBeStrider]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    'password-confirm': ['', [Validators.required]],
  }, { // Este nuevo objeto es para validar a nivel de formulario.
    validators: [ ] // Las funciones que escribamos dentro de este validators, tendrán implícitamente todo el formulario
  });
````

### Validaciones a nivel de control

En el código anterior podemos observar que cada campo tiene sus propias validaciones, a eso le llamaremos 
**validaciones (síncronas o asíncronas) a nivel de control**. Por ejemplo:

````typescript
email: ['', [Validators.required, Validators.pattern(ValidatorsService.emailPattern)], [this._emailValidatorService]],
````
Observamos que las validaciones aplicadas al campo **email** solo serán para el campo **email**, y no a los otros 
controles (otros campos).

### Validaciones a nivel de formulario

Observando el código del formulario proporcionado, vemos que luego del objeto que contiene todos los campos 
del formulario, agregamos otro objeto, ese nuevo objeto será para **realizar validaciones a nivel de formulario**.
Además, estamos usando la key **validators** de ese objeto para realizar nuestras validaciones **síncronas**. 
Todas las funciones de validación que escribamos dentro del arreglo de **validators** 
**tendrán implícitamente todo el formulario y sus campos.**

### ¿Por qué utilizaremos la validación a nivel de formulario para validar las contraseñas iguales?

Porque para realizar la validación de contraseñas iguales **requerimos dos campos (password y password-confirm)**.

### Agregando validador a nivel de formulario

En nuestro ejemplo, vamos a verificar si los campos de las contraseñas son iguales, para eso creamos una función en
en nuestro servicio y le pasamos el nombre de nuestros campos a validar.

````typescript
{
  validators: [this._validatorsService.isFieldOneEqualFieldTwo('password', 'password-confirm')]
});
````

En nuestro servicio definimos la función anterior tal como sigue:

````typescript
public isFieldOneEqualFieldTwo(fieldOne: string, fieldTwo: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      return null;
    }
}
````
Ahora, como decíamos la función **tendrá de manera implícita todo el formulario y sus campos** y eso lo podemos
observar en la función anterior, vemos que el return está devolviendo una función del tipo 
**ValidationErrors | null**, pero que recibe **implícitamente** por parámetro el formulario completo en la
variable **formGroup** que es del tipo **AbstractControl**. 

> **AbstractControl:** Esta es la **clase base para FormControl, FormGroup y FormArray.**
> Proporciona parte del comportamiento compartido que tienen todos los controles y grupos de controles, como ejecutar
> validadores, calcular el estado y restablecer el estado. También define las propiedades que se comparten entre todas
> las subclases, como valor, válido y sucio. No debe ser instanciado directamente.

### Solución de Fernando Herrera para validar si dos campos son iguales

Finalmente, la función completa que evalúa si dos campos son iguales o no:

````typescript
public isFieldOneEqualFieldTwo(fieldOne: string, fieldTwo: string) {
  return (form: AbstractControl): ValidationErrors | null => {
    const fieldOneValue = form.get(fieldOne)?.value;
    const fieldTwoValue = form.get(fieldTwo)?.value;

    console.log({ fieldOneValue, fieldTwoValue });

    let error = null;
    if (fieldOneValue !== fieldTwoValue) {
      error = { notEqual: true };
    }

    form.get(fieldTwo)?.setErrors(error); // El campo 2 será el que recibirá el error
    return error;
  }
}
````

### Mi solución para validar si dos campos son iguales

En la solución de Fernando Herrera, únicamente se evalúa si los campos no son iguales y eso está bien, pero en su 
solución siempre está retornando esa única validación **o es { notEqual: true } o es null.** Pero si vamos a nuestro 
formulario donde tenemos el control del **password-confirm** veremos lo siguiente:

```typescript
public myForm: FormGroup = this._fb.group({
    'password-confirm': ['', [Validators.required, Validators.minLength(6)]],
  },{/*...*/});
```

O sea, vemos que nuestro campo **password-confirm** incluye varios validadores, en nuestro caso agregamos dos más:
**required y el minLength(6)**, pero con la validación que hace Fernando, siempre envía la validación 
**{notEqual: true} o null**, mientras que las validaciones **required y  minLength(6)** se pierden.

Para solucionar el problema, hice una modificación en el código de Fernando, para que nos retorne todas las 
validaciones conforme se vayan produciendo los errores, por ejemplo: Si hace touch el campo password-confirm y
luego sale, debería ocurrir la validación del **required** y si luego escribe, por ejemplo, 4 caracteres y luego sale, la 
validación a ocurrir es el del **minLength(6)**, y finalmente si escribe 6 a más caracteres, allí recién debería
evaluar nuestra validación del **notEquals**.

```typescript
public isFieldOneEqualFieldTwo(fieldOne: string, fieldTwo: string) {
    return (form: AbstractControl): ValidationErrors | null => {
      const pass1 = form.get(fieldOne)?.value;
      const pass2 = form.get(fieldTwo)?.value;

      const fieldTwoErrors = form.get(fieldTwo)?.errors;

      if (fieldTwoErrors && !form.get(fieldTwo)?.hasError('notEqual')) {
        form.get(fieldTwo)?.setErrors(fieldTwoErrors);
        return fieldTwoErrors;
      }

      let error = null;
      if (pass1 !== pass2) {
        error = { notEqual: true };
      }

      form.get(fieldTwo)?.setErrors(error);
      return error;
    }
  }
```

# Sección: Formularios Reactivos - Múltiples selectores anidados

## Unsubscribe de la subscripción al observable

En Angular, cuando te suscribes a un observable utilizando el método subscribe(), es importante asegurarte de **desuscribirte (unsubscribe) adecuadamente para evitar pérdidas de memoria y potenciales problemas de rendimiento.** La desuscripción se realiza para liberar los recursos asociados al observable y evitar que continúe emitiendo valores cuando ya no es necesario.

Una forma de poder desubscribirnos de un observable es **almacenando la subcripción en una variable del tipo Subscription** luego utilizar el método del ciclo de vida **onDestroy()** para realizar la desubscripción:

````typescript
export class SelectorPageComponent implements OnInit, OnDestroy {

  private _regionSubscription$: Subscription | undefined;
  public myForm: FormGroup = this._fb.nonNullable.group({/* more code */});

  ngOnInit(): void {
    this._regionSubscription$ = this.myForm.get('region')?.valueChanges
      .subscribe(region => {
        console.log({ region });
      });
  }

  ngOnDestroy(): void {
    this._regionSubscription$?.unsubscribe();
  }
}
````

En el ejemplo anterior, estamos realizando un **subcribe()** al campo del formulario llamado **region** que es un **selector**. Podemos realizar ese
subscribe ya que el **valueChanges** es un **Observable** y se disparará cada vez que el campo **region** detecte cambios. El subscribe lo podemos almacenar en una
variable del tipo **Subscription** que luego en el método **ngOnDestroy()** lo utilizamos para realizar el **unsubscribe()**.

## Http Client Module - ¿Dónde realizar la importación de este módulo?

En este apartado quiero remarcar **dónde debemos hacer la importación del HttpClientModule** para trabajar con el **HttpClient** dentro de nuestro servicio **CountriesService**.

Observemos nuestra clase de servicio que ya tiene inyectada el **HttpClient** por constructor:

````typescript
@Injectable({
  providedIn: 'root' //<-- Provee el servicio a nivel global o raíz del proyecto
})
export class CountriesService {

  constructor(private _http: HttpClient) { } //<--- Inyectando el HttpClient

}
````
Como observamos en el código anterior, **Angular hará inyección de dependencia del HttpClient vía constructor.** Esta clase nos permite realizar peticiones http hacia el backend, pero para que funcione debemos hacer la importación del **HttpClientModule**, la pregunta es **¿dónde debemos hacer la importación de ese módulo?**.

Como nuestra clase de servicio **CountriesService** tiene la anotación **@Injectable()** con un **providedIn: 'root'** eso significa que el módulo **sí o sí debe estar importada en el app.module.ts** ya que es el módulo raíz y a eso hace referencia el **root**.

Recordemos que nuestro servicio **CountriesService está dentro del directorio /countries** y dicho directorio tiene su propio módulo **countries.module.ts**, la pregunta es **¿por qué no improtar el HttpClientModule en dicho módulo?**, la respuesta es que si hacemos eso, ocurrirá el siguiente error:

````bash
src_app_countries_countries_module_ts.js:2  ERROR Error: Uncaught (in promise): NullInjectorError: R3InjectorError(CountriesModule)[CountriesService -> CountriesService -> HttpClient -> HttpClient]: 
  NullInjectorError: No provider for HttpClient!
NullInjectorError: R3InjectorError(CountriesModule)[CountriesService -> CountriesService -> HttpClient -> HttpClient]: 
  NullInjectorError: No provider for HttpClient!
````

El error ocurre porque nuestro **CountriesService** no está definido a nivel del módulo **countries.module.ts** sino a **nivel raíz (root)** es por eso que cuando trata de inyectar el **HttpClient** no lo encuentra definido en el módulo **app.module.ts**. Ahora, si quisiéramos que el **CountriesService** esté definido a nivel del módulo donde se vaya a usar, en nuestro caso, por ejemplo definirlo a nivel del módulo **countries.module.ts** y no a nivel global (root) lo que podríamos hacer sería utilizar la anotación ``@Injectable()`` **sin el atributo providedIn='root'** y ahora para registrarlo en el módulo **countries.module.ts** debemos agregarlo en la opción de providers, veamos el ejemplo:


````typescript
@Injectable() // <-- Sin el atributo providedIn='root'
export class CountriesService {

  constructor(private _http: HttpClient) { }  //<--- Inyectando el HttpClient

}
````
````typescript
import { CountriesService } from './services/countries.service';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CountriesRoutingModule,
    HttpClientModule            //<-- Importamos el módulo HttpClientModule que será usado en este módulo CountriesModule
  ],
  providers: [CountriesService] //<-- Declaramos el servicio que usaremos en este módulo
})
export class CountriesModule { }
````
