/*eslint-env es6*/
(function () {
    "use strict";
    
    /***
    * One of the foundation modules for Æther, allows for
    * quick setup of routing as well as a directory path
    * for flat static directory loading
    */
    var WebServer = function () {
        
        var express = require('express'),
            http = require('http'),
            bodyParser = require('body-parser'),
            fs = require('fs'),
            cors = require('cors'),
            config = require('../config/webServer.config.json'),
            Æther;
        
        // Due to the way that Express and Socket.io work, we setup an HTTP server here and
        // reference it for both of those services.
        this.server = null;
        this.app = null;
        
        // This path is the automatic routing directory where you can create
        // routing methods quickly and bundle them up in single files
        // There is currently an example route setup that has details on
        // how to access parameters as well as query string variables
        this.options = {
            routes : __dirname + config.routes,
            flatFiles : __dirname + config.base
        };
        
        // Standard Æther initializer and notification of starting the service
        this.init = () => new Promise((resolve, reject) => {
            Æther = module.parent.exports;
            Æther.log.notify('🌐  Initializing WebServer');
            // Passing in custom options to the begin allows for a more
            // fine tuned applications but it is not required

            // Begin the ExpressJS application and assign it to the server
            this.app = express();
            this.server = http.Server(this.app);

            // Ensure to use any parameter capturing inbetween tools
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: true }));
            
            // If the configuration is set to allow for CORS then add it to Express
            if (config.cors) this.app.use(cors());

            // This small addition logs any requests if the server is
            // currently in development but does not block the route
            // from other methods. It’s setup first to ensure that it
            // is the first thing run on any request
            if (Æther.debug) {
                this.app.use('/*', function (req, res, next) {
                    Æther.log.notify(`🌐  : ${req.originalUrl}`);
                    next();
                });
            }

            // Small simple apps sometimes only require static files and not
            // complex routing paths. This allows for a directory to be setup
            // to perform this action.
            if (this.options.flatFiles) this.app.use(express['static'](this.options.flatFiles));
            resolve();
        });
        
        // Because we want to wait until all the services required are loaded, we let the global
        // object run the begin command as a promise to ensure things can be daisy chained and
        // asynchronously loaded
        this.begin = () => new Promise((resolve, reject) => {
            this.server.listen(config.port);
            Æther.log.notify(`🌐  Web server running on port: ${config.port}`);
            resolve();
        });
        
        // Instead of having all the routing in this file, a default router
        // folder can contain files that have either single routes or an
        // array of routes that will automatically be loaded in upon boot.
        this.loadRoutes = () => new Promise((resolve, reject) => {
            fs.readdir(this.options.routes, (err, files) => {
                var f, r,
                    route = null;
                Promise.all(files.map(file => {
                    if (file.indexOf('.js') !== -1) {
                        route = require(this.options.routes + file);
                        if (route.constructor.name === "Array") {
                            return Promise.all(route.map(r => this.setupRouteModule(r)));
                        } else if (route.constructor.name === "Object") {
                            return this.setupRouteModule(route);
                        }
                    } else return true;
                })).then(resolve);
            });
        });
        
        // When a route object is found, add the route to the ExpressJS
        // application using the method it’s defined or GET if non specified
        this.setupRouteModule = (route) => new Promise((resolve, reject) => {
            route.method = route.method || "all";
            if (['post', 'get', 'put', 'delete', 'all'].indexOf(route.method.toLowerCase()) !== -1) {
                Æther.log.notify(`🌐  ${route.method.toUpperCase()} Route: ${route.path}`);
                this.app[route.method.toLowerCase()](route.path, route.handler);
            }
        });
        
        this.init()
            .then(this.loadRoutes)
            .then(() => Æther.log.notify('🌐  Completed WebServer setup'));
        
    };
    
    module.exports = function () {
        return new WebServer();
    };

}());