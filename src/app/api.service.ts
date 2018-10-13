import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //local api url to be run with proxy config
  // private userUrl = '/api/v1/user'
  // private todoUrl = '/api/v1/todo'

  //live api url
  private userUrl:string = 'http://todoapi.ekantchawla.me/api/v1/user'
  private todoUrl:string = 'http://todoapi.ekantchawla.me/api/v1/todo'

  constructor(private _http: HttpClient) { }

  // user related apis
  login(email, password) {
    return this._http.post(this.userUrl + '/login', { email: email, password: password })
  }

  signup(email: String, password: String, firstName: String, phone: String, countryCode: String, lastName?: String) {
    let body = { email: email, password: password, firstName: firstName, phone: phone, countryCode: countryCode }
    if (lastName && lastName.trim() != '') body['lastName'] = lastName
    return this._http.post(this.userUrl + '/signup', body)
  }

  forgotPassword(email: String) {
    return this._http.post(this.userUrl + '/forgotPass', { email: email })
  }

  resetPassword(authToken: String, newPassword: String) {
    return this._http.post(this.userUrl + '/updatePass', { authToken: authToken, password: newPassword })
  }

  //Friend realated apis


  addFriend(email: String) {
    let authToken = localStorage.getItem('authToken')
    return this._http.post(this.userUrl + '/friend/sendRequest', { authToken: authToken, email: email })
  }


  listRequest(page: Number, timestamp?: number) {
    let authToken = localStorage.getItem('authToken')
    return this._http.post(this.userUrl + '/friend/listFriendRequests', { authToken: authToken, page: page, timestamp })
  }

  listFriends(page: Number, timestamp?: number) {
    let authToken = localStorage.getItem('authToken')
    return this._http.post(this.userUrl + '/friend/listFriends', { authToken: authToken, page: page, timestamp: timestamp })
  }

  acceptRequest = function (userId: String) {
    let authToken = localStorage.getItem('authToken')
    return this._http.post(this.userUrl + '/friend/acceptRequest', { authToken: authToken, userId: userId })
  }

  friendRequestCount(){
    let authToken = localStorage.getItem('authToken')
    return this._http.post(this.userUrl + '/friend/getRequestCount', { authToken: authToken })
  }

  listNotification(page: number, timestamp?: number) {
    let authToken = localStorage.getItem('authToken')
    return this._http.post(this.userUrl + '/notification/list', { authToken: authToken, page: page })
  }

  notificationCount(){
    let authToken = localStorage.getItem('authToken')
    return this._http.post(this.userUrl + '/notification/getCount', { authToken: authToken })
  }

  // Todo related apis
  createTodo(title: String, description?: String) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken: authToken, title: title }
    if (description.trim()) body['description'] = description
    return this._http.post(this.todoUrl + '/create', body)
  }

  listTodo(page: Number, userId: String, timestamp?: number) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken: authToken, page: page, timestamp: timestamp }
    if (userId) body['userId'] = userId

    return this._http.post(this.todoUrl + '/list', body)
  }

  closeTodo(todoId: String) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken: authToken, todoId: todoId }

    return this._http.post(this.todoUrl + '/closeTodo', body)
  }

  openTodo(todoId: String) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken: authToken, todoId: todoId }

    return this._http.post(this.todoUrl + '/openTodo', body)
  }

  createTodoItem(title: String, todoId: String, parentItemId: String = '') {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken: authToken, title: title, todoId: todoId, parentItemId: parentItemId }
    return this._http.post(this.todoUrl + '/createToDoItem', body)
  }

  listToDoItem(todoId: String, parentItemId: String = '') {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken: authToken, todoId: todoId, parentItemId: parentItemId }
    return this._http.post(this.todoUrl + '/listToDoItem', body)
  }

  markItemDeleted(todoId: String, itemId: String) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken: authToken, todoId: todoId, itemId: itemId }
    return this._http.post(this.todoUrl + '/markItemDeleted', body)
  }

  closeItem(todoId: String, itemId: String) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken: authToken, todoId: todoId, itemId: itemId }
    return this._http.post(this.todoUrl + '/closeItem', body)
  }

  openItem(todoId: String, itemId: String) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken: authToken, todoId: todoId, itemId: itemId }
    return this._http.post(this.todoUrl + '/openItem', body)
  }

  renameItem(todoId: String, itemId: String, title: String) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken: authToken, todoId: todoId, itemId: itemId, title: title }
    return this._http.post(this.todoUrl + '/renameItem', body)
  }

  undo(todoId: String) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken: authToken, todoId: todoId }
    return this._http.post(this.todoUrl + '/undo', body)
  }



}
