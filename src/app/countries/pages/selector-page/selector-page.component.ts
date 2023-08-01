import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/country.interfaces';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit, OnDestroy {

  private _regionSubscription$: Subscription | undefined;

  public myForm: FormGroup = this._fb.nonNullable.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    borders: ['', [Validators.required]],
  });

  public get regions(): Region[] {
    return this._countriesService.regions;
  }

  constructor(
    private _fb: FormBuilder,
    private _countriesService: CountriesService) { }

  ngOnInit(): void {
    this._onRegionChange();
  }

  ngOnDestroy(): void {
    this._regionSubscription$?.unsubscribe();
  }

  private _onRegionChange(): void {
    this._regionSubscription$ = this.myForm.get('region')?.valueChanges
      .subscribe(region => {
        console.log({ region });
      });
  }

}
