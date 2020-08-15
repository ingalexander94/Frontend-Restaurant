import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Módulo Rutas
import { AppRoutingModule } from './app-routing.module';

// Módulo Socket.io
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// Módulo Redux
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { OrderComponent } from './components/order/order.component';
import { environment } from '../environments/environment.prod';
import { combineReducer } from './app.reducers';
import { FooterComponent } from './partials/footer/footer.component';
import { NavbarComponent } from './partials/navbar/navbar.component';
import { ChatboxComponent } from './partials/chatbox/chatbox.component';
import { DatesPipe } from './pipes/dates.pipe';

const config: SocketIoConfig = { url: environment.url, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RestaurantComponent,
    OrderComponent,
    FooterComponent,
    NavbarComponent,
    ChatboxComponent,
    DatesPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    StoreModule.forRoot(combineReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
