/*jslint node: true, es5: true */
/*globals Promise*/
(function () {
    "use strict";
    
    var OpenWeather = function () {
        
        var apiEndpoints = {
                current : 'http://api.openweathermap.org/data/2.5/weather',
                forcast : 'http://api.openweathermap.org/data/2.5/forecast/daily'
            },
            config = require('../config/openWeather.config'),
            Æther;
            
        this.currentConditions = {
            temp : Number,
            pressure : Number,
            humidity : Number,
            temp_min : Number,
            temp_max : Number,
            sunrise : Number,
            sunset : Number,
            wind : {
                speed : Number,
                deg : Number
            },
            weather : null,
            clouds : {
                all : Number
            },
            lastUpdate : Date
        };
        
        this.forcastConditions = {
            lastUpdated : Date,
            list : Array
        };
        
        this.geolocation = {
            name : "",
            lat : 0,
            lon : 0,
            country : ""
        };
        
        this.init = () => new Promise((resolve, reject) => {
            Æther = module.parent.exports;
            Æther.log.notify('🌦  Initializing OpenWeather module');
            
        });
        
        this.begin = () => new Promise((resolve, reject) => {
            if (config.appID && config.appID !== null) {
                this.getForcast()
                    .then(this.getCurrent)
                    .then(() => {
                        setInterval(this.getCurrent, config.updateInterval);
                        setInterval(this.getForcast, config.updateInterval * 10);
                    })
                    .then(resolve)
                    .catch(err => console.log(err));
            } else {
                Æther.log.error("Invalid or missing openWeather AppID.\r\n   Visit http://openweathermap.org/ to register an\r\n   application and enter your AppID in the\r\n   ./config/openWeather.config.json file or comment\r\n   out the openWeather module in aether.js");
                resolve();
            }
        });
        
        this.getCurrent = () => new Promise((resolve, reject) => {
            Æther.log.notify('🌦  Capturing current conditions');
            Æther.delegate.getJSON(apiEndpoints.current, { id : config.cityID, appid : config.appID, units : 'metric' })
                .then(data => {
                    this.currentConditions = data.main;
                    this.currentConditions.sunrise = data.sys.sunrise;
                    this.currentConditions.sunset = data.sys.sunset;
                    this.currentConditions.weather = data.weather;
                    this.currentConditions.wind = data.wind;
                    this.currentConditions.clouds = data.clouds;
                    this.currentConditions.lastUpdate = new Date(data.dt * 1000);
                    Æther.log.notify('⛅  current conditions captured as of ' + this.currentConditions.lastUpdate);
                    resolve();
                })
                .catch(err => console.log(err));
        });
        
        this.getForcast = () => new Promise((resolve, reject) => {
            Æther.log.notify('🌦  Capturing forcast');
            Æther.delegate.getJSON(apiEndpoints.forcast, { id : config.cityID, appid : config.appID, units : 'metric' })
                .then(data => {
                    this.geolocation.name = data.city.name;
                    this.geolocation.lat = data.city.coord.lat;
                    this.geolocation.lon = data.city.coord.lon;
                    this.geolocation.country = data.city.country;
                    this.forcastConditions.list = data.list;
                    this.forcastConditions.lastUpdated = new Date();
                    Array.from(this.forcastConditions).forEach((condition, d) => {
                        this.forcastConditions[d].dt = new Date(this.forcastConditions[d].dt * 1000);
                        delete this.forcastConditions[d].dt_txt;
                    });
                    Æther.log.notify('🌦  forcast conditions captured as of ' + this.forcastConditions.lastUpdated);
                })
                .then(resolve)
                .catch(err => console.log(err));
        });
        
        this.init();
        
    };
    
    module.exports = function () {
        return new OpenWeather();
    };
    
    
}());