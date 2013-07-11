(function(define) {

    define(function(require, exports, module) {

        var Store = require('../store');

        /**
         * @module models/store/requests
         */
        var Requests = {

            counter : 0,

            /**
             * @method flush
             * @param  {string} prop
             * @param  {[type]} value
             * @return {void}
             */
            flush : function (prop, value) {

                var request, r;

                for (r in this.registry) {
                    request = this.registry[r];
                    if (this.registry[r].timestamp < new Date().getTime() - value) {
                        delete this.registry[r];
                        console.log('deleting request (timed out): ' + request.id);
                    }
                }
            },
            
            /**
             * update
             * @param  {string} rid
             * @param  {object} requestData
             * @return {null}
             */
            update : function (id, requestData) {

                if (!this.find(id)) {
                    requestData.counter = ++this.counter;
                }

                this._super(id, requestData);

                return requestData;
            }
        };

        Requests = Store.extend(Requests);

        module.exports = new Requests();
    });

}(typeof define === "function" ? define : function(fn) { fn(require, exports, module); }));
