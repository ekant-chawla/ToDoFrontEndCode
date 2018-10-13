import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket.service';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../helper.service';
import * as $ from 'jquery'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit, OnDestroy {

  public friendList: Array<any> = []
  public requestList: Array<any> = []
  private friendPage: number = 1
  private requestPage: number = 1
  public hasMoreFriend: boolean = false
  public hasMoreRequest: boolean = false
  public email: String
  private timestampFriend: number = null
  private timestampRequest: number = null
  private userId
  public gettingFriendData = false
  public gettingRequestData = false

  constructor(private _socket: SocketService, private _api: ApiService, private toastr: ToastrService, private _helper: HelperService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._helper.verifyUserLoginAndReroute()
    this.userId = localStorage.getItem('userId')



    if (this.userId) {
      console.log(this._socket.socket)
      if (!this._socket.socket) {
        this._socket.startConnection().subscribe(() => {
          this._socket.setUser()
          console.log(this._socket.socket)
        })
      }

      this.getFriendList()
      this.getRequestList()
      this.getNotificaitonCount()
      this.listenForAuthError()
      this.listenForToDoNotification()
      this.listenForFriendNotification()

    }

  }


  ngOnDestroy() {
    console.log("destroy called")
    if (this._socket.socket) this._socket.socket.off()
  }


  getFriendList() {
    this.gettingFriendData = true
    this._api.listFriends(this.friendPage, this.timestampFriend).subscribe((response: any) => {
      this.gettingFriendData = false
      if (!response.err && response.data) {
        if (!this.timestampFriend) this.timestampFriend = response.timestamp
        if (response.data.length > 0) {
          this.friendList = this.friendList.concat(response.data)
          this.friendPage += 1
          // if the length of data array is equal to max items per page then there maybe more pages, but if not, there cannot be more pages
          if (response.data.length == this._helper.ItemPerPage) this.hasMoreFriend = true
          else this.hasMoreFriend = false
        } else {
          this.hasMoreFriend = false
          this.toastr.info("There are no more friends.", "Info")
        }
      } else {
        this.toastr.error(response.message, "Error")
      }
    })
  }

  getRequestList() {
    this.gettingRequestData = true

    this._api.listRequest(this.requestPage, this.timestampRequest).subscribe((response: any) => {
      this.gettingRequestData = false
      if (!response.error && response.data) {
        if (!this.timestampRequest) this.timestampRequest = response.timestamp
        if (response.data.length > 0) {

          this.requestList = this.requestList.concat(response.data)
          this.requestPage += 1
          // if the length of data array is equal to max items per page then there maybe more pages, but if not, there cannot be more pages
          if (response.data.length == this._helper.ItemPerPage) this.hasMoreRequest = true
          else this.hasMoreRequest = false
        } else {
          this.hasMoreRequest = false
          this.toastr.info("There are no more requests.", "Info")
        }
      } else {
        this.toastr.error(response.message, "Error")
      }

    })
  }

  logout() {
    console.log(this._socket.socket)
    this._socket.disconnect()
    this._helper.logout()
  }

  addFriend() {

    this._api.addFriend(this.email).subscribe((response: any) => {
      console.log(response)
      if (!response.error) {
        this.toastr.success(response.message, "Success")
        this.email = ''
      } else {
        this.toastr.error(response.message, "Error")
      }
    })

  }

  acceptRequest(userId: String) {


    this._api.acceptRequest(userId).subscribe((response) => {

      if (!response.error) {

        this.toastr.success(response.message, "Success")

        // find and remove the added friend from request array and add him to friend array
        let index = this.requestList.findIndex((request) => {
          return request.sender.userId == userId
        })
        let request = this.requestList.splice(index, 1)[0]
        console.log(request)

        let newFriend = {
          friend: {
            firstName: request.sender.firstName,
            lastName: request.sender.lastName
          },
          friendId: request.sender.userId
        }
        this.friendList.unshift(newFriend)


      } else {

        this.toastr.error(response.message, "Error")
      }
    })

  }


  listMoreRequest() {
    this.getRequestList()
  }

  listMoreFriend() {
    this.getFriendList()
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
    })
  }

  public notificationCount

  getNotificaitonCount() {
    this._api.notificationCount().subscribe((response: any) => {
      if (!response.error) this.notificationCount = response.data
    })
  }

}
