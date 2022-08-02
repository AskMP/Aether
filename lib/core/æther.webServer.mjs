const SERVER = Symbol('SERVER'),
      APP = Symbol('APP');

import EventEmitter from './æther.eventEmitter.mjs';
import express from 'express';
import https from 'https';
import http from 'http';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import passport from 'passport';
import fs from 'fs';
import path, { resolve } from 'path';
import cors from 'cors';

let Æther;

export class WebServer extends EventEmitter {

    constructor(Æ, config = {}) {
        super();
        Æther = Æ;
        this.config = Object.assign({
            port : 8080,
            routes : `routes`,
            static : `static`,
            views : `ejs`,
            cors : false,
            session : false,
            // session : {
            //     secret : `Supers3CretL1ne$`,
            //     cookie : { maxAge : 60 * 60 * 1000 * 48 },
            //     store : new expressSessions({
            //         storage : 'mongodb',
            //         instance : Aether.database,
            //         db : 'overlaytools',
            //         collection : 'sessions',
            //         expire : 60 * 60 * 1000 * 48
            //     }),
            //     resave : false,
            //     saveUninitialized : false
            // },
            secure : false,
            auth : {
                google : false,
                twitter : false,
                facebook : false  
            },
            serializeUser : (user, done) => { done(null, user); },
            deserializeUser : (user, done) => { done(null, user); }
        }, Æther?.config?.webServer, config);

        if (!!this.config.secure) {
            this[SERVER] = https.createServer({
                key : fs.readFileSync(this.config.secure.key),
                cert : fs.readFileSync(this.config.secure.cert),
            }, this[APP]);
        } else {
            this[SERVER] = http.createServer(this[APP]);
        }

        this[APP] = express();
        this[APP].set('view engine', 'ejs');
        this[APP].set(`views`, path.resolve(this.config.views));
        this[APP].use(bodyParser.json());
        this[APP].use(bodyParser.urlencoded({ extended : true}));
        this[APP].use(fileUpload());

        if (this.config.static) this[APP].use(express['static'](this.config.static));

        if (!!this.config.session) {
            this[APP].use(session(this.config.session));
            this.passport = passport;
            this.passport.serializeUser(this.config.serializeUser);
            this.passport.deserializeUser(this.config.deserializeUser);
        }

        if (!!this.config.cors) this[APP].use(cors());
        if (!!Æther.debug) {
            this[APP].use(`*`, (req, res, next) => {
                Æther.log.notify(`🌐  : ${req.originalUrl}`);
                next();
            });
        }

        this[APP].use(`*`, (req, res, next) => {
            this.emit(`request`, req.originalUrl);
            this.emit(req.method.toLowerCase(), req.originalUrl);
            this.emit(req.originalUrl);
            next();
        });

        if (!!this.config.routes) {
            let routesFolderPath = path.resolve(this.config.routes);
            this.setupRouteDirectory(routesFolderPath)
                .catch(err => Æther.log.error(err));
        }
        
    }

    toJSON = () => `Æther.webServer`;

    begin = async () => new Promise((resolve, reject) => {
        try {
            let webServerPort = this.config.port || 8080;
            this[SERVER].listen(webServerPort);
            Æther.log.notify(`🌐  Web server running on port: ${webServerPort}`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });

    setupRouteDirectory = async (dirPath, path = '') => new Promise((resolve, reject) => {
        if (!fs.existsSync(`${path}${dirPath}`)) return reject(`Invalid Route Path Directory: ${path}${dirPath}`);
        let dirContents = fs.readdirSync(`${path}${dirPath}`, { withFileTypes: true });
        Promise.all(dirContents.map(entity => {
            if (entity.isDirectory()) return this.setupRouteDirectory(entity.name, `${path}${dirPath}/`);
            else return this.setupRouteFile(entity.name, `${path}${dirPath}/`);
        }))
        .then(resolve)
        .catch(reject);
    });

    setupRouteFile = async (filePath, path) => new Promise((resolve, reject) => {
        // if (!fs.existsSync(`${path}${filePath}`)) return reject(`Invalid Route Path File: ${path}${filePath}`);
        // let { default : Routes } = await import(`${path}${filePath}`),
        //     pathCollection = new Routes(this);
        // pathCollection.paths.forEach(route => {
        //     this[APP].route(route.path)[route.method.toLowerCase()](route.handler);
        //     // this[APP][route.method.toLowerCase()](route.path, route.handler);
        // });
        resolve();
        // return Promise.all(routes.map(r => this.setupRoute(r)));
    });

    confirmUser = (AccessToken, refreshToken, profile, done) => {
        // Validate profile
        // done();
    }

    logout = (req, res) => {
        req.logout();
        res.redirect('/');
    }
}

export { WebServer as default };