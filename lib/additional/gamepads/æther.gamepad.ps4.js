/*eslint-env es6*/
var baseController = require('./æther.gamepad.base');
(function () {
    "use strict";
    
    class PS4 extends baseController {
        
        setConfig(path, productId, vendorId) {
            return new Promise((resolve, reject) => {
                this.config.name = 'PS4 Controller';
                this.config.productId = (productId !== undefined) ? productId : 1476;
                this.config.vendorId = (vendorId !== undefined) ? vendorId : 1356;
                this.config.path = (path !== undefined) ? path : false;
                resolve();
            });
        }
        
        processData(data, gamepad) {
            // Process the analog attributes
            var x1 = (Math.abs(data[1] - 128 - gamepad.leftStick.x)  > 1) ? data[1] - 128 : gamepad.leftStick.x,
                y1 = (Math.abs(data[2] - 128 - gamepad.leftStick.y)  > 1) ? data[2] - 128 : gamepad.leftStick.y,
                x2 = (Math.abs(data[3] - 128 - gamepad.rightStick.x) > 1) ? data[3] - 128 : gamepad.rightStick.x,
                y2 = (Math.abs(data[4] - 128 - gamepad.rightStick.y) > 1) ? data[4] - 128 : gamepad.rightStick.y,
                directions = data[5];

            gamepad.leftStick.x    = (Math.abs(x1) > 6) ? x1 : 0;
            gamepad.leftStick.y    = (Math.abs(y1) > 6) ? y1 : 0;
            gamepad.rightStick.x   = (Math.abs(x2) > 6) ? x2 : 0;
            gamepad.rightStick.y   = (Math.abs(y2) > 6) ? y2 : 0;
            gamepad.triggers.left  = data[8];
            gamepad.triggers.right = data[9];
            gamepad.buttons.home = gamepad.byteToArray(data[7])[7];
            
            // Process the action buttons
            [   gamepad.buttons.north,
                gamepad.buttons.east,
                gamepad.buttons.south,
                gamepad.buttons.west
            ] = gamepad.byteToArray(directions);
            
            // Process general Buttons 1
            directions = ('00000000'.substring(0, 8 - directions.toString(2).length) + directions.toString(2)).substring(4);
            gamepad.buttons.up    = (['0111', '0001', '0000'].indexOf(directions) > -1);
            gamepad.buttons.right = (['0011', '0010', '0001'].indexOf(directions) > -1);
            gamepad.buttons.down  = (['0101', '0100', '0011'].indexOf(directions) > -1);
            gamepad.buttons.left  = (['0111', '0110', '0101'].indexOf(directions) > -1);
            
            // Prcess general buttons
            [   gamepad.buttons.rightStickBtn,
                gamepad.buttons.leftStickBtn,
                gamepad.buttons.options,
                gamepad.buttons.share,
                gamepad.buttons.rightTrigger,
                gamepad.buttons.leftTrigger,
                gamepad.buttons.rightBumper,
                gamepad.buttons.leftBumper] = gamepad.byteToArray(data[6]);
        }
        
    };
    
    module.exports = PS4;
    
}());