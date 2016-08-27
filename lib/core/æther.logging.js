(function () {
    "use strict";
    
    var log = require('oh-my-log')('⚗ '),
        chalk = require('chalk'),
    
        Logging = function (message, colour) {
            
            this.notify = (message) => new Promise(function (resolve, reject) {
                message = chalk.bgCyan.black(" " + message + " ");
                log(message);
                resolve();
            });
            
            this.error = (message) => new Promise(function (resolve, reject) {
                message = chalk.bgRed.white(" " + message + " ");
                log(message);
                resolve();
            });
        };
    
    Logging = new Logging();
    
    module.exports = Logging;
    
}());