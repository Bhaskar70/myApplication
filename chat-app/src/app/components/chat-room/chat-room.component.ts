import { Component, Input } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent {
  public roomId: string = '';
  public messageText: string = '';
  public messageArray: { user: string, message: string }[] = [];
  private storageArray: any = [];

  public showScreen = false;
  public phone: string = '';
  @Input() currentUser: any;
  @Input() selectedUser: any;
  @Input() userList: any;
  @Input() mockUserList: any;
  ngOnInit() {
    this.chatService.getChatData().subscribe(res=>console.log(res ,"chatdata"))
    this.chatService.updateChats({id : "gfgh" , description :"hello world"}).subscribe(res=>console.log(res ,"updatedchats"))

    this.chatService.getMessage().subscribe((data: { user: string, room: string, message: string }) => {
      if (this.roomId) {
        setTimeout(() => {
          this.storageArray = this.chatService.getStorage();
          const storeIndex = this.storageArray
            .findIndex((storage:any) => storage.roomId === this.roomId);
            console.log(this.roomId, 'roomid', storeIndex ,'index', this.storageArray , 'arr')
          this.messageArray = this.storageArray[storeIndex].chats;
        }, 500);
      }
    });
   }

  constructor(private chatService: ChatService) { }
  selectUserHandler(phone: string): void {
    this.selectedUser = this.userList.find((user: any) => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    console.log(this.selectedUser, "79::::")
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
    console.log(this.roomId, this.currentUser.name, "12222")
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
      console.log(updateStorage ,"12345")
      this.storageArray.push(updateStorage);
    }

    this.chatService.setStorage(this.storageArray);
    this.messageText = '';
  }
  searchUser(evt: any) {
    console.log(evt.target.value, "1111111")
    this.userList = this.mockUserList.filter((val: any) => val.name.toLowerCase().indexOf(evt.target.value.toLowerCase()) > -1)
    console.log(this.userList, "filterData")
  }
}
