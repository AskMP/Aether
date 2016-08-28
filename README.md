# ⚗Æther
Simple personal framework for quick webapp tools where things like ExpressJS and Socket.io
are just built in and ready to go.

## Basic Installation:
+ Create a directory called `npm_modules` in your root folder
+ Create a new directory called `Aether` within the `npm_modules` directory.
+ Download the contents repo into that directory
+ Open the directory and run: `npm install`
+ Navigate back to the top root folder and create a file called “app.js”
+ Write `var Aether = require("aether");` to the file
+ Run the app.js within NodeJS using `node app.js`
+ Visit http://localhost:8080 in your browser

## Simple Webserver
Creating a static site is fairly straighforward. You create a folder within the root directory of your applications called `html` and unless there is a matching route defined, the file is able to be directly accessed. As an example, references to `/css/interface.css` would be located at `/html/js/interface.js`.
+ Install using method above
+ Edit the routes file located `./lib/routes/basic.js` within aether and change the path of the initial route from `/` to `/example`
+ Create a new directory within the root of your application called `html` and a file called `index.html`
```
/app.js
/http/¬
    index.html
/node_modules/
```
+ Write some HTML into that new html file
```html
<!doctype html>
    <head>
        <title>My Awesome Page!</title>
    </head>
    <body>
        <h1>Welcome to my Awesome Static Page!</h1>
    </body>
</html>
```
+ Run the app.js file using NodeJS ``` node app.js ```
+ Visit http://localhost:8080

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
