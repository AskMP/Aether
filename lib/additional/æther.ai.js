/*eslint-env es6*/
var EventEmitter = require('events'),
    util = require('util'),
    ApiAI = require('apiai');
(function () {
    "use strict";

    var AI = function () {
        
        var config,
            Æther;
        
        // All the communication is done through a single entry point
        this.APIaiConnection;
        
        // The primary addition to the initialization here is
        // that we need to add a listener for the fallback intent
        // that has been set for Api.ai (default is “input.unknown”)
        this.init = () => {
            Æther = module.parent.exports;
            config = require('../config/ai.config.json');
            Æther.log.notify('🕴  Initializing API.ai');
            this.APIaiConnection = ApiAI(config.accessToken);
            this.on(config.fallback, this.unknownRequest);
        };
        
        /***
        * All the requests and follow ups go through the same method
        * This method takes in the text string to pass as a text request to API.ai
        * as well as any potential options, commonly the sessionId from a previous
        * request passed. The promise resolves with the request to allow for a
        * unique listener to be created for this request but the request’s response
        * is also emitted from the Æther.ai object using it’s action as a base:
        *   Example:
        *       Action = aurora.light.off
        *       Emits 3 events:
        *           “aurora”
        *           “aurora.light”
        *           “aurora.light.off”
        */
        this.request = this.followup = (message, options) => new Promise((resolve, reject) => {
            var req = this.APIaiConnection.textRequest(message, options);
            req.on('response', (data) => {
                if (data.result.action && data.result.action !== '') {
                    var emitter = '';
                    data.result.action.split('.').forEach(actionEl => {
                        emitter += (emitter === '') ? actionEl : '.' + actionEl;
                        this.emit(emitter, data);
                    });
                }
            });
            req.on('error', (err) => {
                Æther.log.error(JSON.stringify(err, true, 2));
                reject(err);
            });
            resolve(data);
            req.end();
        });
        
        this.unknownRequest = (interaction) => {
            Æther.log.notify(`🕴  Unknown Request: ${interaction.result.resolvedQuery}`);
        };
        
        this.init();
        
    };

    util.inherits(AI, EventEmitter);

    module.exports = () => new AI();

}());