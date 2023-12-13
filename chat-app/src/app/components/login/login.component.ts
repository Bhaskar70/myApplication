import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ChatService } from 'src/app/services/chat/chat.service';
import { mobileNumber, setUserData } from 'src/app/state/app.action';
import { UserData } from 'src/app/state/app.selector';

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
  public data :any ;
  mockUserList: any;

  constructor(
    private modalService : NgbModal,
    private chatService : ChatService,
    private http : HttpClient,
    private store : Store,
    private router :Router
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(setUserData())
     this.store.select(UserData).subscribe((res)=>{
      console.log(res, "userData")
      this.userList = res
     })
  
  }

  ngAfterViewInit(): void {
    this.openPopup(this.popup);
  }

  openPopup(content: any): void {
    this.modalService.open(content, {backdrop: 'static', centered: true});
  }

  login(dismiss: any): void {
    this.chatService.showSpinner()
    if(!this.phone.length){
      this.router.navigate(['error'])
      this.chatService.hideSpinner()
      dismiss();

    }
    if(this.phone.length){
    this.currentUser = this.userList.find((user:any) => user.phone === this.phone.toString());
    console.log(this.currentUser , this.userList , "59:::",this.phone)
      this.showScreen = true;
      this.store.dispatch(mobileNumber({mobileNo : this.phone.toString()}))
      this.router.navigate(['chat-room'])
        this.chatService.hideSpinner()
      dismiss();
    }
  }
  phoneValidation(evt :any){
   if(this.phone.length > 9){
     evt.preventDefault()
     return
   }
  }
}
