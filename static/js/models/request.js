(function(define) {

    define(function(require, exports, module) {

        /**
         * @module models/request
         */
        var Request = {

            data : {
                'id'        : null,
                'sender'    : null,
                'response'  : [],
                'status'    : null,
                'content'   : 'test',
                'callback'  : null,
                'render'    : null,
                'html'      : null
            },

            /**
             * @method init
             * @constructor
             * @param  {object} data
             * @return {void}
             */
            init : function (data) {

                var c = {};

                for(var p in this.data) {
                    c[p] = (data[p] == null) ? this.data[p] : data[p];
                }    

                this.data = c;
            },

            /**
             * 
             * @method  setup
             * @return {void}
             */
            setup : function () {
                this.timestamp();
                this.data.sender.status = 1;
            },

            /**
             * @method  timestamp
             * @return {integer}
             */
            timestamp : function () {

                var now = new Date().getTime();

                this.data.timestamp = now;
                this.data.sender.timestamp = now;

                return now;
            },

            /**
             * @method addResponse
             * @param {void} responseData
             */
            addResponse : function (responseData) {

                if (!this.data.response) {
                    this.data.response = [];
                }

                if (!this.clientResponseExists(responseData)) {
                    this.data.response.push(responseData);
                } else return false;
            },

            /**
             * @method  alreadyHasPositiveResponse
             * @return {Boolean}
             */
            alreadyHasPositiveResponse : function () {

                if (this.getLatestResponse()) {
                    if (this.getResponseStatus()) {
                        return true;
                    }
                }

                return false;
            },

            /**
             * @method getStatus
             * @return {Boolean}
             */
            getResponseStatus : function () {
                return !!this.getLatestResponse().status;
            },

            /**
             * @method clientResponseExists
             * @param  {object} responseData
             * @return {Boolean}
             */
            clientResponseExists : function(responseData){

                var alreadyReplied = false, i;

                if (!this.data.response) return false;

                for (i = this.data.response.length - 1; i >= 0; i--) {
                    if (this.data.response[i].id === responseData.id) alreadyReplied = true;
                }

                return alreadyReplied;
            },

            isCancelled : function () {
                return !!(this.data.sender.status === 0); 
            },

            /**
             * @method accept
             * @return {void}
             */
            accept : function () {

                var response = this.getLatestResponse();

                response.status = 1;
                response.timestamp = new Date().getTime();
            },

            /**
             * @method accept
             * @return {void}
             */
            decline : function () {

                var response = this.getLatestResponse();

                response.status = 0;
                response.timestamp = new Date().getTime();
            },

            /**
             * @method  cancel
             * @return {void}
             */
            cancel : function () {
                this.data.sender.status = 0;
            },

            /**
             * @method getStatus
             * @return {Boolean}
             */
            getStatus : function () {
                return this.getLatestResponse().status;
            },

            /**
             * @method getLatestResponse
             * @return {object}
             */
            getLatestResponse : function () {
                return this.data.response[0];
            },

            /**
             * @method getFirstResponse
             * @return {object}
             */
            getFirstResponse : function () {
                return this.data.response[this.data.response.length - 1];
            },

            /**
             * @method getResponses
             * @return {array}
             */
            getResponses : function () {
                return this.data.response;
            },

            /**
             * @method hasResponse
             * @return {boolean}
             */
            hasResponse : function () {
                return !!(this.data.response.length);
            },

            /**
             * @method getSender
             * @return {object}
             */
            getSender : function () {
                return this.data.sender;
            },

            /**
             * @method get
             * @return {object}
             */
            get : function () {
                return this.data;
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

            setCallback : function (callback) {
                this.data.callback = callback;
            },

            setRender : function (render) {
                this.data.render = render;
            },

            setHtml : function (html) {
                this.data.html = html;
            }
        };

        module.exports = Class.extend(Request);
    });

}(typeof define === "function" ? define : function(fn) { fn(require, exports, module); }));