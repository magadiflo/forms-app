import { Injectable } from '@angular/core';

import { Region } from '../interfaces/country.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _regions: Region[] = [Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania];

  public get regions(): Region[] {
    return structuredClone(this._regions); //* structuredClone(), crea un nuevo objeto, similar al spread [...this._regions]
  }

  constructor() { }
}
