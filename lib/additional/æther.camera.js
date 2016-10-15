/*eslint-env es6*/
var ffmpeg = process.env.FLUENTFFMPEG_COV ? require('fluent-ffmpeg/lib-cov/fluent-ffmpeg') : require('fluent-ffmpeg/lib/fluent-ffmpeg'),
    fs = require('fs-extra'),
    exec = require('child_process').exec,
    moment = require('moment');
(function () {
    "use strict";
 
    /***
    * Custom Æther Module for validating credit card BIN numbers
    * using a Mag-Tek swipe card reader.
    */
    var Camera = function () {
 
        var config,
            Æther;
 
        this.isRecording = false;
        this.duration = 0;
        this.extension = '.flv';
        
        this.device = {
            input    : null,
            process  : null,
            filename : ""
        };
 
        /***
        * Æther’s module initialization command
        *   @param parent should be the Æther global class
        */
        this.init = () => {
            Æther = module.parent.exports;
            // Notify the app that initialization is taking place
            Æther.log.notify('📹  Initializing Camera');
 
            // Load the configuration file as path names and devices can vary from machine to machine
            config = require('../config/camera.config.json');
        };
        
        this.list = () => new Promise((resolve, reject) => {
            var output = "",
                process = exec('ffmpeg -f avfoundation -list_devices true -i ""');
                
            process.stdout.on('data', (data) => {
                output += data;
            });
            process.stderr.on('data', (data) => {
                output += data;
            });
            
            process.on('close', () => {
                var allFound = false,
                    devices = output.match(/(?:\[AVFoundation.*\]\s)(.*)/gi)
                        .map(device => device.substring(device.indexOf('] ') + 6))
                        .filter(device => {
                            if (device.indexOf('audio devices') !== -1) allFound = true;
                            if (!allFound && device.indexOf('video devices') === -1) {
                                return true;
                            }
                        });
                resolve(devices);
            });
            
        });
 
        // This is the action that will run when a new user is to be recorded
        this.record = (duration) => new Promise((resolve, reject) => {
            if (!this.isRecording) {
                this.duration = parseInt(duration, 10) || config.duration;
                this._start()
                    .then(resolve);
            } else {
                reject('📹  Camera Already Recording');
            }
        });
 
        // Performs the initializing of the 2 camera processes
        this._start = () => new Promise((resolve, reject) => {
            this.device.filename = moment().format(config.basename) + this.extension;
            console.log(`ffmpeg -framerate 29.97 -video_size 640x480 -i ${this.device.input} -f rtsp -rtsp_transport tcp rtsp://localhost:7002/live.sdp`);
            this.device.process = exec(`ffmpeg -framerate 29.97 -video_size 640x480 -i ${this.device.input} -f rtsp -rtsp_transport tcp rtsp://localhost:7002/live.sdp`,function(error,stdout,stderr){
                console.log('STDOUT: ',stdout);
                console.log('STDERR: ',stderr);
            });
//            this.device.process = ffmpeg()
//                .input('/dev/video0')
//                .inputOptions('-f', 'dshow')
//                .inputOptions('-video_size', config.dimensions)
//                .inputFPS(config.fps)
//                .aspect('16:9')
//                .size(config.dimensions)
//                .videoBitrate('5000k')
//                .audioBitrate('128k')
//                .fps(config.fps)
//                .duration(this.duration)
//                .on('end', this.notifyStopped)
//                .on('error', this.errored)
//                .on('start', this.notifyStarted)
//                .save(__dirname + '/../../../' + this.device.filename);
            resolve();
        });
 
        // Not much needed here other than an instruction for to from and how long to wait. This helps with providing a means
        // to wait for the process to be completed.
        this.delayMove = (fromPath, toPath, delay) => {
            setTimeout(() => {
                fs.move(fromPath, toPath, this.confirmUpload);
            }, delay);
        };
 
        this.confirmUpload = function (err) {
            if (err) {
                this.errored(err);
            } else {
                Æther.log.notify('📹  Moved file: ' + toPath);
            }
        };
 
        this.notifyStopped = () => {
            if (!this.isRecording) return;
            if (this.device.process !== null) {
                Æther.log.notify('📹  Stopped recording from a camera: ' + this.device.filename);
                this.delayMove(this.device.filename, config.path.archive + this.device.filename, 10000);
                this.device.process = null;
                this.device.filename = "";
            }
            this.isRecording = false;
        };
 
        this.notifyStarted = () => {
            this.isRecording = true;
            Æther.log.notify("📹  Starting capture camera " + this.device.filename);
        };
 
        this.errored = (err) => {
            console.log(this.device.process);
            Æther.log.error('📹  Error: ' + JSON.stringify(err, true, 2));
        };
 
        this.init();
 
    };
 
    module.exports = function () {
        return new Camera();
    };
 
}());