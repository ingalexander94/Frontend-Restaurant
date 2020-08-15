import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { OrderComponent } from './components/order/order.component';
import { ClientGuardService } from './guards/client-guard.service';
import { RestaurantGuardService } from './guards/restaurant-guard.service';
import { PublicGuardService } from './guards/public-guard.service';


const routes: Routes = [
  {path: "",canActivate:[PublicGuardService] , component: LoginComponent},
  {path: "nuevo",canActivate:[PublicGuardService] , component: RegisterComponent},
  {path: "restaurante", canActivate:[RestaurantGuardService], component: RestaurantComponent},
  {path: "pedidos", canActivate:[ClientGuardService], component: OrderComponent},
  {path: "**", component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
