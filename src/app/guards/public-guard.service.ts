import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuardService {

  constructor(private authService: AuthService, private router: Router){}

  async canActivate(){
    const res = await this.authService.isAuthenticated();
    if(!res.ok ){
      return true;
    }else{
      const route = res.role === "Cliente" ? "/pedidos" : "/restaurante";
      this.router.navigate([route]);
      return false;
    }
  }
}
