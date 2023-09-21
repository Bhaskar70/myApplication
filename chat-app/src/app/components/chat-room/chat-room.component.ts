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
    this.store.select(UserData).subscribe((userdata)=>{
      this.userList = userdata
    })
     this.store.select(getMobileNumber).subscribe((phone:any)=>{
       this.currentUser = this.userList.find((user:any) => user.phone === phone.toString());
       this.userList = this.userList.filter((user:any) => user.phone !== phone.toString());
       this.mockUserList = this.userList
       console.log(phone , "26:::" )
     })
    this.chatService.getMessage().subscribe((data: { user: string, room: string, message: string }) => {
      if (this.roomId) {
        setTimeout(() => {
           this.storageArray = this.chatService.getStorage();
           console.log(this.storageArray , "storageArray")
          const storeIndex = this.storageArray
            .findIndex((storage:any) => storage.roomId === this.roomId);
          this.messageArray = this.storageArray[storeIndex].chats;
        }, 500);
      }
    });
  }

  constructor(private chatService: ChatService , private store :Store) { }
  selectUserHandler(phone: string): void {
    this.selectedUser = this.userList.find((user: any) => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];
    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage: any) => storage.roomId === this.roomId);
    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.currentUser.name, this.roomId);
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

    this.storageArray = this.chatService.getStorage();
    
    const storeIndex = this.storageArray
      .findIndex((storage: any) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      });
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };
      this.storageArray.push(updateStorage);
    }
    this.chatService.setStorage(this.storageArray);
    this.messageText = '';
  }
  searchUser(evt: any) {
    this.userList = this.mockUserList.filter((val: any) => {
      return  val.name.toLowerCase().indexOf(evt.target.value.toLowerCase()) > -1
      })
  }
}
