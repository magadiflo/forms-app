import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService implements AsyncValidator {

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    const httpCallObservable = new Observable<ValidationErrors | null>((subscriber) => {
      console.log({ email });
      if (email === 'magadiflo@gmail.com') {
        subscriber.next({ emailTaken: true });
        subscriber.complete();
      }
      subscriber.next(null);
      subscriber.complete();
    })
      .pipe(
        delay(5000)
      );
    return httpCallObservable;
  }

  // validate(control: AbstractControl): Observable<ValidationErrors | null> {
  //   const email: string = control.value;
  //   console.log(email);
  //   return this.http.get<any[]>(`http://127.0.0.1:3000/usuarios?q=${email}`)
  //     .pipe(
  //       delay(2500), // Simulando retardo de 2.5 seg. para ver el estado del formulario
  //       map(resp => {
  //         return resp.length === 0 ? null : { emailTomado: true }
  //       }),
  //     );
  // }

}
