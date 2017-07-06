/*eslint-env es6*/
var EventEmitter = require('events'),
    util = require('util');
(function () {
    "use strict";

    var MQTTServer = function () {
        
        var config = require('../config/mqttServer.config.json'),
            credentials = require('../config/mqttServer.credentials.json'),
            mosca = require('mosca'),
            Æther;
        
        this.server = null;
        
        this.init = () => {
            Æther = module.parent.exports;
            Æther.log.notify(`💡  Initializing mqttServer`);
        };
        
        this.createServer = () => new Promise((resolve, reject) => {
            this.server = new mosca.Server({
                port : config.port,
                backend: config
            });
            resolve();
        });
        
        this.setupListeners = () => new Promise((resolve, reject) => {
            this.server.on('error', this.serverError);
            this.server.on('published', (packet, client) => this.emit(packet.topic, packet.payload));
            this.server.on('ready', () => {
                this.server.authenticate = this.authenticateClient;
                Æther.log.notify(`💡  Completed mqttServer setup`)
            });
            ['clientConnected', 'published', 'subscribed', 'clientDisconnected'].forEach(this.baseEvents);
            resolve();
        });
        
        this.receiveMessage = (packet, client) => {
            this.emit(packet.topic, packet.payload);
        };
        
        this.publish = (topic, payload, qos) => new Promise((resolve, reject) => {
            qos = qos || 0;
            try {
                this.server.publish({
                    topic : topic,
                    payload : payload,
                    qos : qos
                }, resolve);
            } catch (e) {
                reject(e);
            }
        });
        
        this.baseEvents = (eventName) => {
            this.server.on(eventName, (data1, data2) => {
                Æther.log.notify(`💡  MQTT ${eventName} ${(data1 && data1.constructor.name.toLowerCase() === 'string') ? data1 : (data1 && data1.topic) ? data1.topic : ''}`);
            });
        };
        
        this.authenticateClient = (client, username, password, returnValidation) => {
            var valid = false, message = 'invalid credentials';
            if (username && password) {
                credentials.forEach(creds => {
                    if (username === creds.username && password.toString() === creds.password) {
                        valid = true;
                        message = null;
                    }
                });
            }
            (valid) ? Æther.log.notify(`💡  Valid Credentials received for: "${username}"`) : Æther.log.notify(`💡  Invalid Credentials received: "${username}"`);
            returnValidation(message, valid);
        };
            
        this.serverError = (msg) => {
            Æther.log.error(`💡  mqttError ${msg}`);
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
        return new MQTTServer();
    };
    
}());