import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { pluck, filter } from 'rxjs/operators';
import { AppState } from '../../app.reducers';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnDestroy {
  // Observables
  authSubscription: Subscription = new Subscription();

  constructor(
    public wsService: WebsocketService,
    private store: Store<AppState>
  ) {}

  // Se dispara cuando se carga todo el componente
  ngOnInit(): void {
  /* 
    - Obtener información del usuario autenticado desde Redux
    - Configurar usuario autenticado en el servidor de socket
  */
    this.authSubscription = this.store
      .select('auth')
      .pipe(
        pluck('user'),
        filter((user) => user !== null)
      )
      .subscribe((user) => {
        this.wsService.loginWS(user.name, user.uid);
      });
  }

 // Se dispara cuando se destruye el componente
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
