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
            routes : `./routes/`,
            static : `./static/`,
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

        this[APP] = express();

        if (!!this.config.secure) {
            this[SERVER] = https.createServer({
                key : fs.readFileSync(this.config.secure.key),
                cert : fs.readFileSync(this.config.secure.cert),
            }, this[APP]);
        } else {
            this[SERVER] = http.createServer(this[APP]);
        }

        this[APP].set('view engine', 'ejs');
        this[APP].set(`views`, path.resolve(this.config.views));
        this[APP].use(bodyParser.json());
        this[APP].use(bodyParser.urlencoded({ extended : true}));
        this[APP].use(fileUpload());

        if (this.config.static) {
            Æther.log.notify(`🌐  Applying static route: ${path.resolve(this.config.static)}`);
            this[APP].use(express.static(path.resolve(this.config.static)));
        }

        if (!!this.config.session) {
            Æther.log.notify(`🌐  Applying session tracking`);
            this[APP].use(session(this.config.session));
            this.passport = passport;
            this.passport.serializeUser(this.config.serializeUser);
            this.passport.deserializeUser(this.config.deserializeUser);
        }

        if (!!this.config.cors) this[APP].use(cors());

        if (!!Æther.debug) {
            Æther.log.notify(`🌐  Applying debug tracking for all routes`);
            this[APP].use(`/*`, (req, res, next) => {
                Æther.log.notify(`🌐  [${req.method}] : ${req.originalUrl}`);
                next();
            });
        }

        this[APP].use(`/*`, (req, res, next) => {
            this.emit(`request`, req.originalUrl);
            this.emit(req.method.toLowerCase(), req.originalUrl);
            this.emit(req.originalUrl);
            next();
        });
        
    }

    toJSON = () => `Æther.webServer`;

    begin = () => new Promise(async (resolve, reject) => {
        try {
            let webServerPort = this.config?.port || 8080;
            if (!!this.config.routes) {
                let routesFolderPath = path.resolve(this.config.routes);
                this.setupRouteDirectory(routesFolderPath)
                    .then(() => {
                        this[SERVER].listen(webServerPort);
                        Æther.log.notify(`🌐  ${!!this.config.secure ? 'Secure ' : ''}Web server running on port: ${webServerPort}`);
                        resolve();
                    })
                    .catch(err => Æther.log.error(err));
            } else {
                this[SERVER].listen(webServerPort);
                Æther.log.notify(`🌐  ${!!this.config.secure ? 'Secure ' : ''}Web server running on port: ${webServerPort}`);
                resolve();
            }
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
        if (!fs.existsSync(`${path}${filePath}`)) return reject(`Invalid Route Path File: ${path}${filePath}`);
        import(`${path}${filePath}`)
            .then(({default : pathCollection}) => {
                return pathCollection.forEach(route => {
                    if (route.path.indexOf('/') !== 0) route.path = `/${route.path}`;
                    route.method = route.method || 'get';
                    if (['get', 'post', 'delete', 'put', 'all'].indexOf(route.method.toLowerCase()) === -1) return reject(`🌐  Route: ${route.path} error, method ${route.method} is invalid`);
                    this[APP].route(route.path)[route.method.toLowerCase()](route.handler);
                    Æther.log.notify(`🌐  Route: [${route.method}] "${route.path}"`);
                });
            })
            .then(resolve)
            .catch(err => reject(err));
    });

    confirmUser = (AccessToken, refreshToken, profile, done) => {
        // Validate profile
        done();
    }

    logout = (req, res) => {
        req.logout();
        res.redirect('/');
    }
}

export { WebServer as default };