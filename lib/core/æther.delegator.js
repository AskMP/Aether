/*eslint-env es6*/
(function () {
    'use strict';
    var Delegator = function () {
        
        var fetch = require('node-fetch'),
            Æther;
        
        this.init = () => {
            Æther = module.parent.exports;
            Æther.log.notify(' Initializing Delegator');
        };
        
        this.get = (url, data, headers, reqOptions) => this.request(url, data, 'get', headers, reqOptions);
        this.post = (url, data, headers, reqOptions) => this.request(url, data, 'post', headers, reqOptions);
        this.put = (url, data, headers, reqOptions) => this.request(url, data, 'put', headers, reqOptions);
        this.delete = (url, data, headers, reqOptions) => this.request(url, data, 'delete', headers, reqOptions);
        
        this.request = (url, data, method, headers, reqOptions) => new Promise((resolve, reject) => {
            if (typeof method === 'object') {
                headers = method;
                method = 'get';
            }
            
            reqOptions = reqOptions || {};
            
            method = method || 'get';
            data = data || false;
            
            headers = (typeof headers === 'object') ? headers : {};
            if (method.toLowerCase() === 'get' && data) {
                url += (url.indexOf('?') === -1) ? '?' : '&';
                url += (data) ? this.urlEncode(data) : '';
                data = null;
            } else {
                headers["Content-Length"] = JSON.stringify(data).length;
				reqOptions.body = JSON.stringify(data);
            }
            reqOptions.method = method;
            reqOptions.headers = headers;
            
            fetch(url, reqOptions)
                .then(response => response.json())
                .then(resolve)
                .catch(reject);
        });
        
        this.urlEncode = (obj) => {
			switch (typeof obj) {
			case 'string':
				return obj;
				break;
			case 'function':
				return this.urlEncode(obj());
				break;
			case 'object':
				return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
				break;
			default:
				return null;
			}
		};
        
        this.init();
        
    };
    module.exports = () => new Delegator();
}());