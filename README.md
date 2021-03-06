# ⚗Æther
Simple personal framework for quick webapp tools where things like ExpressJS and Socket.io
are just built in and ready to go.

## Basic Installation
+ Create a directory called `node_modules` in your root folder
+ Create a new directory called `Aether` within the `node_modules` directory.
+ Download the contents repo into that directory
+ Open the directory and run: `npm install`
+ Navigate back to the top root folder and create a file called `app.js`
+ Write `var Aether = require("aether");` to the file
+ Run the app.js within NodeJS using `node app.js` in your terminal
+ Visit `http://localhost:8080` in your browser

## Simple Webserver
Creating a static site is fairly straightforward. You create a folder within the root directory of your applications called `html` and unless there is a matching route defined, the file is able to be directly accessed. As an example, references to `/js/interface.js` would be located at `/html/js/interface.js`.
+ Install using method above
+ Edit the routes file located `./lib/routes/basic.js` within aether and change the path of the initial route from `/` to `/example`
+ Create a new directory within the root of your application called `html` and a file called `index.html`
```
/app.js
/html/¬
 index.html
/node_modules/
```
+ Write some HTML into that new html file
```html
<!doctype html>
<html>
 <head>
  <title>My Awesome Page!</title>
 </head>
 <body>
  <h1>Welcome to my Awesome Static Page!</h1>
 </body>
</html>
```
+ Run the app.js file using NodeJS ``` node app.js ```
+ Visit `http://localhost:8080`

## Slightly More Advanced Webserver
Creating a standard webserver on port 80 is as simple as updating the config file and running the NodeJS app under the super user.
+ Repeat the process for the Simple Webserver installation
+ Change the port number within the `webServer.config.json` file
```
/node_modules/¬
 /aether/¬
  /lib/¬
/config/¬
 …
 webServer.config.json
 …
```
+ Run the app.js in NodeJS `sudo node app.js`
You can then create your own custom routes by editing / duplicating the `basic.js` or `api.js` file within the routes directory
```
 /node_modules/¬
  /aether/¬
 /lib/¬
 /routes/¬
  api.js
  basic.js
```
+ The route files are loaded and are treated as either a collection of routes or a single route. These routes have 3 attributes:
```JavaScript
{
 path : String [ExpressJS style route],
 method : String [all, get, post, put, delete] // Optional defaults to “all”,
 handler : function (request, response, next) // See ExpressJS documentation for details https://expressjs.com/en/guide/routing.html
}
```

## Using th Socket.io module
The *Socket.io* module called socketServer automatically loads unless removed and works easily by adding methods to the `potentialEvents` attribute.

On the client side, within the `app.js` file, you could write:
```JavaScript
Aether.socketServer.potentialEvents.hello = (data, connection) => {
 connection.emit('response', 'I received: ' + data);
}
```
You would then need to include the *Socket.io* script within your HTML which can be done by either using a CDN or the header script:
```html
<script src="http://localhost:8080/socket.io/socket.io.js"></script>
```
> If you are using port 80 for your web server, you **do not** need to include the hostname and port number `<script src="/socket.io/socket.io.js"></script>`

On the client side within the `/html/js/interface.js` file, you would write:
```JavaScript
var server = io();
server.on('response', (message) => console.log(message));
server.emit('hello', 'world');
```
### A Little bit more with Socket.io
You likely want to do something a bit more with *Socket.io*, such as broadcast when something has occured. In order to do this, simply use the `io` attribute of the socketServer to command *Socket.io* like you would natively.
```JavaScript
Aether.socketServer.io.emit('hello', 'Greetings everybody that is connected!');
```
To get more in depth with Socket.io, you can treat the Aether.socketServer.io as the standard `io` variable from the [**_Socket.io Documentation_**](http://socket.io/docs/)