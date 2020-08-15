import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { userRedux } from './interface/interfaces';
import { SetUserAction } from './reducers/auth/actions/auth.actions';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private store: Store) {}

  // Se dispara cuando se carga todo el componente
  ngOnInit(): void {
    this.isAuthenticated();
  }

  /* 
    - Verificar si un usuario esta autenticado
    - Realiza la petición al servidor Backend para validar autenticación
    - Guardar token renovado en el storage
    - Guardar usuario en Redux
   */
  async isAuthenticated() {
    const body = await this.authService.isAuthenticated();
    const { ok, msg, uid, name, role, token } = body;
    if (ok) {
      localStorage.setItem('token', token);
      const userRedux: userRedux = {
        uid,
        name,
        role,
      };
      this.store.dispatch(new SetUserAction(userRedux));
    } else {
      console.log(msg);
    }
  }
}
