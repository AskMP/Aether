/*eslint-env es6*/
(function () {
    
    VRCamera = function () {
        
        var Æther;
        
        this.position = {
            direction : 0,  // -180 to 180
            pitch : 0,      // -180 to 180
            Roll : 0,       // -180 to 180
            x : 0,          // Float
            y : 0,          // Float
            z : 0           // Float
        };
        
        this.offset = {
            direction : 0,
            pitch : 0,
            roll : 0,
            x : 0,
            y : 0,
            z : 0
        };
        
        this.netcode = () => Object.keys(this.position).map(key => this.offset[key] + this.position[key]);
        
    };
    
    module.exports = VRCamera;
    
}());