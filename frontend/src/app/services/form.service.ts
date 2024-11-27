import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let month = startMonth; month <= 12; month++) {
      data.push(month)
    }

    return of(data);
  }

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetCountriesResponse>(`${this.baseUrl}/countries`).pipe(
      map( resp => resp._embedded.countries
    ))
  }

  getStates(): Observable<State[]>{
    return this.httpClient.get<GetStatesResponse>(`${this.baseUrl}/countries`).pipe(
      map( resp => resp._embedded.states
    ))
  }

  getStatesByCountryCode(countryCode: string): Observable<State[]>{
    const searchUrl = `${this.baseUrl}/states/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetStatesResponse>(searchUrl).pipe(
      map( resp => resp._embedded.states
    ))
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear = new Date().getFullYear();
    const endYear = startYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      data.push(year)
    }

    return of(data);
  }
}

interface GetCountriesResponse{
  _embedded: {
    countries: Country[];
  }
}

interface GetStatesResponse{
  _embedded: {
    states: State[]
  }
}
