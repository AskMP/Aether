/*eslint-env es6*/
(function () {
    'use strict';
    
    var log = require('oh-my-log')('⚗ '),
        chalk = require('chalk'),
    
        Logging = function (message, colour) {
            
            this.notify = (message) => new Promise(function (resolve, reject) {
                if (arguments.length > 1) {
                    message = arguments.map(m => chalk.bgCyan.black(` ${m} `));
                }
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