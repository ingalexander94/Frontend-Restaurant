import { Injectable } from '@angular/core';
import { fetchWithoutToken, fetchWithToken } from '../helpers/fetch';
import User from '../interface/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  createAccount = async (user: User) => {
   try {
    const res = await fetchWithoutToken("api/auth/new", "POST", user);
    const data = await res.json();
    return data;
   } catch (error) {
     console.log(error);
   }
  }

  loginUser = async (user: User) => {
    try {
     const res = await fetchWithoutToken("api/auth", "POST", user);
     const data = await res.json();
     return data;
    } catch (error) {
      console.log(error);
    }
   }

  isAuthenticated = async() => {
    try {
      const res = await fetchWithToken("api/auth/renew-token");
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

}
