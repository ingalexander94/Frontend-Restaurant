import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public serverStatus: boolean = false;

  constructor(private socket:Socket) { 
    this.checkStatus();
  }

  checkStatus(){
    this.socket.on("connect", () => {
      console.log("Conectado al servidor");
      this.serverStatus = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Desconectado del servidor");
      this.serverStatus = false;
    })
  }

  disconnectSocket(){
    this.socket.disconnect();
  }

  connectSocket(){
    this.socket.connect();
  }

  loginWS(name: string, idDB: string) {
    return new Promise((resolve, reject)=> {
      const payload = {
        name,
        idDB
      }
      this.emit("config-client", payload, ()  => {
        resolve();
      })
    })
  }

  emit(event:string, payload?: any, callback?: Function){
    console.log(`Emitiendo ${event}`);
    this.socket.emit(event, payload, callback);
  }

  listen(event: string){
    return this.socket.fromEvent(event);
  }

}
