/*eslint-env es6*/
var Twilio = require('twilio');
(function () {
    "use strict";
    
    var SMS = function () {
        
        var config,
            Æther;
        
        this.twilioClient;
        
        this.init = () => {
            Æther = module.parent.exports;
            config = require('../config/sms.config.json');
            Æther.log.notify('📱  Initializing SMS');
            this.twilioClient = Twilio(config.twilio.sid, config.twilio.token);
        };
        
        this.send = (to, message) => new Promise((resolve, reject) => {
            this.twilioClient.messages.create({
                to : to,
                from : config.sms.from,
                body : message
            }, (err, message) => {
                if (err) {
                    Æther.log.error(`📱  SMS Error: ${JSON.stringify(err, true, 2)}`);
                    reject(err);
                } else {
                    Æther.log.notify(`📱  Message Sent`);
                    resolve(message);
                }
            })
        });
        
        this.init();
        
    };
    
    module.exports = function () {
        return new SMS();
    };
    
}())