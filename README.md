# Project Name - Real Time To do List
## Deadline - 15 Days
## Project Description
This project is aimed to create a ready to deploy Live TODO List management system.
It must have all the features mentioned below and it must be deployed on a server
before submission. There should be two separate parts of the application. A Frontend
developed and deployed using the technologies mentioned below and a REST API (with
realtime functionalities) created using the technologies mentioned below.
Frontend Technologies allowed - HTML5, CSS3, JS, Bootstrap and Angular
Backend Technologies allowed - NodeJS, ExpressJS and Socket.IO
Database Allowed - MongoDB and Redis

## Features of the Application
1) User management System -
a) Signup - User should be able to sign up on the platform providing all
details like FirstName, LastName, Email and Mobile number. Country
code for mobile number (like 91 for India) should also be stored. You may
find the country code data on these links
(http://country.io/phone.json,http://country.io/names.json)
b) Login - user should be able to login using the credentials provided at
signup.
c) Forgot password - User should be able to recover password using a link or
code on email. 

2) To do list management (single user) -
a) Once user logs into the system, he should see an option to create a ToDo
List
b) User should be able to create, a new empty list, by clicking on a create
button
c) User should be able to add, delete and edit items to the list
d) User should also be able to add sub-todo-items, as child of any item node.
Such that, complete list should take a tree shape, with items and their
child items.
e) User should be able to mark an item as "done" or "open".
f) User should be able to see his old ToDo Lists, once logged in.
3) Friend List -
a) User should also be able to send friend requests, to the users on the
system. Once requests are accepted, the friend should be added in user's
friend list. Friends should be Notified, in real time using notifications.

4) To do List management (multi-user) -
a) Friends should be able to edit, delete, update the list of the user.
b) On every action, all friends should be notified, in real time, of what specific
change is done by which friend. Also the list should be in sync with all
friends, at any time, i.e. all actions should be reflected in real time.
c) Any friend should be able to undo, any number of actions, done in past.
Each undo action, should remove the last change, done by any user.
d) Undo action should happen by a button on screen, as well as, through
keyboard commands, which are "ctrl+z" for windows and "cmd+z" for mac.

5) Error Views and messages - You have to handle each major error response
(like 404 or 500) with a different page. Also, all kind of errors, exceptions and
messages should be handled properly on frontend. The user should be aware all
the time on frontend about what is happening in the system.


# Backend Code
https://github.com/ekant-chawla/TodoApi

# Frontend Code
https://github.com/ekant-chawla/ToDoFrontEndCode

# Live Url
http://todoapp.ekantchawla.me/

# API doc
https://ekant-chawla.github.io/todoApiDoc/

https://ekant-chawla.github.io/todoSocketDoc/


# ToDoClient 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.3.

## Development server

Run `ng serve` for a dev server if you are using the live api in the api service, otherwise add `--proxy-config proxy-config.json` to enable the proxy pass and avoid CROS error. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
