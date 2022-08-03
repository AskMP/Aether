import Æther from '../index.mjs';
const myApp = new Æther({
    debug : true,
    webServer : {
        port : 80,
        static : './app_static',
        routes : './app_routes'
    }
})
myApp.on('ready', () => myApp.log.notify(`Server is up and running`));