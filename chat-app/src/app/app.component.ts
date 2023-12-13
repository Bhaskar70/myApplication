import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedName:string =''
  options =[{name:'bhaskar' , id :1},{name:'vinay' , id :2},{name:'sandeep' , id :3},{name:'mahesh' , id :4}]
  constructor(private loader :NgxSpinnerService){
    this.loader.show()
    setTimeout(() => {
    this.loader.hide()
    }, 500);
  }
  SelectedValue(){
    console.log(this.selectedName)
    this.selectedName ='jgfgfg'
  }
}
