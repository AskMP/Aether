(function () {
    "use strict";

    var MQTTClient = function () {
        
        var config = require('../config/mqtt.config.json'),
            mqtt = require('mqtt'),
            Aether;
        
        this.server = null;
        
        this.potentialEvents = {};
        
        this.init = () => {
            Aether = module.parent.exports;
            Aether.log.notify('💡  Initializing mqttClient');
        };
        
        this.connect = () => new Promise((resolve, reject) => {
            this.server = mqtt.connect(config);
            this.server.on('error', this.serverError);
            this.server.on('connect', this.serverConnected);
            this.server.on('message', this.receiveEvent);
            resolve();
        });
        
        this.setupSubscriptions = (eventName, eventMethod) => {
            this.server.subscribe('#'); // NEVER DO THIS! Super bad form…
        };
        
        this.serverConnected = (serverConnection) => {
            Aether.log.notify('💡  MQTT Connected to ' + config.host + ':' + config.port);
            this.setupSubscriptions();
        };
        
        this.receiveEvent = (topic, data) => {
            Object.keys(this.potentialEvents).forEach(event => (new RegExp(event, "gi").exec(topic)) ? this.potentialEvents[event](data, topic) : null);
        };
    
        this.serverError = (msg) => {
            Aether.log.error("💡  mqttClient " + msg);
            if (msg.toString().indexOf('Connection refused') !== -1) {
                this.server.end();
            }
        };
        
        this.begin = () => new Promise((resolve, reject) => {
            this.connect()
                .then(() => Aether.log.notify('💡  Completed mqttClient setup'))
                .then(resolve);
        });
        
        this.init();
        
    };
    
    module.exports = function () {
        return new MQTTClient();
    };
    
}());
    