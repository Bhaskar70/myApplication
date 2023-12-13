import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import {  StoreModule } from '@ngrx/store';
import { reducerData } from './state/app.reducer';
import { ChatService } from './services/chat/chat.service';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AppEffects } from './state/app.effects';
import { EffectsModule } from '@ngrx/effects';
import { ErrorsPageComponent } from './components/errors-page/errors-page.component';
import { ChatRoomWorkflowService } from './services/chat-room-workflow.service';
import { LoaderComponent } from './components/loader/loader.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatRoomComponent,
    HomepageComponent,
    ErrorsPageComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot({type:'ball-fussion'}),
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot({data:reducerData}),
    EffectsModule.forRoot([AppEffects]),
  ],
  providers: [ChatService,ChatRoomWorkflowService],
  bootstrap: [AppComponent]
})
export class AppModule { }
