/*eslint-env es6*/
(function () {
    "use strict";
    
    var Æther = require('../');
    
    Æther.on('ready', () => {

        // Ensure that we’ve loaded the Twitter module into Æther
        if (Æther.twitterStream === null) {
            Æther.loadModule('twitterStream');
        }
        /****************************************************************
        * Setting up the event listeners is VERY straightforward
        ***/
        Æther.twitterStream.on('tweet', (tweet) => console.log(tweet.text));
        Æther.twitterStream.on('connected', (streamObj) => console.log("Connected to twitter with status code:", streamObj.statusCode));
        Æther.twitterStream.on('disconnected', () => console.log('Twitter has been disconnected'));
        
        /****************************************************************
        * Once you’ve attached your events (or before if you prefer), you
        * can now stream a query to twitter.
        ***/
        Æther.twitterStream.stream('JavaScript');
        
        /****************************************************************
        * You can also stream multiple terms by simply using an array
        * and the join(',') method.
        ***/
        // Aether.twitter.string(['JavaScript', 'nodejs'].join(','));
    });
    
}());