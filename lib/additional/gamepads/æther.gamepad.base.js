/*eslint-env es6*/
var HID = require('node-hid'),
    EventEmitter = require('events'),
    util = require('util');
require('object.observe');
(function () {
    "use strict";
    
    var baseController = function (path, productId, vendorId) {
        
        var Æther = module.parent.parent.parent.exports;
        
        this.config = {
            gamespeed : 1000 / 30,
            buttons : [
                // All
                "up",
                "down",
                "left",
                "right",
                "home",
                
                // PS4 & XBox
                "south",
                "east",
                "west",
                "north",
                "leftBumper",
                "rightBumper",
                "leftTrigger",
                "rightTrigger",
                "leftStickBtn",
                "rightStickBtn",
                "share",
                "options",
                
                // Wii Only
                "plus",
                "minus",
                "a",
                "b",
                "one",
                "two"
            ]
        };
        
        this.leftStick = {
            x : 0,
            y : 0
        };
            
        this.rightStick = {
            x : 0,
            y : 0
        };
        
        this.triggers = {
            left: 0,
            right: 0
        };
        
        this.buttons = {};
        this.holding = [];
        this.connection = null;
        this.iterator = null;
        
        this.init = () => new Promise((resolve, reject) => {
            this.config.buttons.forEach(btn => this.buttons[btn] = false);

            Object.observe(this.buttons,    this.buttonUpdate);
            Object.observe(this.triggers,   this.triggersUpdate);
            Object.observe(this.leftStick,  changes => this.stickUpdate(changes, 'left'));
            Object.observe(this.rightStick, changes => this.stickUpdate(changes, 'right'));
            
            resolve();
        });
        
        this.beginIterator = () => new Promise((resolve, reject) => {
            this.iterator = setInterval(this.emitHolds, this.config.gamespeed);
            resolve();
        });
        
        this.emitHolds = () => {
            if (this.holding.length > 0) {
                this.holding.forEach(hold =>{
                    if (this.config.buttons.indexOf(hold) !== -1) {
                        this.emit(hold + ':hold');
                    } else if (hold.indexOf(':') !== -1) {
                        this.emit(hold.split(':')[0] + ':hold', this.triggers[hold.split(':')[0].replace('Trigger', '')]);
                    } else if (hold.indexOf('.') !== -1) {
                        this.emit(hold.split('.')[0] + ':hold', this[hold.split('.')[0]]);
                    }
                });
            }
        };
        
        this.buttonUpdate = (changes) => {
            changes.forEach((change) => {
                this.emit(change.name + ':' + ((change.object[change.name]) ? 'down' : 'up'));
                if (change.object[change.name]) {
                    this.holding.push(change.name);
                } else {
                    this.holding.splice(this.holding.indexOf(change.name), 1);
                }
            });
        };
        
        this.triggersUpdate = (changes) => {
            changes.forEach((change) => {
                this.emit(change.name + 'Trigger', change.object[change.name]);
                this.holding.splice(this.holding.indexOf(change.name + 'Trigger:'), 1);
                if (change.object[change.name] > 0) {
                    this.holding.push(change.name + 'Trigger:');
                }
            });
        };
        
        this.stickUpdate = (changes, side) => {
            this.emit(side + 'Stick', this[side + 'Stick']);
            this.holding.splice(this.holding.indexOf(side + 'Stick.'), 1);
            if (Math.abs(this[side + 'Stick'].x) + Math.abs(this[side + 'Stick'].y) > 0) {
                this.holding.push(side + 'Stick.');
            }
        };
        
        this.connectToController = () => new Promise((resolve, reject) => {
            HID.devices().forEach(device => {
                if (this.config.path) {
                    if (this.config.path === device.path) {
                        this.connection = new HID.HID(device.path);
                    }
                } else {
                    if (device.productId === this.config.productId && device.vendorId === this.config.vendorId) {
                        this.connection = new HID.HID(device.path);
                    }
                }
            });
            
            if (this.connection !== null) {
                this.emit('connect');
                Æther.log.notify("🕹  gamepad Connected: " + ((!this.config.path) ? this.config.name : this.config.path));
                resolve();
            } else {
                if (this.config.path) {
                    reject('No controller found with path of ' + this.config.path);
                } else {
                    reject('No controller found with ID ' + this.config.productId);
                }
            }
            resolve();
        });
        
        this.attachListeners = () => new Promise((resolve, reject) => {
            this.connection.on('data', (data) => this.processData(data, this));
            this.connection.on('error', () => {
                this.connection = null;
                this.emit('disconnect');
                clearInterval(this.iterator);
                setTimeout(this.attemptLoad, 5000);
            });
            resolve();
        });
        
        this.byteToArray = (bytes) => (('00000000')
                .substring(0, 8 - bytes.toString(2).length) + bytes.toString(2))
                .split('')
                .map(this.isOne);
        
        this.isOne = n => n === '1';
        this.toOne = n => (n) ? '1' : '0';
        
        this.attemptLoad = (path, productId, vendorId) => {
            this.setConfig(path, productId, vendorId)
                .then(this.init)
                .then(this.connectToController)
                .then(this.attachListeners)
                .then(this.beginIterator)
                .then(this.ready)
                .catch(err => {
                    Æther.log.error('🕹 gamepad Error:' + JSON.stringify(error));
                    setTimeout(this.attemptLoad, 1000);
                })
        };
        
        this.ready = () => this.emit('ready', this);
        
        this.attemptLoad(path, productId, vendorId);
        
    };
    
    util.inherits(baseController, EventEmitter);
    
    module.exports = baseController;
    
}());