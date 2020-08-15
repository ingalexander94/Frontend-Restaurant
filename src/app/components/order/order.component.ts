import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { userRedux } from '../../interface/interfaces';
import {
  SetReceptorClass,
  UnsetReceptorClass,
} from '../../reducers/chat/actions/chat.actions';
import { AppState } from '../../app.reducers';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit, OnDestroy {
  // Observables
  adminOnlineSubscription: Subscription = new Subscription();

  // Variables
  userAdmin: userRedux = null;

  constructor(
    private chatService: ChatService,
    private store: Store<AppState>
  ) {}

  // Se dispara cuando se carga todo el componente
  ngOnInit(): void {
    /* 
    - Emitir petición al servidor Sockets para solicitar el administrador en linea
    - Escuchar del servidor sockets cuando un administrador se conecte / desconecte
    - Agregar y quitar la información del administrador en linea de Redux
    */
   this.chatService.emitAdminOnline();
   const adminObs = this.chatService.getAdminOnline();
    this.adminOnlineSubscription = adminObs.subscribe((admin: any) => {
      if (admin !== null) {
        this.activateReceptor(admin.idDB, admin.name, admin.id);
        this.userAdmin = admin;
      } else {
        this.userAdmin = null;
        this.store.dispatch(new UnsetReceptorClass());
      }
    });
  }

  // Se dispara cuando se destruye el componente
  ngOnDestroy(): void {
    this.adminOnlineSubscription.unsubscribe();
  }

  // Guarda el usuario activo en el chat en Redux
  activateReceptor(idDB, name, idSocket) {
    const receptor: userRedux = {
      uid: idDB,
      name,
      role: 'Cliente',
      idSocket,
    };
    this.store.dispatch(new SetReceptorClass(receptor));
  }
}
