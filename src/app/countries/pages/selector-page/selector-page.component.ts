import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  public borders: string[] = [];
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
        switchMap(alphaCode => this._countriesService.getCountryByAlphaCode(alphaCode))
      )
      .subscribe(country => {
        console.log({ country });
        this.borders = country.borders;
      });
  }

}
