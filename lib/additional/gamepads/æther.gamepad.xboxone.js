/*eslint-env es6*/
var baseController = require('./æther.gamepad.base');
(function () {
    "use strict";
    
    class XBoxOne extends baseController {
        
        setConfig(path, productId, vendorId) {
            return new Promise((resolve, reject) => {
                this.config.name = 'XBoxOne Controller';
                this.config.productId = (productId !== undefined) ? productId : 733;
                this.config.vendorId = (vendorId !== undefined) ? vendorId : 1118;
                this.config.path = (path !== undefined) ? path : false;
                resolve();
            });
        }
        
        processData(data, gamepad) {
            
            // Process the analog attributes
            var tmp,
                x1 = (Math.floor(data.readInt16LE(6) / 256)),
                y1 = (Math.floor(data.readInt16LE(8) / 256)),
                x2 = (Math.floor(data.readInt16LE(10) / 256)),
                y2 = (Math.floor(data.readInt16LE(12) / 256));
            
            gamepad.leftStick.x    = (Math.abs(x1) > 10) ? x1 : 0;
            gamepad.leftStick.y    = (Math.abs(y1) > 10) ? y1 : 0;
            gamepad.rightStick.x   = (Math.abs(x2) > 10) ? x2 : 0;
            gamepad.rightStick.y   = (Math.abs(y2) > 10) ? y2 : 0;

            // Process the action buttons
            [   gamepad.buttons.north,
                gamepad.buttons.west,
                gamepad.buttons.east,
                gamepad.buttons.south,
                tmp,
                gamepad.buttons.home,
                gamepad.buttons.rightBumper,
                gamepad.buttons.leftBumper] = gamepad.byteToArray(data[3]);
            
            // Process the Triggers of the gamepad
            gamepad.triggers.left  = data[4] / 2;
            gamepad.triggers.right = data[5] / 2;
            gamepad.buttons.leftTrigger = (gamepad.triggers.left > 0);
            gamepad.buttons.rightTrigger = (gamepad.triggers.right > 0);
//            gamepad.buttons.home = data[7][7] === '1';
            
            // Process general buttons
            [   gamepad.buttons.rightStickBtn,
                gamepad.buttons.leftStickBtn,
                gamepad.buttons.share,
                gamepad.buttons.options,
                gamepad.buttons.right,
                gamepad.buttons.left,
                gamepad.buttons.down,
                gamepad.buttons.up] = gamepad.byteToArray(data[2]);
            
        }
        
    };
    
    module.exports = XBoxOne;
    
}());