import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { showNotification } from 'src/app/alerts/alerts';
import { environment } from '../../../environments/environment';
import User from '../../interface/interfaces';
import { userRedux } from '../../interface/interfaces';
import { SetUserAction } from '../../reducers/auth/actions/auth.actions';
import { StartLoadingAction, FinishLoadingAction } from '../../reducers/ui/actions/ui.actions';
import { AppState } from '../../app.reducers';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  // Observables
  uiSubscription: Subscription = new Subscription();

  // Variables
  private emailPattern: any = environment.emailExpReg; // Expresión regular para validar correos

  client: User = {
    name: '',
    email: '',
    role: '',
    password: '',
  };

  loading: boolean = false; // Bandera para saber si algo se esta cargando

  // Formularios reactivos
  formRegister: FormGroup;
  createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      password: new FormControl('', [
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
    this.formRegister = this.createForm();
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
   - Se dispara desde el html al hacer click en el botón de Crear cuenta
   - Activar bandera de carga en el Redux
   - Obtener información del usuario a crear
   - Enviar petición al servidor backend para crear usuario
   [ OK ]
   - Guardar el token en el storage
   - Guardar usuario en el Redux
   - Redireccionar al usuario según su rol
   - Desactivar bandera de carga
   - Mostrar notificación de exito
   [ERROR]
   - Desactivar bandera de carga
   - Mostrar notificación de error
  */
  async createClient() {
    this.store.dispatch(new StartLoadingAction());
    this.client = {
      ...this.formRegister.value,
      role: 'Cliente',
    };
    const body = await this.authService.createAccount(this.client);
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
      this.resetFormRegister();
      this.store.dispatch(new FinishLoadingAction());
      this.chatService.openSocket();
      showNotification('success', msg);
    } else {
      this.store.dispatch(new FinishLoadingAction());
      showNotification('error', msg);
    }
  }

  // Borrar información del formulario reactivo
  resetFormRegister() {
    this.formRegister.reset();
  }

  // Getters
  get name() {
    return this.formRegister.get('name');
  }
  get email() {
    return this.formRegister.get('email');
  }
  get password() {
    return this.formRegister.get('password');
  }
}
