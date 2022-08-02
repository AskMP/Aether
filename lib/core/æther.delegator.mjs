import { EventEmitter } from './æther.eventEmitter.mjs';
export class Delegator extends EventEmitter {

    constructor() {
        super();
    }

    get     = (url, data = false, headers = {}, reqOptions = {}, resType = 'json') => this.request(url, data = false, 'GET',    headers = {}, reqOptions = {}, resType = 'json');
    post    = (url, data = false, headers = {}, reqOptions = {}, resType = 'json') => this.request(url, data = false, 'POST',   headers = {}, reqOptions = {}, resType = 'json');
    put     = (url, data = false, headers = {}, reqOptions = {}, resType = 'json') => this.request(url, data = false, 'PUT',    headers = {}, reqOptions = {}, resType = 'json');
    delete  = (url, data = false, headers = {}, reqOptions = {}, resType = 'json') => this.request(url, data = false, 'DELETE', headers = {}, reqOptions = {}, resType = 'json');

    request = async (url, data = false, method = 'GET', headers = {}, reqOptions = {}, resType = 'json') => new Promise((resolve, reject) => {
        if (typeof method === 'object') {
            headers = method;
            method = 'GET';
        }

        if (method.toLocaleLowerCase() === 'get' && !!data) {
            url += `${(url.indexOf('?') === -1) ? '?' : '&'}${this.urlEncode(data)}`;
            data = false;
        } else {
            headers["Content-Length"] = JSON.stringify(data).length;
            reqOptions.body = JSON.stringify(data);
            data = false;
        }
        reqOptions.method = method;
        reqOptions.headers = headers;

        fetch(url, reqOptions)
            .then(response => response[resType.toLowerCase()]())
            .then(resolve)
            .catch(reject);

    });

    urlEncode = (obj) => {
        switch (obj.constructor.name.toLowerCase()) {
            case 'string':
                return obj;
            case 'function':
                return this.urlEncode(obj());
            case 'object':
                return Object.keys(obj).map(key => `${key}=${obj[key]}`).join(`&`);
            default:
                return null;
        }
    }
}

 export { Delegator as default };