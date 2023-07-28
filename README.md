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
````
En el código anterior estamos usando el **reset()** para resetear el formulario y como agregamos la opción nonNullable, se reestablecerá a ´
sus valores iniciales.
