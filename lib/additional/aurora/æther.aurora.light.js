/*eslint-env es6*/
(function () {
    "use strict";
    
    var Light = function (light) {
        
        var Aurora;
        
        this.aid = String;
        this.id = String;
        
        this.colour = 0x000000;
        this.animation = 0;
        
        this.connected = false;
        
        this.init = (light) => {
            
        };
        
        this.on = (colour) => {
            var attributes = {};
            switch (typeof colour) {
            case 'number':
                attributes.colour = colour.toString(16);
            }
        };
        
        send = (attributes) => {
            attributes = attributes || {colour : 'FFFFFF'};
            Aurora.sendToLight(this.aid, attributes);
        };
        
        this.init(light);
        
    };
    
}());