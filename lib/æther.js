/*eslint-env es6*/
var extend = require('extend'),
    EventEmitter = require('events'),
    util = require('util');
(function () {
    "use strict";
    
    /***
    * Very basic framework for creating ad-hoc web applications.
    * It’s a tool that I’ve been building out on a regular basis where
    * I can use it as a foundation for other modules and widgets.
    *
    * While some of the modules are not really relevant to all projects,
    * having using it’s foundation has been a big help in getting things
    * up and running quickly but with a solid base. Most of the code
    * is written in as basic of JavaScript as can be but there are a few
    * helper classes to assist in debugging as well as just organizing.
    *
    * You’ll also note that all of the Aether code complies to the JSLint
    * standard of coding meaning that things like “i++” are swapped for
    * “i += 1” and all variables are declared at the beginning of a method
    * using a comma seperated method rather than repetative var statements
    */
    var Æther = function () {

        this.debug = false;

        /***
        * Standard Aether modules
        */
        this.log = null;
        this.webServer = null;
        this.socketServer = null;

        /***
        * Additional modules added for this project
        */
        this.ai = null;
        this.aurora = null;
        this.webSockets = null;
        this.twitterStream = null;
        this.mqttServer = null;
        this.mqttClient = null;
        this.serialPort = null;
        this.sms = null;
        this.openWeather = null;
        this.gamepad = null;
        this.camera = null;
        this.sails = null;

        this.init = async () => new Promise((resolve, reject) => {
            // Introduction
console.log(`

⚗  Welcome to Æther ⚗
––––––––––––––––––––––––––––––––––––––––––———
 Various icons within the console stream
 represent the various areas of the web app.
 They provide a means for easier debugging
 and locating of problems as they are paired
 with a timestamp.
 ⚗  = Æther Global Application
 💼  = Æther.delegate
 🌐  = Æther.webServer
 🔌  = Æther.socketServer

Optional Modules
 🕴  = Æther.ai
 👀  = Æther.webSockets
 🐦  = Æther.twitter
 💡  = Æther.mqttClient
 💡  = Æther.mqttServer
 ⚡  = Æther.serialPort
 🌌  = Æther.aurora
 📱  = Æther.sms
 🌦  = Æther.openWeather
 🕹  = Æther.gamepad
 📹  = Æther.camera
 Lines written with a blue background are
 simply notifications but any that are red
 are server errors and should be seen to
 right away.
––––––––––––––––––––––––––––––––––––––––––———`);

            /***
            * Using the initial load under the try ensures that any concerns during
            * this phases are caught and described.
            */
            try {

                // Load the logging module first as it’s used even before we start anything else
                this.log            = require('./core/æther.logging');
                this.log.notify('⚗  Beginning Æther setup').catch(e => console.log(e));
                // Load any databases or data files before doing loading as they may be needed for other services
                /* No DB or datasource required for this project */

                // Load in the standard Aether modules and project the global object to them to reference as a parent.
                // This is done since module.exports.parent does not always provide the proper object
                this.delegate       = require('./core/æther.delegator')();
                this.webServer      = require('./core/æther.webServer')();
                this.socketServer   = require('./core/æther.socketServer')();

                // Load in the added modules specific to this project using the same method of parent as variable
//                this.webSockets     = require('./additional/æther.webSockets')();
//                this.twitterStream  = require('./additional/æther.twitterStream')();
//                this.mqttServer     = require('./additional/æther.mqttServer')();
//                this.mqttClient     = require('./additional/æther.mqttClient')();
//                this.serialPort     = require('./additional/æther.serialport')();
//                this.serialPort     = require('./additional/æther.sms')();
//                this.openWeather    = require('./additional/æther.openWeather')();
//                this.gamepad        = require('./additional/æther.gamepad')();
                

                // Now that all the modules are loaded, we can initiate them as asynchronous steps to avoid
                // clashing as well as reliant data.
                this.webServer.begin()
                    .then(() => this.socketServer.begin())

                    // Any of the additional modules can be added in a then method like the core
//                    .then(this.webSockets.begin)
//                    .then(this.twitterStream.begin)
//                    .then(this.mqttServer.begin)
//                    .then(this.mqttClient.begin)
//                    .then(this.openWeather.begin)
                    
                    // We then pass back to the main application the fact that we’re done.
                    .then(resolve);


                // Additional methods can be placed here that will run outside of the asynchronous queue above.
                // This is prime locations for listeners to added modules or the socket server



            } catch (e) {
                console.log(e);
            }
        });
        
        this.loadModules = this.loadModule = async (moduleNames) => new Promise((resolve, reject) => {
            moduleNames = [].concat(moduleNames);
            moduleNames.filter(name => {
                return Object.keys(this)
                    .map(key => key.toLowerCase())
                    .includes(name.toLowerCase())
            }).forEach(module => {
                try {
                    this[key] = require(`./additional/æther.${key}.mjs`)();
                    if (this[key].begin) this[key].begin();
                } catch (e) { Æther.log.error(e); }
            });
            resolve();
        });
        
        this.event = (message) => new Promise((resolve, reject) => {
            try {
                if (message) {
                    message.broadcast = (message.broadcast !== false);
                    if (message.broadcast === true) {
                        this.emit(message.evt, message.data);
                        if (this.socketServer.io) { this.socketServer.io.emit(message.evt, message.data); }
                        if (message.evt.indexOf('.') !== -1) {
                            this.emit(message.evt.split('.')[0], message.data);
                            if (this.socketServer.io) { this.socketServer.io.emit(message.evt.split('.')[0], message.data); }
                        }
                        this.emit('*', message);
                    }
                }
            } catch (e) {
                Aether.log.error(e);
            }
            resolve(message);
        });
        
        this.ready = ()  => new Promise((resolve, reject) => {
            this.emit('ready');
            resolve();
        });

    };

    // Provide Aether with the ability to emit
    util.inherits(Æther, EventEmitter);
    
    Æther = new Æther();

    module.exports = Æther;
    
    // Run the initialization upon being created
    Æther.init()
        .then(Æther.ready);
    
}());