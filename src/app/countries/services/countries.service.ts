import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SmallCountry, Region, Country } from '../interfaces/country.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _regions: Region[] = [Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania];
  private _apiUrlCountries: string = environment.apiUrlCountries;

  public get regions(): Region[] {
    return structuredClone(this._regions); //* structuredClone(), crea un nuevo objeto, similar al spread [...this._regions]
  }

  constructor(private _http: HttpClient) { }


  getCountriesByRegion(region: Region): Observable<SmallCountry[]> { //* Ver el README.md, se analiza esta función
    if (!region) return of([]);
    const params = new HttpParams().set('fields', 'cca3,name,borders');
    return this._http.get<Country[]>(`${this._apiUrlCountries}/region/${region}`, { params })
      .pipe(
        tap(countries => console.log({ countries })),
        map(countries => countries.map(country => ({ name: country.name.common, cca3: country.cca3, borders: country.borders ?? [] }))),
      )
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry> {
    const params = new HttpParams().set('fields', 'cca3,name,borders');
    return this._http.get<Country>(`${this._apiUrlCountries}/alpha/${alphaCode}`, { params })
      .pipe(
        tap(country => console.log({ country })),
        map(country => ({ name: country.name.common, cca3: country.cca3, borders: country.borders ?? [] })),
      )
  }
}
