/*eslint-env es6*/
(function () {
    "use strict";
    
    var Sails = function () {
        
        var Æther;
        
        this.config = require('../config/sails.config.json');
        
        this.basePath = '';
        
        // Nothing major happends in the initialization other than setting the server path.
        this.init = () => {
            Æther = module.parent.exports;
            Æther.log.notify('⛵  Initializing Sails Connection');
            this.basePath = `${this.config.protocol}://`;
            this.basePath += (this.config.subdomain) ? `${this.config.subdomain}.` : '';
            this.basePath += this.config.host;
            this.basePath += (this.config.port && this.config.port !== 80) ? `:${this.config.port}/` : '/';
            this.basePath += (this.config.prefix) ? this.config.prefix : '';
            
            Æther.log.notify(`⛵  Sails basePath set to: ${this.basePath}`);
        };
        
        this.begin = () => new Promise((resolve, reject) => {
            if (this.config.passthru) {
                Æther.webServer.setupRouteModule({
                    path : '/' + this.config.passthru,
                    handler : (req, res) => {
                        res.end('Not setup yet');
                    }
                });
            }
        });
        
        this.get = (url, data, headers) => this.request(url, data, 'get', headers);
        this.post = (url, data, headers) => this.request(url, data, 'post', headers);
        this.put = (url, data, headers) => this.request(url, data, 'put', headers);
        this.delete = (url, data, headers) => this.request(url, data, 'delete', headers);
        
        this.request = (url, data, method, headers) => new Promise((resolve, reject) => {
            Æther.log.notify(`⛵  ${method}: ${url}`);
            headers = headers || {};
            if (Object.keys(this.config.headers).length > 0) Object.keys(this.config.headers).forEach(header => (headers[header] === undefined) ? headers[header] : this.config.headers[header]);
            Æther.delegate.request(this.basePath + url, data, method, headers)
                .then(resolve)
                .catch(reject);
        });
        
        this.init();
        
    };
    
    module.exports = () => {
        return new Sails();
    };
    
}());