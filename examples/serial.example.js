(function () {
    "use strict";
    
    var Æther = require('../');
    
    Æther.on('ready', () => {
        
        /****************************************************************
        * A really good addition to the serialPort module is connecting
        * it to socket.io’s events. You can easily connect it similar
        * to below (but likely with more security and validation)
        ***/
        //Æther.socketServer.potentialEvents.sendtoserial = (message) => Æther.serialPort.send(message);
        
        /****************************************************************
        * If you have updated the config file for the arduino, you can
        * simply use the connect() method in order to initiate the
        * arduino.
        ***/
        Æther.serialPort.connect();
        
        /****************************************************************
        * There are a plethora of events that occur for the connection.
        * Most of which can be ignored but on the whole, the 'message'
        * event will likely be the most relevant.
        * (Note: Due to the restart often done by Arduinos, there is a
        * setting for how long to relay prior to the event “connected”
        * activating. This can be changed in the config file.)
        ***/
        // Connection
        Æther.serialPort.on('connected', () => console.log("Connected to board:", Æther.serialPort.board.path));
        // Disconnection
        Æther.serialPort.on('disconnected', () => console.log("disconnected from board"));
        // Erroring (not working as expected… try not to error)
        Æther.serialPort.on('error', (err) => console.log("Oops, I errored", err));
        // The raw data as it is coming in. Note that this is a buffer so it needs to be converted to a string
        Æther.serialPort.on('data', (rawBufferData) => console.log(rawBufferData.toString()));
        // Any complete message that contains the terminator string (default: \r\n)
        Æther.serialPort.on('message', (message) => console.log("Incoming from serialport:", message));
        
        /****************************************************************
        * Passing information to the comPort is as easy as using “send”.
        * As an example, if you load the default arduino example:
        * 4.Communication -> SerialEvent and update the config file to
        * match the 9600 baud and the comPort to the arduino board’s com
        * listed in the arduino application, you should be able to send
        * and receive “Hello” coming from the board.
        * (Note: you will need to close the Arduino IDE’s serial monitor)
        ***/
        setInterval(() => Æther.serialPort.send('Hello'), 3000);
    });
    
}());