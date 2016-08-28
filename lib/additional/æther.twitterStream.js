/*eslint-env es6*/
var EventEmitter = require('events'),
    util = require('util');
(function () {
    "use strict";
    
    var Twitter = function () {
        
        var Twit = require('twit'),
            config = require('../config/twitter.config.json'),
            Æther;
            
        this.connection = null;
        this.connected = false;
        this.stream = null;
        this.terms = [];
        
        this.init = () => new Promise((resolve, reject) => {
            Æther = module.parent.exports;
            Æther.log.notify('🐦  Twitter Initializing');
            resolve();
        });
        
        this.stream = (searchTerm, endpoint) => new Promise((resolve, reject) => {
            this.terms = searchTerm || this.terms;
            endpoint = endpoint || 'statuses/filter'; // great case for ES6 defaults but 4.5.x doesn’t support yet
            this.disconnect()
                .then(this.normalizeTerms)
                .then((searchOptions) => this.connection.stream(endpoint, searchOptions))
                .then(this.attachListeners)
                .then(resolve);
        });
            
        this.normalizeTerms = () => new Promise((resolve, reject) => {
            switch (this.terms.constructor.name.toLowerCase()) {
            case "object":
                resolve(this.terms);
                break;
            case "string":
            case "number":
                resolve({track: this.terms});
                break;
            case "array":
                resolve({track: this.terms.join(',')});
                break;
            case "function":
                this.normalizeTerms(this.terms())
                    .then(resolve);
                break;
            case "promise":
                this.terms()
                    .then(this.normalize)
                    .then(resolve);
                break;
            }
        });
        
        this.attachListeners = (stream) => new Promise((resolve, reject) => {
            this.stream = stream;
            this.stream.on('tweet', this.receiveTweet);
            this.stream.on('connected', this.connectedToTwitter);
            this.stream.on('error', this.errored);
            this.stream.on('disconnect', this.disconnectedFromTwitter);
            resolve();
        });
        
        this.disconnect = () => new Promise((resolve, reject) => {
            if (this.connected) {
                this.stream.stop();
            }
            setTimeout(resolve, 250);
        });
        
        this.connectedToTwitter = (connection) => {
            this.connected = true;
            this.emit('connected', connection);
            Æther.log.notify('🐦  Connected to Twitter');
        };
        
        this.errored = (err) => {
            this.emit('error', err);
            Aether.log.error("🐦  Twitter Error:\r\n" + JSON.stringify(err, true, 2));
        };
        
        this.disconnectedFromTwitter = () => {
            this.connected = false;
            this.emit('disconnected');
            Æther.log.notify('🐦  Disconnected to Twitter');
        };
        
        this.receiveTweet = (tweet) => {
            this.emit('tweet', tweet);
            Æther.log.notify('🐦  Received Tweet');
        };
        
        this.begin = () => new Promise((resolve, reject) => {
            this.connection = new Twit(config);
            resolve();
        });
        
        this.init();
    };
    
    util.inherits(Twitter, EventEmitter);
    
    module.exports = function () {
        return new Twitter();
    };
    
    
}());