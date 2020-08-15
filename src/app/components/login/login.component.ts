import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import User from '../../interface/interfaces';
import { userRedux } from '../../interface/interfaces';
import { SetUserAction } from '../../reducers/auth/actions/auth.actions';
import {
  StartLoadingAction,
  FinishLoadingAction,
} from '../../reducers/ui/actions/ui.actions';
import { AppState } from '../../app.reducers';
import { showNotification } from 'src/app/alerts/alerts'; 
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // Observables
  uiSubscription: Subscription = new Subscription();

  // Variables
  private emailPattern: any = environment.emailExpReg; // Expresión regular para validar correos

  client: User = {
    email: '',
    password: '',
    role: '',
  };

  loading: boolean = false; // Bandera para saber si algo se esta cargando

  // Formularios reactivos
  formLogin: FormGroup;
  createForm(): FormGroup {
    return new FormGroup({
      email: new FormControl('adminrestaurant@gmail.com', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      password: new FormControl('123456', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.formLogin = this.createForm();
  }

  // Se dispara cuando se carga todo el componente 
  ngOnInit(): void {
    // Obtener información de la interfaz de usuario en el Redux
    this.uiSubscription = this.store
      .select('ui')
      .subscribe((ui) => (this.loading = ui.loading));
  }

  // Se dispara cuando se destruye el componente
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  /* 
   - Se dispara desde el html al hacer click en el botón de iniciar sesión
   - Activar bandera de carga en el Redux
   - Obtener información del usuario a autenticar
   - Enviar petición al servidor backend para autenticar usuario
   [ OK ]
   - Guardar el token en el storage
   - Guardar usuario en el Redux
   - Redireccionar al usuario según su rol
   - Desactivar bandera de carga
   - Abrir conexion con el socket
   - Mostrar notificación de exito
   [ERROR]
   - Desactivar bandera de carga
   - Mostrar notificación de error
  */
  async login() {
    this.store.dispatch(new StartLoadingAction());
    this.client = {
      ...this.formLogin.value,
      role:
        this.formLogin.value.email === 'adminrestaurant@gmail.com'
          ? 'Administrador'
          : 'Cliente',
    };
    const body = await this.authService.loginUser(this.client);
    const { ok, msg, uid, name, role, token } = body;
    if (ok) {
      localStorage.setItem('token', token);
      const userRedux: userRedux = {
        uid,
        name,
        role,
      };
      this.store.dispatch(new SetUserAction(userRedux));
      const route = role === 'Cliente' ? '/pedidos' : '/restaurante';
      this.router.navigate([route]);
      this.resetFormLogin();
      this.store.dispatch(new FinishLoadingAction());
      showNotification('success', msg);
      this.chatService.openSocket();
    } else {
      this.store.dispatch(new FinishLoadingAction());
      showNotification('error', msg);
    }
  }

  // Borrar información del formulario reactivo
  resetFormLogin() {
    this.formLogin.reset();
  }

  // Getters
  get email() {
    return this.formLogin.get('email');
  }
  get password() {
    return this.formLogin.get('password');
  }
}
