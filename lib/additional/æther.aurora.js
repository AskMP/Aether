/*eslint-env es6*/
(function () {
    "use strict";
    
    var Aurora = function () {
        
        var config;
        
        this.colours = require('../config/colours.data.json');
        this.Light = require('./æther.aurora.light');
        
        this.colour = 0x000000;
        
        this.lights = [];
        
        this.init = () => {
            Æther = module.parent.exports;
            config = require('../config/aurora.config.json');
            Æther.log.notify('🌌  Initializing Aurora');
        };
        
        this.load = (lights) => new Promise((resolve, reject) => {
            switch (typeof lights) {
            case 'string':
            case 'number':
                lights = [].concat(lights);
            case 'array':
                lights = lights.filter(l => this.find(l) === undefined);
                Promise.all(lights.map(l => new Promise((res, rej) => Æther.sails.get(`lights/${l}`)
                    .then(dbItem => {
                        if (!dbItem) rej(`invalid light ${JSON.stringify(l, true, 2)}`);
                        else {
                            this.lights.push(new this.List(dbItem));
                            res();
                        }
                    })
                )))
                .then(resolve);
                break;
            default:
                reject(`Invalid light ${JSON.stringify(lights, true, 2)}`);
            }
        });
        
        this.find = this.light = (light) => {
            var lights;
            switch (typeof light) {
            case 'number':
                light = '00000'.substring(0, 5 - light.toString().length) + light.toString();
            case 'string':
                lights = this.lights.find(l => ['aid', 'id'].some(attr => l[attr] === light));
                break;
            case 'array':
                this.lights.forEach(l => {
                    l = this.find(l);
                    if (l) {
                        if (!lights) lights = [];
                        lights.push(l);
                    }
                });
            }
            return lights;
        };
        
        this.init();
        
    };
    
}());