import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../app.config';
import { SummaryResponse } from './openai.type';
import { Observable } from 'rxjs';


export interface StandardResponse<T> {
  success: boolean;
  data: T;
}
@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  readonly #http = inject(HttpClient);
  readonly #apiUrl = inject(apiUrl);



  combinedVectorAndAnalysis(year: number, month: number): Observable<StandardResponse<SummaryResponse>> {
    return this.#http.get<StandardResponse<SummaryResponse>>(`${this.#apiUrl}/openaianalyses?year=${year}&month=${month}`);
  }

}
