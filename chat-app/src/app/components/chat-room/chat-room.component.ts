import { formatDate } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat/chat.service';
import { VoiceRecognitionService } from 'src/app/services/voice-recognition.service';
import { mobileNumber, setUserData } from 'src/app/state/app.action';
import { UserData, getMobileNumber } from 'src/app/state/app.selector';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent {
  public roomId: string = '';
  public messageText: string = '';
  public messageArray: { user: string, message: string, time: string, read: boolean, date: string }[] = [];
  storageArray: any = [];
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  public showScreen = false;
  public phone: string = '';
  currentUser: any;
  selectedUser: any;
  userList: any;
  mockUserList: any;
  speech: boolean = false;
  messageData: any = [];
  isUserSpeaking: boolean = false;
  url: boolean=false;
  ngOnInit() {
    this.chatService.getNewUser().subscribe((res => {
      setTimeout(() => {
        this.store.dispatch(setUserData())
      }, 1000);
    }))
    this.store.select(UserData).subscribe((userdata) => {
      this.userList = JSON.parse(JSON.stringify(userdata))
      console.log(this.userList, "12345:::")
      if (this.currentUser) {
        this.mockUserList = this.userList.filter((user: any) => user.phone !== this.currentUser.phone.toString());
      }
    })
    this.store.select(getMobileNumber).subscribe((phone: any) => {
      if (phone) {
        this.currentUser = this.userList.find((user: any) => user.phone === phone.toString());
        this.userList = this.userList.filter((user: any) => user.phone !== phone.toString());
        this.mockUserList = this.userList
        this.chatService.getChatData().subscribe((res) => {
          this.storageArray = res
          Object.keys(this.currentUser.roomId).forEach((val: any) => {
            console.log(this.storageArray, "1111", this.currentUser.roomId[val])
            const index = this.storageArray
              .findIndex((storage: any) => storage.roomId === this.currentUser.roomId[val]);
            let lastmessage = this.storageArray[index]?.chats
            if (lastmessage && lastmessage.length) {
              let lastuser = lastmessage.map((res: any) => res.user)[0]
              let userData = this.mockUserList.findIndex((sender: any) => sender.name === lastuser)
              this.mockUserList[userData].lastmsg = lastmessage[lastmessage.length - 1]
            }
            let unreadmsg = this.storageArray[index]?.chats.filter((chat: any) => chat.user !== this.currentUser.name && !chat.read)
            console.log(unreadmsg, "unreadmsg")
            if (unreadmsg && unreadmsg.length) {
              let user = unreadmsg.map((res: any) => res.user)[0]
              let inx = this.mockUserList.findIndex((sender: any) => sender.name === user)
              this.mockUserList[inx].newMessage = unreadmsg.length
              console.log(this.mockUserList[inx], "last msg")
            }
          })
        })
      }
    })
    this.chatService.getMessage().subscribe((data: { user: string, room: string, message: string }) => {
      console.log(this.selectedUser, "321:::")
      if (this.selectedUser) {
        this.chatService.markAsRead({ user: this.selectedUser.name, roomId: this.roomId }).subscribe()
      }
      setTimeout(() => {
        this.chatService.getChatData().subscribe((res) => {
          this.storageArray = res
          if (this.roomId) {
            console.log(this.storageArray, "storageArray")
            const storeIndex = this.storageArray
              .findIndex((storage: any) => storage.roomId === this.roomId);
            this.messageArray = this.storageArray[storeIndex]?.chats || [];
            this.messageData = this.messagesGroupedByDate()
            setTimeout(() => {
              this.scrollToBottom()
            }, 100);
          }
          console.log(this.currentUser.roomId, "current-rooms")
          if (!this.selectedUser || this.selectedUser?.name !== data.user) {
            Object.keys(this.currentUser.roomId).forEach((val: any) => {
              if (this.currentUser.roomId[val] === data.room) {
                this.mockUserList.filter((res: any, i: any) => {
                  if (res.name === data.user) {
                    const index = this.storageArray
                      .findIndex((storage: any) => storage.roomId === data.room);
                    let unreadmsg = this.storageArray[index]?.chats.filter((chat: any) => chat.user !== this.currentUser.name && !chat.read)
                    console.log(unreadmsg, "unreadmsg", unreadmsg[unreadmsg.length - 1])
                    this.mockUserList[i].lastmsg = unreadmsg[unreadmsg.length - 1]
                    this.mockUserList[i].newMessage = unreadmsg.length
                  }
                })
              }
            })
          }
        })
      }, 500);
    });
  }

  constructor(private chatService: ChatService, private store: Store, private service: VoiceRecognitionService
  ) {
    this.initVoiceInput()
  }
  messagesGroupedByDate() {
    const groupedMessages = this.groupByDate();
    return Object.keys(groupedMessages).map((date) => ({
      date: this.formatDate(date),
      messages: groupedMessages[date],
    }));
  }
  private groupByDate() {
    return this.messageArray.reduce((acc: any, message) => {
      const date = message.date;
      console.log(acc, date, "90:::::")
      if (acc[date]) {
        acc[date].push(message);
      } else {
        acc[date] = [message];
      }
      return acc;
    }, {});
  }

  selectUserHandler(phone: string): void {
    this.selectedUser = this.userList.find((user: any) => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];
    this.chatService.markAsRead({ user: this.selectedUser.name, roomId: this.roomId }).subscribe()
    this.chatService.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText,
      type : this.url ? "image" : "text",
      time: '',
      read: false
    });
    this.chatService.getChatData().subscribe((res) => {
      let index = this.mockUserList.findIndex((val: any) => val.phone === phone)
      this.mockUserList[index].newMessage = 0
      this.storageArray = res
      const storeIndex = this.storageArray
        .findIndex((storage: any) => storage.roomId === this.roomId);
      if (storeIndex > -1) {
        this.messageArray = this.storageArray[storeIndex]?.chats || []
      }

      this.join(this.currentUser.name, this.roomId);
    })
    this.messageText = ''
    this.url = false
  }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({ user: username, room: roomId });
  }

  sendMessage(): void {
    this.chatService.getChatData().subscribe((res) => {
      console.log(res, "chats")
      this.storageArray = res
      const storeIndex = this.storageArray
        .findIndex((storage: any) => storage.roomId === this.roomId);
      const date = new Date()
      if (this.messageText.trim().length) {
        if (storeIndex > -1) {
          this.storageArray[storeIndex].chats.push({
            user: this.currentUser.name,
            message: this.messageText,
            type : this.url ? "image" : "text",
            time: `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            date: `${date.toLocaleDateString()}`,
            read: false
          });

          const newMessage = {
            _id: this.storageArray[storeIndex]._id,
            roomId: this.roomId,
            message: {
              user: this.currentUser.name,
              message: this.messageText,
              type : this.url ? "image" : "text",
              time: `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              date: `${date.toLocaleDateString()}`,
              read: false
            }
          }
          this.chatService.updateChats(newMessage).subscribe()
        } else {
          const updateStorage = {
            roomId: this.roomId,
            chats: [{
              user: this.currentUser.name,
              message: this.messageText,
              type : this.url ? "image" : "text",
              time: `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              date: `${date.toLocaleDateString()}`,
              read: false
            }]
          };
          this.chatService.updateChats(updateStorage).subscribe()
          this.storageArray.push(updateStorage);
        }
        let read = this.selectedUser && this.selectedUser.name === this.currentUser.name
        console.log(read, "read")
        this.chatService.sendMessage({
          user: this.currentUser.name,
          room: this.roomId,
          message: this.messageText,
          type : this.url ? "image" : "text",
          time: `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          date: `${date.toLocaleDateString()}`,
          read: read
        });
      }
      this.messageText = '';
      this.url = false
    })

    console.log(this.selectedUser, this.roomId, "12345:::")
  }
  searchUser(evt: any) {
    this.userList = this.mockUserList.filter((val: any) => {
      return val.name.toLowerCase().indexOf(evt.target.value.toLowerCase()) > -1
    })
  }
  private formatDate(date: string): string {
    const today = new Date();
    if (today.toLocaleDateString() === date) {
      return 'Today';
    } else {
      return formatDate(date, 'dd/MM/yyyy', 'en-US');
    }
  }


  scrollToBottom() {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight + 10;
    console.log(this.chatContainer.nativeElement.scrollHeight, this.chatContainer.nativeElement.scrollTop, "scroll")
  }
  startRecording() {
    this.isUserSpeaking = true;
    this.service.start();
    // this.messageText = 
  }
  // speechStop(){
  //   this.speech = false
  //  this.service.stop()
  // }
  initVoiceInput() {
    this.service.init().subscribe(() => {
    });

    this.service.speechInput().subscribe((input) => {
      this.messageText = input
    });
  }
  stopRecording() {
    this.service.stop();
    this.isUserSpeaking = false;
  }
  SelectedImage(evt:any){
      const selectedFile = evt.target.files[0];
      console.log(selectedFile.name, 'img')
      const formData = new FormData()
      formData.append('image', selectedFile)
      if (selectedFile) {
        this.chatService.uploadImage(formData).subscribe()
        this.url = true;
        this.messageText = `http://192.168.10.16:3000/uploads/${selectedFile.name}`;
      }
  }
}
