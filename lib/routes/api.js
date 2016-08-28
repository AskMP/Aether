/*eslint-env es6*/
(function () {
    "use strict";
    
    var Æther;

    module.exports = (parent) => {
        Æther = parent;
        return [
            {
                path : "/api",
                handler : function (req, res) {
                    var data = {
                        message : "This is where you could capture or return data.",
                        queryParams: req.query,
                        queryBody : req.body
                    };
                    res.end(JSON.stringify(data, true, 2));
                }
            }
        ];
    };
    
    
}());