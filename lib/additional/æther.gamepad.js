/*eslint-env es6*/
(function () {
    "use strict";
    
    var Æther = module.parent.exports;
    
    module.exports = function () {
        Æther.log.notify('🕹 Initializing gamepad module');
        return {
            PS4 : require('./gamepads/æther.gamepad.ps4'),
            XBoxOne: require('./gamepads/æther.gamepad.xboxone'),
            Wii: require('./gamepads/æther.gamepad.wii')
        };
    };
    
}());