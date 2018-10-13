import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket.service';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../helper.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class ToDoComponent implements OnInit, OnDestroy {

  public todoList: Array<any> = []

  //the room where the user is currently in

  private userId: String // the user whoes todo we are looking at
  private userName: String

  private page = 1;
  public hasMorePages = false
  public allowed = undefined // vairable that can be used for filtering

  public gettingData:boolean = false
  /*Modal Variables*/
  public title
  public description = ''
  public timestamp = null;
  public isUsersTodoList: boolean = false
  

  constructor(private _socket: SocketService, private _api: ApiService, private toastr: ToastrService, private _helper: HelperService, private _route: ActivatedRoute, private _router:Router) { 
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {

    this._helper.verifyUserLoginAndReroute()
    this.userId = this._route.snapshot.queryParamMap.get("user") || localStorage.getItem('userId')
    this.isUsersTodoList = localStorage.getItem('userId') == this.userId


    //if user is present then do this
    if (this.userId) {
      console.log(this._socket.socket)
      if (!this._socket.socket) {
        this._socket.startConnection().subscribe(() => {
          this._socket.setUser()
          console.log(this._socket.socket)
        })
      }
      this.listTodo()
      this.getNotificaitonCount()
      this.getRequestCount()
      this.listenForAuthError()
      this.listenForToDoNotification()
      this.listenForFriendNotification()
    }

  }


  ngOnDestroy() {
    if (this._socket.socket) this._socket.socket.off()
  }

  createTodo() {
    console.log("called create todo")
    this._api.createTodo(this.title, this.description).subscribe((response: any) => {

      this.title = ''
      this.description = ''

      if (!response.error) {
        this.toastr.success('Success', response.message)
        this.todoList.unshift(response.data)
      } else {
        this.toastr.error('Error', response.message)
      }

      console.log(this.todoList)

    })
  }

  listTodo() {
    this.gettingData = true
    this._api.listTodo(this.page, this.userId, this.timestamp).subscribe((response: any) => {
      this.gettingData = false
      if (!response.error && response.data) {
        if (response.data.length > 0) {
          this.todoList = this.todoList.concat(response.data)
          this.page += 1
          // if the length of data array is equal to max items per page then there maybe more pages, but if not, there cannot be more pages
          if (response.data.length == this._helper.ItemPerPage) this.hasMorePages = true
          else this.hasMorePages = false
        } else {
          this.hasMorePages = false
          this.toastr.info("There are no more todos.", "Info")
        }

        if (!this.timestamp) this.timestamp = response.timestamp

      } else {
        this.toastr.error(response.message, "Error")
      }

      console.log(this.todoList)

    })
  }

  logout() {
    this._socket.disconnect()
    this._helper.logout()
  }

  listenForAuthError() {
    this._socket.authError().subscribe(() => {
      console.log('Auth error occured')
      this.toastr.info("Redirecting to home", "Invalid/Expired session")
      this._helper.logout(false)
    })
  }

  listenForFriendNotification() {
    this._socket.friendNotification().subscribe((notificationObj: any) => {
      this.toastr.info(notificationObj.message, notificationObj.title)
    })
  }

  listenForToDoNotification() {
    this._socket.todoCreateNotification().subscribe((notificationObj: any) => {
      this.toastr.info(notificationObj.message, notificationObj.title)
      //      console.log(notificationObj)
      //if you are currently in the same todo list then it should be added to the list
      if (this.userId == notificationObj.roomId && notificationObj.type == "todo-create")
        this.todoList.unshift(notificationObj.todo)

      if (this.userId == notificationObj.roomId && notificationObj.type == "todo-update") {
        this.todoList = this.todoList.map((item) => {
          if (item.id == notificationObj.todo.todoId) {
            item.completed = notificationObj.todo.completed
          }
          return item
        })
      }

    })
  }

  listMore() {
    this.listTodo()
  }



  // notification and request count 

  public requestCount
  public notificationCount

  getRequestCount() {
    this._api.friendRequestCount().subscribe((response: any) => {
      if (!response.error) this.requestCount = response.data
    })
  }

  getNotificaitonCount() {
    this._api.notificationCount().subscribe((response: any) => {
      if (!response.error) this.notificationCount = response.data
    })
  }

}
