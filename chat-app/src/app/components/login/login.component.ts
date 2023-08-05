import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('userNotFound') userNotFound: any;
  @ViewChild('popup', {static: false}) popup: any;

  public roomId: string='';
  public messageText: string='';
  public messageArray: { user: string, message: string }[] = [];
  private storageArray:any = [];

  public showScreen = false;
  public phone: string='';
  public currentUser:any;
  public selectedUser:any;
 public userList :any;
  public data :any =[
    {
      id: 1,
      name: 'The Swag Coder',
      phone: '9876598765',
      image: 'assets/user/user-1.png',
      roomId: {
        2: 'room-1',
        3: 'room-2',
        4: 'room-3',
        5: 'room-4',
      }
    },
    {
      id: 2,
      name: 'Wade Warren',
      phone: '9876543210',
      image: 'assets/user/user-2.png',
      roomId: {
        1: 'room-1',
        3: 'room-5',
        4: 'room-6',
        5: 'room-7',
      }
    },
    {
      id: 3,
      name: 'Albert Flores',
      phone: '9988776655',
      image: 'assets/user/user-3.png',
      roomId: {
        1: 'room-2',
        2: 'room-5',
        4: 'room-8',
        5: 'room-9'
      }
    },
    {
      id: 4,
      name: 'Dianne Russell',
      phone: '9876556789',
      image: 'assets/user/user-4.png',
      roomId: {
        1 : 'room-3',
        2 : 'room-6',
        3: 'room-8',
        5: 'room-10'
      }
    },
    {
      id: 5,
      name: 'Vinay Russell',
      phone: '9876556733',
      image: 'assets/user/user-5.png',
      roomId: {
        1: 'room-4',
        2: 'room-7',
        3: 'room-9',
        4:'room-10'
      }
    }
  ] ;
  mockUserList: any;

  constructor(
    private modalService: NgbModal,
    private chatService: ChatService,
    private http :HttpClient
  ) {
  }

  ngOnInit(): void {
    let arr :any= localStorage.getItem('userData') || '[]'
    this.userList = JSON.parse(arr)
    if(!this.userList.length){
      localStorage.setItem('userData', JSON.stringify(this.data));
      this.userList = this.data
    }
  
  }

  ngAfterViewInit(): void {
    this.openPopup(this.popup);
  }

  openPopup(content: any): void {
    console.log(this.popup,"12345")
    this.modalService.open(content, {backdrop: 'static', centered: true});
  }

  login(dismiss: any): void {
    this.currentUser = this.userList.find((user:any) => user.phone === this.phone.toString());
    this.userList = this.userList.filter((user:any) => user.phone !== this.phone.toString());
    this.mockUserList = this.userList
    console.log(this.currentUser,'101:::')
    if (this.currentUser) {
      this.showScreen = true;
       dismiss();
    }else{
      this.openPopup(this.userNotFound)
      dismiss();
    
    }
  }


}
