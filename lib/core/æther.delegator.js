(function () {
    "use strict";
    
    var Delegator = function () {
        
        var fetch = require('node-fetch'),
            Æther;
        
        this.init = function () {
            Æther = module.parent.exports;
            Æther.log.notify('💼  Initializing Delegator');
        };
        
        this.get = (url, data) => this.request(url, data, 'get');
        this.post = (url, data) => this.request(url, data, 'post');
        
        this.request = (uri, data, method) => new Promise((resolve, reject) => {
            method = method || 'get';
            fetch(url, { method : method, body : this.urlEncode(data)})
                .then(response => response.json())
                .then(resolve)
                .catch(reject);
        });
        
        this.urlEncode = function (obj) {
            var queryString = "",
                o;
            obj = obj || {};
            for (o in obj) {
                if (obj.hasOwnProperty(o) && obj[o] !== undefined) {
                    queryString += (queryString !== "") ? "&" : "";
                    queryString += o.toString() + "=" + obj[o].toString();
                }
            }
            return queryString;
        };
        
        this.init();
        
    };
    
    module.exports = function () {
        return new Delegator();
    };
    
}());