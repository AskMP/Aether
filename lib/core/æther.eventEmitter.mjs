const   EVENTS = Symbol('EVENTS'),
        READY = Symbol('READY');

export class EventEmitter {

    constructor() {
        /***
         * Welcome to the EventEmitter class
         * You may create and trigger events as you would with most
         * other event systems out there:
         * 
         * myObject.on('awesomeEvent', data => console.log(data));
         * myObect.addEventListener('awesomeEvent', data => console.log(data));
         * 
         * Events can be set to only trigger once
         * myObject.once('awsomeEvent', data => console.log(data));
         * myObject.on('awesomeEvent', data => console.log(data), true);
         * 
         * You can easily remove events as well:
         * myObject.off('awesomeEvent', data => console.log(data));
         * myObject.removeEventListener('awesomeEvent', data => console.log(data));
         * myObject.offAll('awesomeEvent');
         * 
         * Setting and triggering the "ready" event will result in callbacks
         * being triggered if the ready event has already fired. This is to
         * help with larger classes or loading of multiple modules
         */
    }
    
    /***
     * @param { String } trigger
     * The event name to be listened for.
     * There is a special clause for the 'ready' trigger but otherwise
     * it simply creates an array on the event variable.
     * 
     * @param { function } fn
     * The method to do upon the event being triggered.
     * Best practice is to have the method as a variable in case you are
     * wanting to remove it later. 
     * An error will be thrown if the second paramter is NOT a function.
     * 
     * [optional] @param { boolean } once
     * Whether to only trigger a single time (Default: false)
     * Events can be triggered a single time by passing a boolean of true
     * as a third parameter.
     */
    on(trigger, fn, once = false) {
        if (typeof fn != 'function') throw new Error(`Invalid Listener: ${trigger}. Must be a function`);
        if (trigger === 'ready' && !!this[READY]) {
            fn();
            return this;
        }
        if (!this[EVENTS]) this[EVENTS] = {};
        if (!this[EVENTS][trigger]) this[EVENTS][trigger] = [];
        this[EVENTS][trigger].push({
            listener: fn,
            once: !!once
        });
        return this;
    }

    /***
     * A simple additional method to assist in creating events
     * that are only triggered once. Using this is clearer
     * for future readers of your code and their understanding
     * of the intent.
     */
    once(trigger, fn) { 
        return this.on(trigger, fn, true);
    }

    /***
     * Being able to remove events is critical. You do however
     * need to include the original function which is being
     * removed. This can be tricky if you are not setting the
     * original event as a variable, so keep in mind that.
     */
    off(trigger, fn) {
        if (!this[EVENTS] || !this[EVENTS][trigger]) return;
        this[EVENTS][trigger] = this[EVENTS][trigger].filter(evt => evt.listener !== fn);
    }

    /***
     * Sometimes, you just want to watch the world burn. So
     * why not throw out all the events.
     */
    offAll(trigger) {
        this[EVENTS][trigger] = [];
    }

    /***
     * This is the powerhorse of the class, it allows for you
     * to trigger your events and pass data through. Keep in
     * mind that ONLY the second parameter is passed to the
     * methods. If nothing is given as a second variable, then
     * nothing is sent.
     * 
     * This also returns a Promise so you can run ny code AFTER
     * all the evens have been triggered. Helpful for when you
     * are chaining things together but can be ignored if not
     * needed for your code.
     */
    emit(trigger, data) {
        return new Promise((resolve, reject) => {
            if (!this[EVENTS] || !this[EVENTS][trigger]) return resolve();
            this[EVENTS][trigger].forEach((evt, i) => {
                evt.listener(data);
                if (evt.once) this.off(trigger, evt.listener);
            });
            resolve();
        });
    }

    /***
     * Additional helper methods for broadening the scope of
     * available methods to perform actions.
     */
    addEventListener(trigger, fn) { return this.on(trigger, fn); }
    addListener(trigger, fn) { return this.on(trigger, fn); }
    removeEventListener(trigger, fn) { return this.off(trigger, fn); }
    removeListener(trigger, fn) { return this.off(trigger, fn); }
    removeAllListeners(trigger) { return this.offAll(trigger); }

    /***
     * Special method for cases where modules have reliant other
     * modules or methods.
     */
    ready() {
        this[READY] = true;
        return this.emit('ready');
    }

}

export { EventEmitter as default };