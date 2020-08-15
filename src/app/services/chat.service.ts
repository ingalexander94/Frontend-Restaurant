import { Injectable } from '@angular/core';
import { fetchWithToken } from '../helpers/fetch';
import { Convesation } from '../interface/interfaces';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private wsService: WebsocketService) { }

  emitClientsOnline(){
    this.wsService.emit("get-users");
  }

  getClientOnline(){
    return this.wsService.listen("users-online");
  }

  emitAdminOnline(){
    this.wsService.emit("get-admin");
  }

  getAdminOnline(){
    return this.wsService.listen("admin-online");
  }
  

  getPrivateMessage(){
    return this.wsService.listen("private-message");
  }

  sendMessagePrivate = async(message: Convesation)=> {
    try {
      const res = await fetchWithToken(`api/chat/${message.id}`, "POST", message);
      const data = await res.json();
      return data;
     } catch (error) {
       console.log(error);
     }
  }

  loadConversation = async(sender: string, receiver: string) => {
    try {
      const payload = {sender, receiver};
      const res = await fetchWithToken("api/chat/mensajes/cargar", "POST", payload);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  deleteConversation = async(data: {}) => {
    try {
      const payload = data;
      const res = await fetchWithToken("api/chat/mensajes/borrar", "DELETE", payload);
      const body = await res.json();
      return body;
    } catch (error) {
      console.log(error);
    }
  }

  clearSocket(){
    this.wsService.disconnectSocket();
  }

  openSocket(){
    this.wsService.connectSocket();
  }

}
