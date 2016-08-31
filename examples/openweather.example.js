/*eslint-env es6*/
(function () {
    "use strict";
    
    var Æther = require('../'),
        fs = require('fs');
    
    // For the Open Weather example, we’re going to assume that you’re also
    // going to want to create a socket.io server and push the data to
    // connected clients upon an update.
    Æther.on('ready', () => {
        
        if (Æther.openWeather === null) {
            Æther.loadModule('openWeather');
        }
        
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
                fs.readFile('./openWeatherExample/index.html', (err, data) => {
                    res.end(data);
                });
            }
        });
        
        /****************************************************************
        * First thing is that we setup some socket listeners for any
        * requests coming from the client. These will likely only be used
        * during the initial connection but don’t require additional API
        * calls to the openweather.org server. We already have the latest
        * available so simply emit those back to the connection.
        ***/
        Æther.socketServer.potentialEvents.getGeolocation   = (data, connection) => connection.emit('geolocation',  Æther.openWeather.geolocation);
        Æther.socketServer.potentialEvents.getCurrent       = (data, connection) => connection.emit('current',      Æther.openWeather.currentConditions);
        Æther.socketServer.potentialEvents.getForcast       = (data, connection) => connection.emit('forcast',      Æther.openWeather.forcastConditions);
        
        /****************************************************************
        * Now we setup listeners for any time the openweather responses
        * come back and we emit those to any io connection that is online.
        * Note that if you expect high volume, you should instead use a
        * list of people within a socket.io "room", but you’ll need to
        * see the socket.io instructions for more details there.
        ***/
        Æther.openWeather.on('forcast', (data) => {
            Æther.socketServer.io.emit('forcast', data);
        });
        
        Æther.openWeather.on('current', (data) => {
            Æther.socketServer.io.emit('current', data);
        });
        
    });
    
}());