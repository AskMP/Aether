const CONFIG = Symbol('CONFIG');

import Core from './core/æther.coreModules.mjs';
import Additional from './additional/æther.additionalModules.mjs';

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
export class Æther extends Core.EventEmitter {

    constructor(config = {}) {
        super();

        this[CONFIG] = Object.assign({
            debug : false
        }, config);

        console.log(`

⚗  Welcome to Aether ⚗
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

        // Load the logging module first as it’s used even before we start anything else
        this.log            = new Core.Logging();
        this.log.notify('⚗  Beginning Æther setup');
        // Load any databases or data files before doing loading as they may be needed for other services
        /* No DB or datasource required for this project */

        // Load in the standard Aether modules and project the global object to them to reference as a parent.
        // This is done since module.exports.parent does not always provide the proper object
        this.delegator      = new Core.Delegator(this);
        this.webServer      = new Core.WebServer(this);
        this.socketServer   = new Core.SocketServer(this);

        this.additionalModules = Additional;

        // Now that all the modules are loaded, we can initiate them as asynchronous steps to avoid
        // clashing as well as reliant data.
        this.webServer.begin()
            .then(() => {
                this.emit('ready');
            })
            .catch(e => {
                console.error(e);
            });
    }

    get debug() {
        return this[CONFIG].debug;
    }

    set debug(v) {
        throw new Error(`Cannot change debug mode while process is running.`);
    }

    get config() { return this[CONFIG]; }
    set config(v) {
        this.log.error(`You cannot set the configuration of the app this way`);
    }

}

export { Æther as default };