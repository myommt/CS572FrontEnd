import { effect, Injectable, signal } from '@angular/core';

export type GlobalState = {
  email: string,
  _id: string,
  jwt: string;
};

export const initial_state = {
  email: '',
  _id: '',
  jwt: ''
};

@Injectable({
  providedIn: 'root'
})
export class StateService {
  $state = signal<GlobalState>(initial_state);

  myeffect = effect(() => {
    localStorage.setItem('LOGIN_STATE', JSON.stringify(this.$state()));
  });

  isLoggedIn() {
    //return this.$state()._id ? true : false;

    return true;
  }
}
