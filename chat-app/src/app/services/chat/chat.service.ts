import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private url = 'http://192.168.10.16:3000'; // your server local path


  constructor(private http: HttpClient) {
    this.socket = io(this.url, { transports: ['websocket', 'polling', 'flashsocket'] });
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  joinRoom(data: any): void {
    this.socket.emit('join', data);
  }
  registerPage(data: any): void {
    this.socket.emit('registerPage', data);
  }
  sendMessage(data: any): void {
    console.log(data , "new message")
    this.socket.emit('message', data);
  }
  newUser(data: any) {
    console.log(data , "new user")
    this.socket.emit('register', data)
  }
  getNewUser(): Observable<any> {
    return new Observable<{
      user: string,
      room: string,
      phone: string
    }>(observer => {
      this.socket.on('new user', (data) => {
        console.log("new user")
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }

  getMessage(): Observable<any> {
    return new Observable<{ user: string, message: string }>(observer => {
      this.socket.on('new message', (data) => {
        console.log("new message")
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }
  getStorage() {
    const storage: any = localStorage.getItem('chats');
    return storage ? JSON.parse(storage) : [];
  }
  getUserData() {
    const userData: any = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : [];
  }

  setStorage(data: any) {
    localStorage.setItem('chats', JSON.stringify(data));
  }
  getChatData() {
    return this.http.get(`${this.url}/api/chats`)
  }

  updateChats(data: any) {
    return this.http.post(`${this.url}/api/update/chats`, data)
  }
  getRegisterData() {
    return this.http.get(`${this.url}/api/register`)
  }
  updateRegisterData(data: any) {
    return this.http.post(`${this.url}/api/update/register`, data)
  }
  updateRoomId(data: any) {
    return this.http.post(`${this.url}/api/update/roomid`, data)
  }
}