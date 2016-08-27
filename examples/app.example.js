/*jslint node: true*/
(function () {
    "use strict";
    
    var Aether = require('../');
    
    Aether.on('ready', () => Aether.log.notify('Server is up and running'));
    
}());