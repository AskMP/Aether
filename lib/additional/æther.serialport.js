/*eslint-env es6*/
var EventEmitter = require('events'),
    util = require('util');
(function () {
    "use strict";
    
    var Serial = function () {
        
        var SerialPort = require('serialport'),
            config = require('../config/serialPort.config.json'),
            Æther;
            
        this.board = null;
        this.ready = false;
        
        this.messageFrom = "";
        this.lastMessage = "";
        
        this.init = function () {
            Æther = module.parent.exports;
            Æther.log.notify('⚡  Initializing SerialPort module');
            
        };
        
        this.availableBoards = () => new Promise((resolve, reject) => {
            SerialPort.list((err, ports) => {
                if (err) reject(err);
                else resolve(ports);
            });
        });
        
        this.connect = (comName, baud) => new Promise((resolve, reject) => {
            comName = comName || config.comName;
            baud = baud || config.baudrate;
            if (!this.board) {
                try {
                    this.board = new SerialPort(comName, { baudRate: baud});
                    this.attachListeners()
                        .then(resolve);
                } catch (err) {
                    Æther.log.error(err);
                }
            }
        });
        
        this.attachListeners = () => new Promise((resolve, reject) => {
            this.board.on('open', this.openedConnection);
            this.board.on('disconnect', this.disconnected);
            this.board.on('close', this.reconnect);
            this.board.on('error', this.errored);
            this.board.on('data', this.receiveData);
            resolve();
        });
        
        this.openedConnection = () => {
            Æther.log.notify('⚡  Connection Made');
            
            // Arduinos often reboot upon connection, this is to ensure we
            // don't send commands prior to it being ready
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
            Æther.log.error('⚡  Errored ' + JSON.stringify(err, true, 2));
            this.emit('error', err);
            if (!this.board.isOpen()) {
                this.reconnect();
            }
        };
        
        this.reconnect = () => {
            try {
                this.board.open();
            } catch (e) {
                setTimeout(function () {
                    if (!this.board.isOpen()) {
                        this.reconnect();
                    }
                }, 3000);
            }
        };
        
        this.send = (message) => new Promise((resolve, reject) => {
            if (this.ready) {
                if (this.board.isOpen()) {
                    this.board.write(message + config.terminator);
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
        
        this.init();
        
    };
    
    util.inherits(Serial, EventEmitter);
    
    module.exports = function () {
        return new Serial();
    };
    
}());