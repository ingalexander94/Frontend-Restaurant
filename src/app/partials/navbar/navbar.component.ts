import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { pluck, filter } from 'rxjs/operators';
import { UnsetUserAction } from '../../reducers/auth/actions/auth.actions';
import { AppState } from '../../app.reducers';
import { ChatService } from '../../services/chat.service';
import { UnsetReceptorClass, UnsetConversationClass } from '../../reducers/chat/actions/chat.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Observables
  authSubscription: Subscription = new Subscription();

  //  Variables
  name: string = '';

  constructor(private store: Store<AppState>, private router: Router, private chatService: ChatService) {}

  // Se dispara cuando se carga todo el componente
  ngOnInit(): void {
    //Obtener información del usuario autenticado desde Redux
    this.authSubscription = this.store
      .select('auth')
      .pipe(
        pluck('user'),
        filter((user) => user !== null)
      )
      .subscribe((user) => (this.name = user.name));
  }

  // Se dispara cuando se destruye el componente
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  /*
  - Se dispara desde el html al hacer click en el botón salir
  - Borra el token del storage
  - Borra el usuario autenticado en el Redux
  - Redirecciona el usuario a iniciar sesión
  */
  logout = () => {
    localStorage.removeItem('token');
    this.store.dispatch(new UnsetUserAction());
    this.store.dispatch(new UnsetReceptorClass());
    this.store.dispatch(new UnsetConversationClass());
    this.chatService.clearSocket();
    this.router.navigate(['/']);
  };
}
