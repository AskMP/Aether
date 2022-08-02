import EventEmitter from '../core/æther.eventEmitter.mjs';
import { SerialPort } from 'serialport';

const READY = Symbol('READY');

export class Serial extends EventEmitter {

    constructor(Æ, config) {
        super();
        Æther = Æ;
        this.config = Object.assign({
            autoConnect : false,
            reconnect : 3000,
            baud : 115200,
            bootDelay : 250,
            terminator : "\n\r"
        }, Æ.config?.serial, config);
        this.connection = false;
        this.potentialConnections = [];
        this[READY] = false;

        this.messageFrom = '';
        this.lastMessage = '';
        
        this.availableConnections()
            .then(connections => this.potentialConnections = connections)
            .catch(err => Æther.log.error(err));

        Æther.log.notify('⚡  Serial Module Initialized');
    }

    availableConnections = async () => new Promise((resolve, reject) => {
        SerialPort.list((err, ports) => {
            if (err) return reject(err);
            resolve(ports);
        });
    });

    connect = async (com = false, baud = false) => new Promise((resolve, reject) => {
        if (!!com) this.config.com = com;
        if (!!baud && !isNaN(baud)) this.config.baud = baud;
        if (!!this.connection) {
            Æther.log.error(`⚡ SerialPort Error: Connection already established`);
            return reject(`Connection already established`);
        }

        switch (com.constructor.name.toLowerCase()) {
            case 'string':
                if (!this.potentialConnections.find(connection => com.toLowerCase() === connection.toLowerCase())) return reject(`Invalid connection "${com}"`);
                this.connection = new SerialPort(com, {baudRate: baud});
                break;
            default:
                return reject(`Invalid connection type: ${com.constructor.name}`);
        }

        this.attachListeners()
            .then(resolve)
            .catch(reject);
    });

    attachListeners = () => new Promise((resolve, reject) => {
        this.connection.on('open', () => this.openedConnection());
        this.connection.on('disconnect', () => this.disconnected());
        this.connection.on('close', () => this.closed());
        this.connection.on('error', (err) => this.errored(err));
        this.connection.on('data', (message) => this.receiveData(message));
    });

    openedConnection = () => {
        setTimeout(() => {
            this[READY] = true;
            this.emit('connected');
            Æther.log.notify(`⚡  Connection made to ${this.config.com} @${this.config.baud}`);
        }, this.config.bootDelay);
    }

    disconnected = () => {
        this[READY] = false;
        this.emit('disconnected');
        Æther.log.notify(`⚡  Disconnected from ${this.config.com} @${this.config.baud}`);
    }

    errored = (err) => {
        Æther.log.error('⚡ SerialPort Error: ' + JSON.stringify(err, true, 2));
        this.emit('error', err);
        if (!this.connection.isOpen()) {
            this[READY] = false;
            if (!!this.config.reconnect) this.reconnect();
        }
    }

    closed = () => {
        Æther.log.notify(`⚡  Disconnected from ${this.config.com} @${this.config.baud}`);
        this.emit('closed');
        this[READY] = false;
    }

    reconnect = () => {
        if (!isNaN(this.config.reconnect) && this.config.reconnect <= 500) return Æther.log.error(`⚡  Reconnect should be greater than 500ms`);
        if (isNaN(this.config.reconnect)) return Æther.log.error(`⚡  Reconnected must be set to a number from 500 and up`);
        try {
            this.connection.open();
        } catch (e) {
            setTimeout(() => {
                if (!this.connection.isOpen()) this.reconnect();
            }, this.config.connect);
        }
    }

    send = async (message) => new Promise((resolve, reject) => {
        if (!this[READY]) return;
        this.connection.write(`${message}${this.config.terminator}`);
        resolve();
    });

    receive = (message) => {
        this.messageFrom += message.toString();
        this.emit('data', message);
        if (this.messageFrom.indexOf(this.config.terminator) !== -1) {
            this.lastMessage = this.messageFrom.trim();
            this.message = "";
            this.emit('message', this.lastMessage);
        }
    }

}

export { Serial as default };