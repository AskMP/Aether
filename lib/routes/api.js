/*eslint-env es6*/
(function () {
    'use strict';

    module.exports = [{
        path : '/api',
        handler : (req, res) => res.end(JSON.stringify({
            message : 'This is where you could capture or return data.',
            queryParams: req.query,
            queryBody : req.body
        }, true, 2))
    }];
    
}());