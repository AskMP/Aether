/*eslint-env es6*/
var EventEmitter = require('events'),
    util = require('util');
(function () {
    "use strict";
    
    var Serial = function () {
        
        var SerialPort = require('serialport'),
            config = require('../config/serialPort.config.json'),
            Æther;
            
        this.connection = null;
        this.potentialConnections = [];
        this.ready = false;
        
        this.messageFrom = "";
        this.lastMessage = "";
        
        this.init = () => {
            Æther = module.parent.exports;
            Æther.log.notify('⚡  Initializing SerialPort module');
        };
        
        this.begin = () => new Promise((resolve, reject) => {
            this.availableConnections()
                .then(connections => this.potentialConnections = connections)
                .then(resolve)
                .then(this.emitReady)
                .catch(err => {
                    Æther.log.error(`⚡ SerialPort Error: ${JSON.stringify(err, true, 2)}`);
                    reject(err);
                });
        });
        
        this.availableConnections = () => new Promise((resolve, reject) => {
            SerialPort.list((err, ports) => {
                if (err) reject(err);
                else resolve(ports);
            });
        });
        
        this.connect = (com, baud) => new Promise((resolve, reject) => {
            com = com || config.com;
            baud = baud || config.baudrate;
            if (!this.connection) {
                try {
                    switch (typeof com) {
                        case 'string' :
                            if (this.potentialConnections.find(connection => connection))
                            this.connection = new SerialPort(com, { baudRate: baud});
                            break;
                        case 'object' :
                            Object.keys(com).forEach(key => {
                                if (!this.connection) {
                                    this.connection = this.potentialConnections.find(connection => (connection[key] && connection[key].toString().toLowerCase().indexOf(com[key].toString().toLowerCase()) !== -1));
                                    if (this.connection) this.connection = new SerialPort(this.connection.comName, { baudRate: baud });
                                }
                            });
                            break;
                    }
                    if (this.connection) {
                        this.attachListeners()
                            .then(resolve);
                    } else {
                        Æther.log.error(`⚡ SerialPort Error: Invalid Port ${JSON.stringify(com, true, 2)}`);
                        reject('invalid port provided');
                    }
                } catch (err) {
                    Æther.log.error(`⚡ SerialPort Error: ${JSON.stringify(err, true, 2)}`);
                }
            }
        });
        
        this.attachListeners = () => new Promise((resolve, reject) => {
            this.connection.on('open', this.openedConnection);
            this.connection.on('disconnect', this.disconnected);
            this.connection.on('close', this.reconnect);
            this.connection.on('error', this.errored);
            this.connection.on('data', this.receiveData);
            resolve();
        });
        
        this.openedConnection = () => {
            Æther.log.notify('⚡  Connection Made');
            
            // Some connections, like Arduinos, often reboot upon connection,
            // this is to ensure we don't send commands prior to it being ready
            setTimeout(() => {
                this.ready = true;
                this.emit('connected');
            }, config.bootDelay);
        };
        
        this.disconnected = () => {
            Æther.log.notify('⚡  Disconnected');
            this.ready = false;
            this.emit('disconnected');
        };
        
        this.errored = (err) => {
            Æther.log.error('⚡ SerialPort Error: ' + JSON.stringify(err, true, 2));
            this.emit('error', err);
            if (!this.connection.isOpen()) {
                this.reconnect();
            }
        };
        
        this.reconnect = () => {
            try {
                this.connection.open();
            } catch (e) {
                setTimeout(() => {
                    if (!this.connection.isOpen()) this.reconnect();
                }, 3000);
            }
        };
        
        this.send = (message) => new Promise((resolve, reject) => {
            if (this.ready) {
                if (this.connection.isOpen()) {
                    this.connection.write(message + config.terminator);
                    resolve();
                }
            }
        });
        
        this.receiveData = (message) => {
            this.messageFrom += message.toString();
            this.emit('data', message);
            if (this.messageFrom.substr(-2) === config.terminator) {
                this.lastMessage = this.messageFrom.trim();
                this.messageFrom = "";
                this.emit('message', this.lastMessage);
            }
        };
        
        this.emitReady = () => new Promise((resolve, reject) => {
            this.emit('ready', this);
        });
        
        this.init();
        
    };
    
    util.inherits(Serial, EventEmitter);
    
    module.exports = function () {
        return new Serial();
    };
    
}());