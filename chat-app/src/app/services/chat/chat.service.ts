import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private url = 'http://localhost:3000'; // your server local path

  constructor(private http :HttpClient) {
    this.socket = io(this.url, {transports: ['websocket', 'polling', 'flashsocket']});
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  joinRoom(data:any): void {
    this.socket.emit('join', data);
  }

  sendMessage(data:any): void {
    this.socket.emit('message', data);
  }
  createEmployee(employee: any) {
    console.log(employee,'servie')
    return this.http
      .post(
        this.url + '/posts',
        JSON.stringify(employee),
        this.httpOptions
      )   
  }
  getMessage(): Observable<any> {
    return new Observable<{user: string, message: string}>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }
  getStorage() {
    const storage: any = localStorage.getItem('chats');
    console.log(storage ,"getting")
    return storage ? JSON.parse(storage) : [];
  }

  setStorage(data:any) {
    console.log(data ,"setting")
    localStorage.setItem('chats', JSON.stringify(data));
  }
 
}