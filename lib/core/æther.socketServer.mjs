import EventEmitter from './æther.eventEmitter.mjs';
import Server from 'socket.io';

let Æther;

export class SocketServer extends EventEmitter {

    constructor(Æ, config = {}) {
        super();
        Æther = Æ;

        this.potentialEvents = {};
        this.ætherEvents = {};

        this.io = Server(Æther.webServer.server);
        this.io.on('connection', (connection) => this.resolveConnection(connection));
        Æther.log.notify('🔌  Completed SocketServer setup');
    }

    resolveConnection = (connection) => {
        Æther.log.notify('🔌  New connection');
        Object.keys(this.potentialEvents).forEach(evt => {
            connection.on(evt, data => this.potentialEvents[evt](data, connection));
        });
    }

}

export { SocketServer as default };