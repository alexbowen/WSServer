(function(define) {

    define(function(require, exports, module) {

        //here we need to delete the store module from
        //cache otherwise stores will be combined
        if (typeof window !== 'object') delete require.cache[require.resolve('../store')];

        var Store = require('../store');

        /**
         * @module models/store/clients
         */
        var Clients = {

            flushRegistry : {},
            timer : 0,

            /**
             * @method setTimer
             * @param {integer} ms
             */
            setTimer : function(ms) {
                this.timer = ms;
            },

            /**
             * @method getTimer
             * @return {integer}
             */
            getTimer : function() {
                return this.timer;
            },

            /**
             * @method addActive
             * @param {string} id
             * @param {object} obj
             */
            addActive : function (id, obj) {

                if (typeof obj === 'object') {
                    this.flushRegistry[id] = obj;
                    return true;
                }

                return false;
            },

            /**
             * @method reset
             * @return {void}
             */
            reset : function () {
                this.flushRegistry = {};
            },

            /**
             * @method flush
             * @param  {string} prop
             * @param  {[type]} value
             * @return {void}
             */
            flush : function(prop, value) {

                var clientStore = this;

                this.setTimer(10000);

                setTimeout(function () {
                    clientStore.registry = clientStore.flushRegistry;
                    clientStore.reset();
                    console.log('flushed clientStore', clientStore.registry);
                }, clientStore.getTimer());
            }
        };

        Clients = Store.extend(Clients);

        module.exports = new Clients();
    });

}(typeof define === "function" ? define : function(fn) { fn(require, exports, module); }));
