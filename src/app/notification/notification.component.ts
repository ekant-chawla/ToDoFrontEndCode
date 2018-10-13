import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket.service';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  private userId: String
  private page: number = 1
  public hasMorePages = false
  public notifications = []
  private timestamp: number
  public isUserTodo: Boolean = false
  public gettingData = false

  constructor(private _socket: SocketService, private _api: ApiService, private toastr: ToastrService, private _helper: HelperService) { }

  ngOnInit() {
    this._helper.verifyUserLoginAndReroute()
    this.userId = localStorage.getItem('userId')

    if (this.userId) {
      if (!this._socket.socket) {
        this._socket.startConnection().subscribe(() => {
          this._socket.setUser()
        })
      }
      this.listNotification()
      this.getRequestCount()
      this.listenForAuthError()
      this.listenForToDoNotification()
      this.listenForFriendNotification()
    }

  }


  ngOnDestroy() {
    console.log("destroy called")
    if (this._socket.socket) this._socket.socket.off()
  }

  logout() {
    this._socket.disconnect()
    this._helper.logout()
  }

  listNotification() {
    this.gettingData = true
    this._api.listNotification(this.page).subscribe((response: any) => {
      this.gettingData = false
      if (!response.error && response.data) {
        if (!this.timestamp) this.timestamp = response.timestamp
        if (response.data.length > 0) {
          this.notifications = this.notifications.concat(response.data)
          this.page += 1
          // if the length of data array is equal to max items per page then there maybe more pages, but if not, there cannot be more pages
          if (response.data.length == this._helper.ItemPerPage) this.hasMorePages = true
          else this.hasMorePages = false
          console.log(this.notifications)
        } else {
          this.hasMorePages = false
          this.toastr.info("There are no more notifications.", "Info")
        }
      } else {
        this.toastr.error(response.message, "Error")
      }
    })

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
      //this.notifications.unshift(notificationObj.noti)
      console.log(notificationObj)
    })
  }

  listMore() {
    this.listNotification()
  }

  public requestCount

  getRequestCount() {
    this._api.friendRequestCount().subscribe((response: any) => {
      if (!response.error) this.requestCount = response.data
    })
  }
}
