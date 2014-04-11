(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    'use strict';

    /**
    *  browserify modules dependencies
    **/
    var EventEmitter = require('../utils/event'),
        extend       = require('../utils/extend'),
        Kiwapp       = window.Kiwapp;

    /**
     * Wrapper for Kiwapp native API calls
     */
    var launch = function launch(name,data) {
        Kiwapp.driver().trigger('callApp', {
            call: name,
            data: data
        });
    };

    /**
     * KWQRCode class
     */
    function KWQRCode() {
        EventEmitter.call(this);
        this.version = require('./version');

        eventsListening(this);
    }

    /**
     * EventEmitter interface
     */
    KWQRCode.prototype = Object.create(EventEmitter.prototype);

    /**
     * Active the QR code scan
     * @param  {Object} config The scan configuration
     * @return {KWQRCode/false} Return current instance if success, else return false
     */
    KWQRCode.prototype.scan = function KWQRCodeScan(config){
        extend({}, {
            timeout : 5,
            sound : true,
            cancel_button : 'Cancel',
            top_label : 'Scanning QRCode'
        }, config);

        Kiwapp.log('[JS@KWQRCode] Scanning');
        launch('qrcode_scan', config);
        return this;
    };

    /**
     * [Private] Active events listening for KWQRCode instance
     * @param  {KWQRCode} self Instance listening events
     * @return {undefined}   Return undefined
     */
    function eventsListening(self){
        Kiwapp.driver().on('qrcodeScanAnswer', function(answer){
            Kiwapp.log('[JS@KWQRCode] Scan finished');
            self.trigger('scan', answer);
        });
    }

    /**
     * add KWQRCode to window
     * @type {KWQRCode}
     */
    window.KWQRCode  = KWQRCode;
    module.exports = KWQRCode;
})();

},{"../utils/event":3,"../utils/extend":4,"./version":2}],2:[function(require,module,exports){
module.exports = '1.0.0';

},{}],3:[function(require,module,exports){
'use strict';
(function(){
    function EventEmitter(){
        this.events = {};
    }

    EventEmitter.prototype.on = function(eventName, callback, instance) {

        if(!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push({callback : callback, instance : instance});
    };

    EventEmitter.prototype.trigger = function(events) {

        var args = Array.prototype.slice.call(arguments);
        args.shift();

        if(!Array.isArray(events)) {
            events = [events];
        }

        for(var i = 0; i < events.length; i++) {

            var eventName = events[i],
                splitName = eventName.split('*');

            if(splitName.length <= 1){
                if(!this.events[eventName]) {
                    continue;
                }

                for(var o = 0; o < this.events[eventName].length; o++) {
                    this.events[eventName][o].callback.apply(this.events[eventName][o].instance , args);
                }

            } else{
                for(var x in this.events) {

                    if(x.indexOf(splitName[1]) > -1) {
                        eventName = x;

                        for(var u = 0; u < this.events[eventName].length; u++) {
                            this.events[eventName][u].callback.apply(this.events[eventName][u].instance, args);
                        }
                    }
                }
            }
        }
    };

    module.exports = EventEmitter;
})();
},{}],4:[function(require,module,exports){
'use strict';
(function(){
    /**
     * A method which imitate jQuery extend method
     * @return {object} The concat final object
     */
    module.exports = function extend(){
        for(var i=1; i<arguments.length; i++)
            for(var key in arguments[i])
                if(arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    };
})();
},{}]},{},[1]);