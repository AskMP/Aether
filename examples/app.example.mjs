import Æther from '../index.mjs';
const myApp = new Æther({
    webServer : {
        static : './app_static',
        routes : './app_routes'
    }
})
myApp.on('ready', () => myApp.log.notify(`Server is up and running`));