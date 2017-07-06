/*eslint-env es6*/
var EventEmitter = require('events'),
    util = require('util');
(function () {
    "use strict";

    var Multicast = function () {
        
        var config = require('../config/multicast.config.json'),
            dgram = require('dgram'),
            Æther;
        
        this.server = null;
        
        this.init = () => {
            Æther = module.parent.exports;
            Æther.log.notify('🚿 Initializing Multicast Services');
        };
        
        this.createServer = (options) => new Promise((resolve, reject) => {
            options = options || config;
            this.server = dgram.createSocket(options);
            resolve();
        });
        
        this.setupListeners = () => new Promise((resolve, reject) => {
            this.server.on('error', this.serverError);
            this.server.on('message', this.receiveMessage);
            this.server.on('listening', () => Æther.log.notify(`🚿  Completed Multicast setup`));
            resolve();
        });
        
        this.receiveMessage = (msg, rinfo) => {
            this.emit(msg, rinfo);
        };
            
        this.serverError = (msg) => {
            Æther.log.error(`🚿  Multicast Error: ${msg}`);
        };

        this.begin = () => new Promise((resolve, reject) => {
            this.createServer()
                .then(this.setupListeners)
                .then(resolve)
                .catch(this.serverError);
        });

        this.init();
        
    };
    
    util.inherits(MQTTServer, EventEmitter);
    
    module.exports = function () {
        return new Multicast();
    };
    
}());