(function(define) {

    define(function(require, exports, module) {

        require('../../../lib/application/class');

        /**
         * @module models/client
         */
        var client = {

            /**
             * @method init
             * @constructor
             * @param  {object} options
             * @return {void}
             */
            init : function (options) {

                this.options = options;

                if (localStorage.clientId) {
                    this.options.id = localStorage.clientId;
                } else {
                    this.options.id = this.createUUID();
                }

                this.connect();
            },

            /**
             * @method connect
             * @description  connect to server
             * @return {void}
             */
            connect : function () {
                this.connection = io.connect('http://0.0.0.0:5000');

                //this.connection = io.connect('http://goserver.cloudapp.net:5000');
            },

            /**
             * @method login
             * @description  supply client credentials to the server
             * @param  {Function} callback
             * @return {void}
             */
            login : function (callback) {

                var client = this;

                if (this.connection) this.connection.socket.reconnect();
                this.online = true;
                
                this.connection.emit('connect', client.getData(), callback);
            },

            /**
             * @method  logout
             * @param {Function} callback
             * @return {void}
             */
            logout : function (callback) {

                this.connection.disconnect();
                this.online = false;
                
                if (callback) callback();
            },

            /**
             * @method  response
             * @param  {Function} callback
             * @return {void}
             */
            response : function (callback) {
                this.connection.on('server-response', callback);
            },

            /**
             * @method  request
             * @param  {Function} callback
             * @return {void}
             */
            request : function (callback) {
                this.connection.on('server-request', callback);
            },

            getData : function () {
                return this.options;
            },

            setData : function (data) {
                this.options = data;
            },

            /**
             * @method createUUID
             * @return {string}
             */
            createUUID : function () {

                var s = [];
                var hexDigits = "0123456789abcdef";

                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }

                s[14] = "4";
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
                s[8] = s[13] = s[18] = s[23] = "-";

                var uuid = s.join("");

                return uuid;
            },

            setState : function (state) {
                this.options.state = state;
            }
        };

        module.exports = Class.extend(client);
    });

}(typeof define === "function" ? define : function(fn) { fn(require, exports, module); }));