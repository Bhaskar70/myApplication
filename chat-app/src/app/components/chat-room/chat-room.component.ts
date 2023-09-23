import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserData, getMobileNumber } from 'src/app/state/app.selector';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent {
  public roomId: string = '';
  public messageText: string = '';
  public messageArray: { user: string, message: string }[] = [];
  storageArray: any = [];

  public showScreen = false;
  public phone: string = '';
  currentUser: any;
  selectedUser: any;
  userList: any;
  mockUserList: any;
  ngOnInit() {
    this.store.select(UserData).subscribe((userdata) => {
      this.userList = userdata
    })
    this.store.select(getMobileNumber).subscribe((phone: any) => {
      this.currentUser = this.userList.find((user: any) => user.phone === phone.toString());
      this.userList = this.userList.filter((user: any) => user.phone !== phone.toString());
      this.mockUserList = this.userList
    })
    this.chatService.getMessage().subscribe((data: { user: string, room: string, message: string }) => {
      if (this.roomId) {
       setTimeout(() => {
          this.chatService.getChatData().subscribe((res) => {
            this.storageArray = res
            console.log(this.storageArray, "storageArray")
            const storeIndex = this.storageArray
              .findIndex((storage: any) => storage.roomId === this.roomId);
            this.messageArray = this.storageArray[storeIndex]?.chats || [];
         })
        }, 500);
      }
    });
  }

  constructor(private chatService: ChatService, private store: Store) { }
  selectUserHandler(phone: string): void {
    this.selectedUser = this.userList.find((user: any) => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];
    this.chatService.getChatData().subscribe((res) => {
     this.storageArray = res
      const storeIndex = this.storageArray
        .findIndex((storage: any) => storage.roomId === this.roomId);
      if (storeIndex > -1) {
        this.messageArray = this.storageArray[storeIndex]?.chats || [];
      }
  
      this.join(this.currentUser.name, this.roomId);
    })
  }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({ user: username, room: roomId });
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText
    });

    this.chatService.getChatData().subscribe((res) => {
      console.log(res , "chats")
      this.storageArray = res
      const storeIndex = this.storageArray
        .findIndex((storage: any) => storage.roomId === this.roomId);
  
      if (storeIndex > -1) {
        this.storageArray[storeIndex].chats.push({
          user: this.currentUser.name,
          message: this.messageText
        });
        console.log(this.currentUser.name ,"update" , this.messageText)
        this.chatService.updateChats(this.storageArray[storeIndex]).subscribe()
      } else {
        const updateStorage = {
          roomId: this.roomId,
          chats: [{
            user: this.currentUser.name,
            message: this.messageText
          }]
        };
        console.log(updateStorage , "updateStorage")
       this.chatService.updateChats(updateStorage).subscribe()
        this.storageArray.push(updateStorage);
      }
      this.messageText = '';
  })
  }
  searchUser(evt: any) {
    this.userList = this.mockUserList.filter((val: any) => {
      return val.name.toLowerCase().indexOf(evt.target.value.toLowerCase()) > -1
    })
  }
}
