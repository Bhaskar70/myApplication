import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NavigationCancellationCode } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ChatService } from 'src/app/services/chat/chat.service';
import { setUserData } from 'src/app/state/app.action';
import { UserData } from 'src/app/state/app.selector';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registered') registered: any;
  registerData: FormGroup
  array: any;
  loginData: any;
  constructor(private fb: FormBuilder, private service: ChatService,
    private modalService: NgbModal, private http: HttpClient, private store: Store
  ) {
    this.registerData = this.fb.group({
      name: '',
      phone: '',
      photo: ''
    })
  }
  ngOnInit() {
    this.store.dispatch(setUserData())
  }
  openPopup(content: any): void {
    this.modalService.open(content, { backdrop: 'static', centered: true });
  }
  RegisterForm() {
    this.store.dispatch(setUserData())
    this.store.select(UserData).subscribe((res) => {
      this.loginData = JSON.parse(JSON.stringify(res))
    })
      console.log(this.loginData, "1111")
      let obj: any = {}
      for (let i = 1; i < this.loginData.length + 1; i++) {
        if (i !== this.loginData.length + 1) {
          obj[i] = `room-${(this.loginData.length) * 2 + i}`
        }
      }
      if(this.loginData.length){
        Object.keys(obj).forEach((val, i) => {
           console.log(this.loginData[i].roomId)
           this.loginData[i].roomId[this.loginData.length + 1] = obj[val]
          })
        this.service.updateRoomId(this.loginData).subscribe()
        console.log(this.loginData, "5555%%%", obj)
      }
      let data = {
        id: this.loginData.length + 1,
        name: this.registerData.get('name')?.value,
        phone: this.registerData.get('phone')?.value,
        image: this.url,
        roomId: obj
      }
      //this.loginData.push(data)
     this.service.updateRegisterData(data).subscribe()
     this.openPopup(this.registered)
  }
  //  images selction change

  url: any;
  msg = "";

  selectFile(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.url = URL.createObjectURL(selectedFile);
    }
  }
  phoneNumValidation(evt: any) {
    if (evt.target.value.length > 9) {
      evt.preventDefault()
      return
    }
  }
}