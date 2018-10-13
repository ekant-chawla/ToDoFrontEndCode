import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket.service';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../helper.service';
import * as $ from 'jquery'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css'],
  host: { '(document:keydown)': 'keydown($event)' }
})
export class TodoDetailComponent implements OnInit, OnDestroy {

  todoId: String //current todo id
  userId: String //current user id
  isUsersTodoList: Boolean = false
  todo // the todo object
  disableCreateEdit: Boolean = false // disable all create and edit buttons while a request is underway.
  disableUndo: Boolean = false // disable undo operation untill previous undo action responds
  disableFetchSubTodo: Boolean = false
  gettingData: Boolean = false

  //modal variables
  public title: String
  public isNew: Boolean = true
  private parentItemId: String
  private itemId: String

  constructor(private _socket: SocketService, private _api: ApiService, private toastr: ToastrService, private _helper: HelperService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._helper.verifyUserLoginAndReroute()
    this.userId = localStorage.getItem('userId')
    this.todoId = this._route.snapshot.paramMap.get('todoId')

    if (this.userId) {

      if (!this._socket.socket) {
        this._socket.startConnection().subscribe(() => {
          this._socket.setUser()
          console.log(this._socket.socket)
        })
      }

      this.listItems()
      this.getNotificaitonCount()
      this.getRequestCount()
      this.listenForAuthError()
      this.listenForFriendNotification()
      this.listenForToDoNotification()
    }

  }

  ngOnDestroy() {
    if (this._socket.socket) this._socket.socket.off()
  }

  //api functions

  listItems() {
    this.gettingData = true
    this._api.listToDoItem(this.todoId).subscribe((response: any) => {
      this.gettingData = false
      if (response.error) {
        this.toastr.error(response.message, 'Error')
      } else {
        this.todo = response.data
        this.isUsersTodoList = this.userId == this.todo.userId
        if (!this.todo.list) this.todo.list = [] // prevent error from undefined variable incase the api does not return an empty array
        console.log(this.todo.list)
      }
    })
  }

  listSubItems(parentItemId: String) {

    if (this.disableFetchSubTodo) {
      this.toastr.info('Previous request is still under way. Please wait for it to be completed.', 'Info')
      return
    }

    this.disableFetchSubTodo = true
    this._api.listToDoItem(this.todoId, parentItemId).subscribe((response: any) => {
      if (response.error) {
        this.toastr.error(response.message, 'Error')
      } else {
        if (response.data.list && response.data.list.length > 0) this.updateSubTodoItem(response.data)
        else this.toastr.info('There are no sub todo items for this item', 'Info')
      }
      this.disableFetchSubTodo = false
    })
  }

  markItemDeleted(itemId: String) {

    let yes = confirm('Are you sure you want to delete this item?')

    if (!yes) return

    this._api.markItemDeleted(this.todoId, itemId).subscribe((response: any) => {
      if (response.error) {
        this.toastr.error(response.message, 'Error')
      } else {
        this.updateSubTodoItem(response.data)
        this.toastr.success(response.message, 'Success')
      }
    })
  }

  createItem() {
    this.disableCreateEdit = true
    this._api.createTodoItem(this.title, this.todoId, this.parentItemId).subscribe((response: any) => {


      if (response.error) {
        this.toastr.error(response.message, response.title)
      } else {
        this.updateCreatedItem(response.data)
        this.toastr.success(response.message, 'Success')
      }

      this.disableCreateEdit = false
      this.title = ''
      this.parentItemId = ''
    })
  }

  closeItem(itemId) {
    this._api.closeItem(this.todoId, itemId).subscribe((response: any) => {
      if (response.error) {
        this.toastr.error(response.message, 'Error')
      } else {
        this.updateSubTodoItem(response.data)
        this.toastr.success(response.message, 'Success')
      }
    })
  }

  openItem(itemId) {
    this._api.openItem(this.todoId, itemId).subscribe((response: any) => {
      if (response.error) {
        this.toastr.error(response.message, 'Error')
      } else {
        this.updateSubTodoItem(response.data)
        this.toastr.success(response.message, 'Success')
      }
    })
  }

  renameItem() {
    this._api.renameItem(this.todoId, this.itemId, this.title).subscribe((response: any) => {
      if (response.error) {
        this.toastr.error(response.message, 'Error')
      } else {
        console.log(response.data)
        this.updateSubTodoItem(response.data)
        this.title = ''
        this.parentItemId = ''
        this.toastr.success(response.message, 'Success')
      }
    })
  }

  undo() {

    if (this.disableUndo) {
      this.toastr.info('Previous request is still under way. Please wait for it to be completed.', 'Info')
      return
    }

    this.disableUndo = true
    this._api.undo(this.todoId).subscribe((response: any) => {
      if (response.error) {
        this.toastr.error(response.message, 'Error')
      } else {
        this.updateSubTodoItem(response.data)
        this.toastr.success(response.message, 'Success')
      }
      this.disableUndo = false
    })
  }

  openTodo() {
    this._api.openTodo(this.todoId).subscribe((response: any) => {
      if (response.error) {
        this.toastr.error(response.message, 'Error')
      } else {
        this.toastr.success(response.message, 'Success')
        this.todo.completed = response.data.completed
      }
    })
  }

  closeTodo() {
    this._api.closeTodo(this.todoId).subscribe((response: any) => {
      if (response.error) {
        this.toastr.error(response.message, 'Error')
      } else {
        this.toastr.success(response.message, 'Success')
        this.todo.completed = response.data.completed
      }
    })
  }

  //socket listners

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

      console.log(notificationObj)

      if (this.todoId == notificationObj.todo.todoId && (notificationObj.type == "todo-create" || notificationObj.type == 'todo-create-item'))
        this.updateCreatedItem(notificationObj.todo)

      if (this.todoId == notificationObj.todo.todoId && (notificationObj.type == "todo-update" || notificationObj.type == 'todo-update-item'))
        this.updateSubTodoItem(notificationObj.todo)

    })
  }

  //misc. function

  updateSubTodoItem(target: any) {
    if (target.parentItemId == '') {
      this.todo.list = this.todo.list.map((item) => {
        if (item.id == target.id) {
          if (target.list) {
            return target
          }
          else {
            // this is done to prevent losing an already fetched sub todo list

            target.list = item.list
            return target
          }
        }
        return item
      })

    } else {
      for (let item of this.todo.list) {
        if (item.id == target.parentItemId) {
          let elementFound = false
          if (!item.list) item.list = [] // if there is no list then we create an empty list

          item.list = item.list.map((subitem) => {
            if (subitem.id == target.id) {
              elementFound = true
              return target
            }
            else return subitem
          })

          if (!elementFound) item.list.unshift(target)

          this.todo.list = this.todo.list.map((parentItem) => {
            if (parentItem.id == item.id) {
              return item
            }
            return parentItem
          })

          break
        }
      }
    }
  } // find the todo item and update its sub todo list.

  updateCreatedItem(target: any) {
    console.log(target)
    if (target.parentItemId == '') {
      this.todo.list.unshift(target)
    } else {

      for (let item of this.todo.list) {
        if (item.id == target.parentItemId) {
          if (!item.list) item.list = []
          item.list.unshift(target)

          this.todo.list = this.todo.list.map((parentItem) => {
            if (parentItem.id == item.id) {
              return item
            }
            return parentItem
          })
          break;
        }
      }
    }
  }

  logout() {
    this._socket.disconnect()
    this._helper.logout()
  }

  openCreateNew(parentItemId) {
    this.isNew = true
    this.title = ''
    this.parentItemId = parentItemId
    $('#b').trigger('click')
  }

  openEdit(itemId, title) {
    this.isNew = false
    this.title = title
    this.itemId = itemId
    $('#b').trigger('click')
  }


  keydown(e) {
    var evtobj = window.event ? event : e
    if (evtobj.keyCode == 90 && (evtobj.ctrlKey || evtobj.metaKey)) this.undo();
  }

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
