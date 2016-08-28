/*eslint-env es6*/
(function () {
    "use strict";
    
    /***
    * One of the foundation modules for Æther, a super
    * simple socket server that allows for other modules
    * to add listeners to the connections dynamically
    * rather than having all the listeners listed in here
    */
    var SocketServer = function () {
        
        var io = require('socket.io'),
            fs = require('fs'),
            Æther;
        
        this.io = null;
        
        // Other modules have access to this object
        // which uses it’s keys as listener labels
        this.potentialEvents = {};
        
        this.init = function () {
            Æther = module.parent.exports;
            Æther.log.notify('🔌  Initializing SocketServer');
        };
        
        // Similar to a catch all but allowing for events to be triggered remotely for any
        // module to get. This re-broadcasts internally events using the same methog that
        // the websockets events would be.
        // Messages that are not tagged with 'aether' as their event will work as expected
        this.aetherEvent = (message, connection) => {
            message.evt = message.evt || message['@evt'] || message.event || message['@event'] || false;
            message.data = message.data || message['@data'] || {};
            if (!message.evt) {
                connection.emit('error', 'Valid evt not provided');
            } else {
                Æther.event(message, 'SocketServer');
            }
        };
        
        // Allow the global object to run the begin to reduce conflicts
        this.begin = () => new Promise((resolve, reject) => {
            // Add a global catch event for re-broadcasting events
            this.potentialEvents.aether = this.aetherEvent;
            this.io = io(Æther.webServer.server);
            this.io.on('connection', this.resolveConnection);
            Æther.log.notify('🔌  Completed SocketServer setup');
            resolve();
        });
        
        // Append all the listeners to the object.
        // This is a catch all for everything, if connections should
        // be authenticated or validated before adding particular
        // listeners, than a more in-depth solution will be needed.
        this.resolveConnection = (connection) => {
            Æther.log.notify('🔌  New connection');
            Object.keys(this.potentialEvents).forEach((event) => {
                connection.on(event, (data) => this.potentialEvents[event](data, connection));
            });
        };
        
        this.init();
        
    };
    
    module.exports = function () {
        return new SocketServer();
    };
    
}());
    