import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StandardResponse, User } from './user.type';
import { environment } from '../../environments/environment.development';
import { apiUrl } from '../app.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  readonly #http = inject(HttpClient);
  readonly #apiUrl = inject(apiUrl);

  signin(user: User): Observable<StandardResponse<{ token: string; }>> {
    return this.#http.post<{ success: boolean, data: { token: string; }; }>(this.#apiUrl + '/users/signin', user);
  };

  signup(data: FormData): Observable<StandardResponse<string>> {
    console.log(data);
    return this.#http.post<{ success: boolean, data: string; }>(this.#apiUrl + '/users/signup', data);
  };
  changePassword(oldPassword: string, newPassword: string): Observable<StandardResponse<string>> {
    return this.#http.post<StandardResponse<string>>(`${this.#apiUrl}/users/changepassword`, { oldPassword, newPassword });
  }
}
