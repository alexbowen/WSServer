(function(define) {

    define(function(require, exports, module) {

        var $ = require('jquery');

        /**
         * @module views/client
         */
        var clientView =  {
            init : function () {
                this.disconnect = $('#disconnect');
                this.login = $('#login');
            },

            setClientInfo : function (info) {
                this.info = info;
                this.setTitle(this.info.type, this.info.name);
            },

            setTitle : function (type, name) {
                document.title += ' - ' + type + ' - ' + name;
            },

            addDisconnectButton : function (callback) {
                this.disconnect.click(callback);
            },

            addLoginButton : function (callback) {
                this.login.click(callback);
            }
        };

        module.exports = Class.extend(clientView);
    });

}(typeof define === "function" ? define : function(fn) { fn(require, exports, module); }));