import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ApiService } from './api.service';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { ToDoComponent } from './todo/todo.component';
import { HelperService } from './helper.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SocketService } from './socket.service';
import { FriendComponent } from './friend/friend.component';
import { NotificationComponent } from './notification/notification.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToDoComponent,
    ResetPasswordComponent,
    FriendComponent,
    NotificationComponent,
    TodoDetailComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'friends', component: FriendComponent, pathMatch: 'full' },
      { path: 'todo', component: ToDoComponent, pathMatch: 'full' },
      { path: 'todo/:todoId', component: TodoDetailComponent, pathMatch: 'full' },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'notifications', component: NotificationComponent, pathMatch: 'full' },
      { path: '**', component: NotFoundComponent },
    ]),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [ApiService, HelperService, SocketService],
  bootstrap: [AppComponent],

})
export class AppModule { }
