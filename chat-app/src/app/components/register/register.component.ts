import { Component, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NavigationCancellationCode } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from 'src/app/services/chat/chat.service';

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
    private modalService: NgbModal,
  ) {
    this.registerData = this.fb.group({
      name: '',
      phone: '',
      photo: ''
    })
  }
  ngOnInit() {
    let data :any= localStorage.getItem('userData')
    this.loginData = JSON.parse(data)
    this.service.getMessage().subscribe((v: any) => {
      console.log(v, '89')
    })
  }
  openPopup(content: any): void {
    this.modalService.open(content, { backdrop: 'static', centered: true });
  }
  RegisterForm() {
    let obj: any = {}
    for (let i = 1; i < this.loginData.length + 1; i++) {
      if (i !== this.loginData.length + 1) {
        obj[i] = `room-${(this.loginData.length) * 2 + i}`
      }
    }
    console.log(obj, "37::::")
    Object.keys(obj).forEach((val, i) => {
      this.loginData[i].roomId[this.loginData.length + 1] = obj[val]
    })
    this.openPopup(this.registered )
    console.log(this.loginData, "345:::", obj)
    let data = {
      id: this.loginData.length + 1,
      name: this.registerData.get('name')?.value,
      phone: this.registerData.get('phone')?.value,
      image: this.url,
      roomId: obj
    }
    this.loginData.push(data)
    localStorage.setItem('userData' , JSON.stringify(this.loginData))
  }
  //  images selction change

  url: any; 
	msg = "";
	
	selectFile(event: any) { 
		if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.msg = 'You must select an image';
			return;
		}
		
		var mimeType = event.target.files[0].type;
		
		if (mimeType.match(/image\/*/) == null) {
			this.msg = "Only images are supported";
			return;
		}
		
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.msg = "";
			this.url = reader.result; 
		}
	}
  phoneNumValidation(evt:any){
    if(evt.target.value.length > 9){
      console.log(evt.target.value.length , "11111")
      evt.target.preventDefault()
      return
      
    }
  }
}