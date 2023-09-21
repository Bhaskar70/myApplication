import { Component } from '@angular/core';
import { MongoClient } from 'mongodb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat-app';
 ngOnInit(){

 }
 name(evt:any){
 console.log(evt ,"123")
 }
}
