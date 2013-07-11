(function(define) {

    define(function(require, exports, module) {

        require('../../../lib/application/class');

        /**
         * @module models/store
         */
        var Store = {

            registry : {},

            /**
             * @method remove
             * @param  {string} id
             * @return {void}
             */
            remove : function (id) {
                delete this.registry[id];
            },

            /**
             * @method find
             * @param  {string} id
             * @return {Boolean}
             */
            find : function (id) {
                return this.registry[id] || false;
            },

            /**
             * @method update
             * @param  {string} id
             * @param  {object} data
             * @return {Boolean} true if exists in registry
             */
            update : function (id, data) {

                if (typeof data === 'object') {

                    if (!this.registry[id]) {
                        this.registry[id] = data;
                        return false;
                    }

                    var c = {};

                    for(var p in this.registry[id]) {
                        c[p] = (data[p] == null) ? this.registry[id][p] : data[p];
                    }    

                    this.registry[id] = c;

                    return true;
                }

                return false;
            },

            /**
             * @method clear
             * @return {void}
             */
            clear : function () {
                this.registry = {};
            },

            /**
             * @method count
             * @param  {string} type
             * @return {integer}
             */
            count : function (field, value) {

                var count = 0, c;

                for (c in this.registry) {
                    if (this.registry[c][field] === value) count++;
                }

                return count;
            },

            /**
             * @method extend
             * @param  {object} destination
             * @param  {object} source
             * @return {object}
             */
            extend : function(destination, source) {
                for (var property in source) {
                    if (typeof source[property] === "object") {
                        destination[property] = destination[property] || {};
                        arguments.callee(destination[property], source[property]);
                    } else {
                        destination[property] = source[property];
                    }
                }
                return destination;
            }
        };

        module.exports = Class.extend(Store);
    });

}(typeof define === "function" ? define : function(fn) { fn(require, exports, module); }));
