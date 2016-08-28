# ⚗Æther
Simple personal framework for quick webapp tools where things like ExpressJS and Socket.io
are just built in and ready to go.

## Basic Installation:
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
+ Repeat the process for the Simple Webserver isntallation
+ Edit the `webServer.config.json` file
```
/node_modules/¬
    /aether/¬
        /config/¬
            …
            webServer.config.json
            …
```
+ Run the app.js in NodeJS `sudo node app.js`

## Using th Socket.io module
The **Socket.io** module called socketServer automatically loads unless removed and works easily by adding methods to the `potentialEvents` attribute.

On the client side, within the `app.js` file, you could write:
```JavaScript
Aether.socketServer.potentialEvents.hello = (data, connection) => {
    if (data.toLowerString() === 'open the pod bay doors hal') {
        connection.emit('hal', 'I can’t do that dave.');
    } else {
        connection.emit('response', 'I received: ' + data);
    }
}
```
You would then need to include the **Socket.io** script within your HTML which can be done by either using a CDN or the header script:
```html
<script src="http://localhost:8080/socket.io/socket.io.js"></script>
```
> If you are using port 80 for your web server, you **do not** need to include the hostname and port number `<script src="/socket.io/socket.io.js"></script>`

On the client side within the `/html/js/interface.js` file, you would write:
```JavaScript
var server = (document.location.port !== "") ? io(document.location.origin + ':' + document.location.port) : io();

server.on('response', (message) => console.log(message));
server.on('hal', (message) => console.log(message));

server.emit('hello', 'world');
```
With the site open you should see “I received: world” in the console. You can test the "hal" event by entering in your console:
```JavaScript
server.emit('hello', 'Open the pod bay doors HAL');
```
### A Little bit more with Socket.io
You likely want to do something a bit more with **Socket.io**, such as broadcast when something has occured. In order to do this, simply use the `io` attribute of the socketServer to command **Socket.io** like you would natively.
```JavaScript
Aether.socketServer.io.emit('hello', 'Greetings everybody that is connected!');
```
