/*eslint-env es6*/
(function () {
    "use strict";
    
    var Æther = require('../');
    var HID = require('node-hid');
    
    Æther.on('ready', () => {
        HID.devices().forEach(device => {
            console.log(device);
        });
    });
    
}());