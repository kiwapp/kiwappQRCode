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
