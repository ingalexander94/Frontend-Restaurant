import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { pluck, filter } from 'rxjs/operators';
import { scrollDown, soundChat } from '../../helpers/scroll';
import { orderArray, reordenarArray, createArrayId } from '../../helpers/array';
import { showNotification, questionAlert } from 'src/app/alerts/alerts';
import { userRedux, Convesation } from '../../interface/interfaces';
import {
  SetReceptorClass,
  SetConversationClass,
  LoadConversationClass,
} from '../../reducers/chat/actions/chat.actions';
import { UnsetConversationClass, UnsetReceptorClass } from '../../reducers/chat/actions/chat.actions';
import { AppState } from '../../app.reducers';
import { ChatService } from '../../services/chat.service';
import { StartLoadingAction, FinishLoadingAction } from '../../reducers/ui/actions/ui.actions';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
})
export class RestaurantComponent implements OnInit, OnDestroy {
  // Observables
  usersOnlineSubscription: Subscription = new Subscription();
  authSubscription: Subscription = new Subscription();
  uiSubscription: Subscription = new Subscription();
  chatSubscription: Subscription = new Subscription();
  newMessageSubscription: Subscription = new Subscription();

  // Variables
  loading: boolean;
  usersOnline: any[];
  conversation: Convesation[];
  receptor: userRedux;
  userInAuth: userRedux;

  // Formularios reactivos
  formMessage: FormGroup;
  createForm = (): FormGroup => {
    return new FormGroup({
      text: new FormControl('', Validators.required),
    });
  };

  constructor(
    private chatService: ChatService,
    private store: Store<AppState>
  ) {
    this.formMessage = this.createForm();
  }

  // Se dispara cuando se carga todo el componente
  ngOnInit(): void {
    // Emitir y escuchar los clientes en linea
    this.chatService.emitClientsOnline();
    const userObs = this.chatService.getClientOnline();
    this.usersOnlineSubscription = userObs.subscribe(
      (users: []) => (this.usersOnline = users)
    );

    // Obtener información de la interfaz
    this.uiSubscription = this.store.select("ui").subscribe(ui => this.loading = ui.loading);

    // Obtener información del usuario autenticado
    this.authSubscription = this.store
      .select('auth')
      .pipe(
        pluck('user'),
        filter((user) => user !== null)
      )
      .subscribe((user) => (this.userInAuth = user));

    // Obtener la conversación y el usuario activo en el chat de Redux
    this.chatSubscription = this.store.select('chat').subscribe((chat) => {
      this.receptor = chat.receptor;
      this.conversation = chat.conversation;
    });

    /* 
    - Se dispara cuando llega un nuevo mensaje privado
    - Si el nuevo mensaje hace parte de la conversación activa se guarda en Redux
    - Si el nuevo mensaje hace parte de otra conversación se agrega indicador de mensaje nuevo en la interfaz
   */
    this.newMessageSubscription = this.chatService
      .getPrivateMessage()
      .subscribe((msg: Convesation) => {
        if (this.receptor !== null && msg.sender === this.receptor.uid) {
          this.store.dispatch(new SetConversationClass(msg));
        } else {
          soundChat();
          this.usersOnline = reordenarArray(this.usersOnline, msg.sender);
          document.getElementById(msg.sender).classList.remove('d-none');
        }
        scrollDown('chat-box');
      });
  }

  // Se dispara cuando se destruye el componente
  ngOnDestroy(): void {
    this.usersOnlineSubscription.unsubscribe;
    this.authSubscription.unsubscribe;
    this.chatSubscription.unsubscribe;
    this.newMessageSubscription.unsubscribe;
    this.uiSubscription.unsubscribe;
  }

  /* 
    - Quitar indicador de mensaje nuevo en la interfaz
    - Guarda el usuario activo en el chat en Redux
   */
  activateReceptor(idDB, name, idSocket) {
    document.getElementById(idDB).classList.add('d-none');
    const receptor: userRedux = {
      uid: idDB,
      name,
      role: 'Cliente',
      idSocket,
    };
    this.store.dispatch(new SetReceptorClass(receptor));
    this.loadMessages(idDB, this.userInAuth.uid);
  }

  /* 
    - Limpiar conversaciones
    - Realizar petición para obtener la conversación entre el administrador y el usuario activo en el chat
    - Ordenar mensajes por fecha de envio para mostrarlos en el orden en que fueron enviados
    - Agregar el historial de la conversación a Redux
  */
  async loadMessages(sender, receiver) {
    this.store.dispatch(new UnsetConversationClass());
    const conversation = await this.chatService.loadConversation(
      sender,
      receiver
    );
    if (conversation.ok) {
      const orderConversation = orderArray(conversation.mensajes);
      this.store.dispatch(new LoadConversationClass(orderConversation));
      scrollDown('chat-box');
    }
  }

  /* 
    - Se dispara cuando se envia un mensaje
    - Crear estructura del mensaje
    - Agregar el mensaje a Redux
    - Enviar el mensaje
  */
  async sendMessage() {
    if (this.formMessage.valid && this.receptor !== null) {
      const { text } = this.formMessage.value;
      const { uid } = this.userInAuth;
      const { uid: id, idSocket } = this.receptor;
      const date = new Date();

      const newMessage: Convesation = {
        text,
        receiver: id,
        sender: uid,
        date,
        id: idSocket,
      };
      const newMsg = await this.chatService.sendMessagePrivate(newMessage);
      newMessage._id = newMsg.uid;
      this.store.dispatch(new SetConversationClass(newMessage));
      this.resetForm();
      scrollDown('chat-box');
    }
  }
 
  /* 
    - Se dispara cuando se elimina una conversación
    - Guardar id de mensajes en un array
    - Preguntar si se esta seguro
    - Eliminar el mensaje
  */
  async deleteConversation() {
    const question = await questionAlert("La conversación se elimina en ambos extremos y no puede recuperar la información");
    if(question.value){
      const data:{} = createArrayId(this.conversation);
      this.store.dispatch(new StartLoadingAction());
      const res = await this.chatService.deleteConversation(data);
      this.store.dispatch(new UnsetConversationClass());
      this.store.dispatch(new UnsetReceptorClass());
      this.store.dispatch(new FinishLoadingAction());
      showNotification("success", res.msg);
    }
  }

  // Borrar datos del formulario reactivo
  resetForm() {
    this.formMessage.reset();
  }
}
