import EventEmitter from '../core/æther.eventEmitter.mjs';
import mqtt from 'mqtt';

let Æther;

const READY = Symbol('READY');

const defaultClientOptions = {
    wsOptions : {},
    keepalive : 60, // set to 0 to disable
    reschedulePings : true,
    clientId : `AetherMQTT_${Math.random().toString(16).slice(2, 10)}`,
    protocolId : 'MQTT',
    protocolVersion : 5,
    clean : true,
    reconnectPeriod : 1 * 1000,
    connectTimeout : 30 * 1000,
    username : undefined,
    password : undefined,
    queueQoSZero : true
};

export class MQTTClient extends EventEmitter {

    constructor(Æ, config = {}) {
        super();
        Æther = Æ;
        this.config = Object.assign({
            autoConnect : true
        }, Æther.config?.mqttClient, config);

        Æther.log.notify(`💡  Initializing mqttClient`);

        this[READY] = false;
        
        this.potentialEvents = [];

    }

    get ready() { return this[READY]; }
    set ready(v) {
        throw new Error(`You cannot set the ready state of the MQTT Client`);
    }

    connect = (options = {}) => new Promise((resolve, reject) => {
        if (!!this.ready) return reject(`💡  Already connected to MQTT Server`);
        if (options.constructor.name.toLowerCase() !== 'string') options = Object.assign(defaultClientOptions, options);
        this.server = mqtt.connect(options);
        this.server.on('error', err => this.serverError(err));
        this.server.on('connect', conn => this.serverConnected(conn));
        this.server.on('message', (topic, data) => this.receiveMessage(topic, data));
        this.server.on('close', () => this.serverDisconnected());
        this.server.on('disconnect', () => this.serverDisconnected());
    });

    serverError = (err) => {
        Æther.log.error(`💡  mqttClient ${err}`);
        if (err.toString().toLowerCase().indexOf(`refused`) !== -1) {
            this.server.end();
            this[READY] = false;
        }
    }

    serverConnected = (serverConnection) => {
        Æther.log.notify(`💡  MQTT Connected to ${serverConnection.host}:${serverConnection.port}`);
        this[READY] = true;
        this.addListeners();
    }

    serverDisconnected = () => {
        Æther.log.notify(`💡  MQTT Disconnected.`);
        this[READY] = false;
    }

    addListeners = () => {
        this.server.subscribe('#'); // NEVER DO THIS! Super bad form…
    }

    receiveMessage = (topic, data) => {
        Æther.log.notify(`💡  MQTT Event: ${topic}`);
        Object.keys(this.potentialEvents)
            .forEach(event => (new RegExp(event, "gi").exec(topic)) ? this.potentialEvents[event](data, topic) : null);
    }
}

export { MQTTClient as default };