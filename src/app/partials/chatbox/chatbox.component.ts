import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { scrollDown, soundChat } from '../../helpers/scroll';
import { orderArray } from '../../helpers/array';
import { Convesation, userRedux } from '../../interface/interfaces';
import {
  SetConversationClass,
  LoadConversationClass,
} from '../../reducers/chat/actions/chat.actions';
import { AppState } from '../../app.reducers';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
})
export class ChatboxComponent implements OnInit, OnDestroy {

  // Observables
  newMessageSubscription: Subscription = new Subscription();
  chargeMSGSubscription: Subscription = new Subscription();
  authSubscription: Subscription = new Subscription();

  // Variables
  hide: boolean = false;
  conversation: Convesation[];
  userAuth: userRedux;
  receptor: userRedux;

  // Formularios reactivos
  formMessage: FormGroup;

  crearForm(): FormGroup {
    return new FormGroup({
      text: new FormControl('', Validators.required),
    });
  }

  constructor(
    private chatService: ChatService,
    private store: Store<AppState>
  ) {
    this.formMessage = this.crearForm();
  }

  // Se dispara cuando se carga todo el componente
  ngOnInit(): void {
  /* 
    - Se dispara cuando llega un nuevo mensaje
    - Abre la ventana del chat si esta cerrado
    - Agregar el mensaje a Redux
  */
    this.newMessageSubscription = this.chatService
      .getPrivateMessage()
      .subscribe((msg: Convesation) => {
        if (!this.hide) {
          this.hide = true;
          soundChat();
        }
        this.store.dispatch(new SetConversationClass(msg));
        scrollDown('chat-history');
      });

  /* 
    - Se dispara cuando se recarga la aplicación
    - Obtener información del administrador [receptor] y el historial de la  conversación 
  */
    this.chargeMSGSubscription = this.store.select('chat').subscribe((chat) => {
      this.conversation = chat.conversation;
      this.receptor = chat.receptor;
    });

  /* 
    - Se dispara cuando se recarga la aplicación
    - Obtener información del usuario autenticado
  */
    this.authSubscription = this.store
      .select('auth')
      .pipe(pluck('user'))
      .subscribe((user) => {
        this.userAuth = user;
      });

    this.loadMessages(this.receptor.uid, this.userAuth.uid);
  }

  // Se dispara cuando se destruye el componente
  ngOnDestroy(): void {
    this.newMessageSubscription.unsubscribe();
    this.chargeMSGSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  /* 
    - Se dispara cuando se envia un mensaje
    - Crear estructura del mensaje
    - Agregar el mensaje a Redux
    - Enviar el mensaje
  */
  async sendMessage() {
    if (this.formMessage.valid) {
      const { text } = this.formMessage.value;
      const { uid } = this.userAuth;
      const { uid: id, idSocket } = this.receptor;
      const date = new Date();

      const newMessage: Convesation = {
        text,
        receiver: id,
        sender: uid,
        date,
        id: idSocket,
      };
      this.store.dispatch(new SetConversationClass(newMessage));
      await this.chatService.sendMessagePrivate(newMessage);
      scrollDown('chat-history');
      this.resetForm();
    }
  }

  /* 
    - Realizar petición para obtener la conversación entre usuario y administrador
    - Ordenar mensajes por fecha de envio para mostrarlos en el orden en que fueron enviados
    - Agregar el historial de la conversación a Redux
  */
  async loadMessages(sender:string, receiver:string) {
    const conversation = await this.chatService.loadConversation(
      sender,
      receiver
    );
    if (conversation.ok) {
      const orderConversation = orderArray(conversation.mensajes);
      this.store.dispatch(new LoadConversationClass(orderConversation));
    }
  }
 
  /* 
    - Se dispara desde el html al hacer click en la ventana del chat
    - Abre y cierra la ventana del chat
  */
  scroll() {
    this.hide = !this.hide;
    scrollDown('chat-history');
  }

  // Borrar datos del formulario reactivo
  resetForm() {
    this.formMessage.reset();
  }
  
}
