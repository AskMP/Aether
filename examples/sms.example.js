/*eslint-env es6*/
(function () {
    "use strict";
    
    var Æther = require('../');
    
    Æther.on('ready', () => {
        
        // Ensure that the SMS module is loaded into Æther
        if (Æther.sms === null) {
            Æther.loadModule('sms');
        }
        
        /****************************************************************
        * You will need to create an account and number with Twilio before
        * sending any messages. There is a trial mode that you will be
        * to use in order to test but it will have a prefix string at the
        * beginning of the message.
        *
        * Enter your SID and TOKEN in the configuration file as well as
        * the number you get.
        ***/
        Æther.sms.send('[ENTER YOUR CELL HERE]', 'Greetings and Salutations!')
            .catch(err => console.log('ERROR:', err));
        
    });
}());