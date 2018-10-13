import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket
  private authToken
  constructor() {
    console.log("service started!")
  }


  startConnection() {

    this.authToken = localStorage.getItem('authToken')
    // this.socket = io("http://localhost:3000/api/v1/notification")
    this.socket = io("http://todoapi.ekantchawla.me/api/v1/notification")

    return new Observable((obs) => {
      this.socket.on('verifyUser', () => {
        obs.next()
      })
    })
  }

  setUser() {
    this.socket.emit('setUser', this.authToken)
    console.log("setting user")
  }

  authError() {
    return new Observable((obs) => {
      this.socket.on('authError', () => {
        obs.next()
      })
    })
  }


  friendNotification() {
    return new Observable((obs) => {
      this.socket.on('friend-notification', (notificationObj) => {
        obs.next(notificationObj)
      })
    })
  }

  todoCreateNotification() {
    return new Observable((obs) => {
      this.socket.on('todo-notification', (notificationObj) => {
        obs.next(notificationObj)
      })
    })
  }

  disconnect() {
    this.socket.disconnect(true)
    this.socket = undefined
  }

}
