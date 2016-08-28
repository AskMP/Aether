/*eslint-env es6*/
(function () {
    "use strict";
    
    var Æther = require('../');
    
    Æther.on('ready', () => Æther.log.notify('Server is up and running'));
    
}());