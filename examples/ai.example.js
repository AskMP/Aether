/*eslint-env es6*/
(function () {
    "use strict";
    
    var Æther = require('../');
    
    Æther.on('ready', () => {
        
        var APIaiModules = {
                messages : {
                    calls : (res) => {},
                    emails : (res) => {},
                    messages : (res) => {},
                    nicknames : (res) => {},
                    manage : (res) => {}
                },
                notifications : {
                    add : (res) => {},
                    get : (res) => {},
                    remove : (res) => {}
                },
                language : {
                    switch : (res) => {}
                },
                weather : {
                    search : (res) => {},
                    units : (res) => {},
                    service : (res) => {}
                },
                name : {
                    save : (res) => {}
                }
            },
            createListener;
        
        Æther.loadModules(['ai', 'aurora', 'sails']);
        
        Æther.ai.on('aurora.light', (response) => {
            var c = Æther.aurora.colours[colours.length - 1];
            if (response.result.parameters.light_location.trim() === '') {
                Æther.ai.followup('the one in the bedroom', {sessionId: response.sessionId});
            } else {
                console.log(response.result.parameters);
                switch(response.result.action) {
                case 'aurora.light.on':
                case 'aurora.light.off':
                    c = (colours.find(c => c.name === response.result.action.split('.').pop().toLowerCase().trim().replace(' ', '')) || colours[colours.length - 1]).hex.toString(16);
                    break;
                case 'aurora.light.colour':
                    c = (colours.find(c => c.name === response.result.parameters.color.trim().replace(' ', '').toLowerCase()) || colours[colours.length - 1]).hex.toString(16);
                    break;
                }
                Æther.delegate.get('http://helios.direct/aurora/direct', {light : response.result.parameters.light_location, colour: c})
                    .catch((err) => Æther.log.error(JSON.stringify(err, true, 2)));
            }
        });
        
        createListener = (path, method) => new Pomise((resolve, reject) => {
            switch (typeof method) {
            case 'function':
                Æther.ai.on(path, method);
                resolve();
                break;
            case 'object':
                Promise.all(Object.keys(method).map(action => createListener(`${path}.${action}`, method[action])))
                    .then(resolve);
                break;
            default:
                reject(`Invalid listener ${JSON.stringify({path: path, method: method, type: typeof method})}`);
            }
        });
        
        Promise.all(Object.keys(APIaiModules).map(module => createListener(module, APIaiModules[module])))
            .catch((err) => Æther.log.error(JSON.stringify(err, true, 2)));
        
        Æther.ai.request('make the bedroom red')
            .catch((err) => Æther.log.error(JSON.stringify(err, true, 2)));
        
    });
    
}());