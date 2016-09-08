/*eslint-env es6*/
(function () {
    "use strict";
    var Æther = require('../');
    
    /*********************************************************/
    // IMPORTANT: Be sure to install the node-hid dependency //
    /*********************************************************/
    
    // To simplify things, we’ll just output to the console the buttons
    // pushed however, the ideal thing would likely be a socketServer
    // pairing or MQTT pairing for near-real-time communication of the
    // controller and a front end or external hardware integration.
    
    // Also, you will need to pair the controllers with the computer:
    //  - Wii Remote and PS4 controllers are fairly straight forward
    //  - XBoxOne controller will need to be connected by USB
    Æther.on('ready', () => {
        if (Æther.gamepad === null) {
            Æther.loadModule('gamepad');
        }

        // We can call a specific gamepad by initialing which we want
        var Wii = new Æther.gamepad.Wii(),
            PS4 = new Æther.gamepad.PS4(),
            XBoxOne = new Æther.gamepad.XBoxOne();
        
        // We then wait for the controller to be ready before attaching the listeners
        Wii.on('ready', (controller) => {
            
            /********************************************************
            * The Wii Remote Wand only works without the analog stick
            * unfortunately. It won’t return you angles or movement.
            * You will only have access to the buttons:
            * [up, down, left, right, a, b, one, two, plus, minus, home]
            ***/
            Object.keys(controller.buttons).forEach(btn => {
                controller.on(btn + ':down', () => console.log(controller.config.name, btn));
                controller.on(btn + ':up', () => console.log(controller.config.name, btn));
                controller.on(btn + ':hold', () => console.log(controller.config.name, btn + ': holding'))
            });
        });
        
        /********************************************************
        * The PS4 and XBoxOne Remotes have been normalized into
        * returning identical events and naming conventions. Each
        * of the buttons have events for down, up, and holding.
        * Along with the down, up and hold events, analog inputs
        * can also provide the value such as the stick position
        * or the trigger value.
        * Inputs available:
        * [
        *   up, down, left, right,      // Directional
        *   north, east, west, south,   // Actions
        *   share, options, home,       // System
        *   leftBumper, rightBumper,    // Bumpers
        *   leftTrigger, rightTrigger,  // Triggers (Analog)
        *   leftStick, rightStick,      // Directional (Analog)
        *   leftStickBtn, rightStickBtn // Actions
        * ]
        ***/
        PS4.on('ready', (controller) => {
            Object.keys(controller.buttons).forEach(btn => {
                controller.on(btn + ':down', () => console.log(controller.config.name, btn));
                controller.on(btn + ':up', () => console.log(controller.config.name, btn));
                controller.on(btn + ':hold', () => console.log(controller.config.name, btn + ': holding'))
            });
            ['left', 'right'].forEach(direction => {
                controller.on(direction + 'Trigger', (triggerValue) => console.log(controller.config.name, direction + 'Trigger:', triggerValue));
                controller.on(direction + 'Stick', (stickValue) => console.log(controller.config.name, direction + 'Stick:', stickValue));
            });
        });
        
        XBoxOne.on('ready', (controller) => {
            Object.keys(controller.buttons).forEach(btn => {
                controller.on(btn + ':down', () => console.log(controller.config.name, btn));
                controller.on(btn + ':up', () => console.log(controller.config.name, btn));
                controller.on(btn + ':hold', () => console.log(controller.config.name, btn + ': holding'))
            });
            ['left', 'right'].forEach(direction => {
                controller.on(direction + 'Trigger', (triggerValue) => console.log(controller.config.name, direction + 'Trigger:', triggerValue));
                controller.on(direction + 'Stick', (stickValue) => console.log(controller.config.name, direction + 'Stick:', stickValue));
            });
        });
        
    });
    
}());
