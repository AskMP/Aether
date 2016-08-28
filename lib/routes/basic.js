/*eslint-env es6*/
(function () {
    "use strict";
    
    var Æther = null;

    module.exports = (parent) => {
        Æther = parent;
        return [
            {
                path : "/",
                method : "get",
                handler : function (req, res) {
                    res.end(
                    '<!DOCTYPE html>'+
                    '<html lang="en-CA">'+
                        '<head>'+
                            '<meta charset="utf-8">'+
                            '<meta name="viewport" content="width=device-width, initial-scale=1">'+
                        '</head>'+
                        '<body style="text-align: center">'+
                            '<h1>Welcome to ⚗ Æther!</h1>'+
                            '<h3>Congratulations, you’re up and running with an Æther server.</h3>'+
                            '<p>You can create a static HTML structure by creating a directory in the root of the application<br />called “html” then remove or change the path of the first route in the file:<br /><code>…/node_modules/æther/lib/routes/basic.js</code></p>'+
                        '</body>'
                    );
                }
            }
        ];
    };
    
}());