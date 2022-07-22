import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';

let Æther;

/***
* One of the foundation modules for Æther, allows for
* quick setup of routing as well as a directory path
* for flat static directory loading
*/
export class WebServer {

    constructor(æ, config) {
        Æther = æ;
        this.server = null;
        this.app = null;
        this.config = Object.assign({
            routes : '/',
            static : '/static/',
            port : 8080
        }, Æther?.config?.webServer || {}, config);
    }

    init = async () => new Promise((resolve, reject) => {
        Æther.log.notify('🌐  Initializing WebServer');
        this.app = express();
        this.server = http.Server(this.app);

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ exended: true }));

        if (!!this.config.cors) this.app.use(cors());

        if (!!Æther.debug) this.app.use(`/*`, (req, res, next) => Æther.log.notify(`🌐  : ${req.originalUrl}`).then(next));

        if (!!this.options.static) this.app.use(express['static'](this.config.static));

        resolve();
    });

    begin = async () => new Promise((resolve, reject) => {
        this.server.listen(this.config.port);
        Æther.log.notify(`🌐  Web server running on port: ${this.config.port}`);
        resolve();
    });

    loadRoutes = async () => new Promise((resolve, reject) => {
        return Promise.all(await fs.readdir(this.config.routes).map(file => {
            if (file.indexOf('.js') === -1 && file.indexOf('.mjs') === -1) return true;
            let route = require(`${this.config.routes}${file}`);
            return Promise.all([].concat(route).map(route => this.setupRouteModule(route)));
        }));
    });

    setupRouteModule = async (route) => new Promise((resolve, reject) => {
        route.method = route.method || 'all';
        if (!['post', 'get', 'put', 'delete', 'all'].includes(route.method.toLowerCase())) return reject(`Invalid route method: ${route.method} for ${route.path}`);
        Æther.log.notify(`🌐  ${route.method.toUpperCase()} Route: ${route.path}`);
        this.app[route.method.toLowerCase()](route.path, route.handler);
        resolve();
    });

}

export { WebServer as default };