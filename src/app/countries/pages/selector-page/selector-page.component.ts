import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription, filter, switchMap, tap } from 'rxjs';

import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit, OnDestroy {

  private _regionSubscription$: Subscription | undefined;
  private _countrySubscription$: Subscription | undefined;

  public borders: SmallCountry[] = [];
  public countriesByRegion: SmallCountry[] = [];
  public myForm: FormGroup = this._fb.nonNullable.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    border: ['', [Validators.required]],
  });

  public get regions(): Region[] {
    return this._countriesService.regions;
  }

  constructor(
    private _fb: FormBuilder,
    private _countriesService: CountriesService) { }

  ngOnInit(): void {
    this._onRegionChange();
    this._onCountryChange();
  }

  ngOnDestroy(): void {
    this._regionSubscription$?.unsubscribe();
    this._countrySubscription$?.unsubscribe();
  }

  onSave(): void {
    console.log(this.myForm.value);
    this.myForm.reset();
  }

  private _onRegionChange(): void {
    this._regionSubscription$ = this.myForm.get('region')?.valueChanges
      .pipe(
        tap(() => this.myForm.controls['country'].reset()), //* Para resetear el segundo selector
        tap(() => this.borders = []),
        switchMap(region => this._countriesService.getCountriesByRegion(region))
      )
      .subscribe((countries: SmallCountry[]) => {
        this.countriesByRegion = countries;
      });
  }

  private _onCountryChange(): void {
    this._countrySubscription$ = this.myForm.get('country')?.valueChanges
      .pipe(
        tap(() => this.myForm.controls['border'].reset()),
        filter((alphaCode: string) => alphaCode.trim().length > 0), //* Solo hacemos la petición si no viene vacío
        switchMap(alphaCode => this._countriesService.getCountryByAlphaCode(alphaCode)),
        switchMap(country => this._countriesService.getCountryBordersByCodes(country.borders)),
        tap(countries => countries.length > 0 ? this._addValidators('border', Validators.required) : this._removeValidators('border', Validators.required)), //* Cuando un país no tiene bordes, que el formulario sea válido
      )
      .subscribe(countries => {
        this.borders = countries;
      });
  }

  private _removeValidators(field: string, validators: ValidatorFn | ValidatorFn[]) {
    this.myForm.controls[field].removeValidators(validators);
    this._updateValueAndValidity(field);
  }

  private _addValidators(field: string, validators: ValidatorFn | ValidatorFn[]) {
    this.myForm.controls[field].addValidators(validators);
    this._updateValueAndValidity(field);
  }

  private _updateValueAndValidity(field: string) {
    this.myForm.controls[field].updateValueAndValidity();
  }
}
