/*eslint-env es6*/
(function () {
    "use strict";
    
    var Æther = require('../');
    
    Æther.on('ready', () => {
        Æther.loadModule('mqttServer')
            .catch(Æther.log.error);
        
        Æther.mqttServer.on('testing/hello', (data) => {
            Æther.log.notify(`Received Test Payload: ${data}`);
        });
        
        Æther.mqttServer.publish('testing/hello', 'mwahaha')
            .then(() => Æther.log.notify('published!'))
            .catch(err => console.log(err));
    });
    
}());