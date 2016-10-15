/*eslint-env es6*/

// IN DEVELOPMENT

(function () {
    "use strict";
    
    var Æther = require('../'),
        fs = require('fs');
    
    // For the Open Weather example, we’re going to assume that you’re also
    // going to want to create a socket.io server and push the data to
    // connected clients upon an update.
    Æther.on('ready', () => {
        
        if (Æther.camera === null) {
            Æther.loadModule('camera');
        }

        Æther.camera.list()
            .then(cameras => {
                cameras.forEach(device => {
                    if (device.toLowerCase().indexOf('facetime') !== -1) {
                        Æther.camera.device.input = device;
                        return true;
                    }
                });
                return false;
            })
            .then(Æther.camera.record)
            .catch(console.log);
        
    });
    
}());