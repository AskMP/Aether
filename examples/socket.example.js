/*eslint-env es6*/
(function () {
    "use strict";
    
    var Æther = require('../'),
        fs = require('fs');
    
    Æther.on('ready', () => {
        
        /****************************************************************
        * We override the base path of the server for this example only.
        * In most cases, you would simply change the route within the 
        * basic.js file but since this is an example, overriding it is
        * just as good.
        ***/
        Æther.webServer.setupRouteModule({
            path : '/',
            method : 'get',
            handler : (req, res) => {
                fs.readFile('./socketexample/index.html', (err, data) => {
                    res.end(data);
                });
            }
        });
        
        /****************************************************************
        * We can add event listeners directly to the socket server by
        * adding attibutes to the potentialEvents variable of the server.
        * This then takes each connection and applies the listener to it
        ***/
        Æther.socketServer.potentialEvents.greetings = (data, connection) => {
            connection.emit('welcome', 'Greetings to you to: ' + connection.id);
        };
        
        /****************************************************************
        * If you have more complex things you want to do with Socket.io
        * you can interact directly with the server using the io attribute
        ***/
        Æther.socketServer.potentialEvents.shout = (data, connection) => {
            Æther.socketServer.io.emit('shouting', data);
        };
    });
    
}());