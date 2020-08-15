import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}

  async canActivate(){
    const res = await this.authService.isAuthenticated();
    if(res.ok && res.role === "Administrador" ){
      return true;
    }else{
      this.router.navigate(["/"]);
      return false;
    }
  }
}
