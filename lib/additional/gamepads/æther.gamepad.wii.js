/*eslint-env es6*/
var baseController = require('./æther.gamepad.base');
(function () {
    "use strict";
    
    class Wii extends baseController {
        
        setConfig(path, productId, vendorId) {
            return new Promise((resolve, reject) => {
                this.config.name = 'Wii Controller';
                this.config.productId = (productId !== undefined) ? productId : 774;
                this.config.vendorId = (vendorId !== undefined) ? vendorId : 1406;
                this.config.path = (path !== undefined) ? path : false;
                resolve();
            });
        }
        
        processData(data, gamepad) {
            var buttons = gamepad.byteToArray(data[1]);
            gamepad.buttons.up     = buttons[4];
            gamepad.buttons.left   = buttons[7];
            gamepad.buttons.right  = buttons[6];
            gamepad.buttons.down   = buttons[5];
            gamepad.buttons.plus   = buttons[3];
            
            buttons = gamepad.byteToArray(data[2]);
            gamepad.buttons.b      = buttons[5];
            gamepad.buttons.a      = buttons[4];
            gamepad.buttons.one    = buttons[6];
            gamepad.buttons.two    = buttons[7];
            gamepad.buttons.home   = buttons[0];
            gamepad.buttons.minus  = buttons[3];

        }
        
    };
    
    module.exports = Wii;
    
}());