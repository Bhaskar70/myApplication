import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ChatRoomWorkflowService } from './services/chat-room-workflow.service';
import { ErrorsPageComponent } from './components/errors-page/errors-page.component';

const routes: Routes = [
   {path:'' ,component:HomepageComponent },
   {path :'login' , component :LoginComponent},
   {path :'register' , component:RegisterComponent},
   {path :'chat-room' , component:ChatRoomComponent , canActivate : [ChatRoomWorkflowService]},
   {path :'error' , component : ErrorsPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
