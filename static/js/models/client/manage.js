(function(define) {

    define(function(require, exports, module) {

        var client = require('../client'),
            view = require('../../views/client/manage'),
            Request = require('../request');

        /**
         * @module models/client/manage
         */
        var manage = {

            /**
             * @method init
             * @constructor
             * @param  {object} options
             * @return {void}
             */
            init : function () {
                this.view = new view();
            },

            /**
             * @method connect
             * @return {void}
             */
            connect : function () {

                var client = this;

                this._super();

                this.view.addFlushClientsButton(function () {
                    console.log('flush clients');
                    client.connection.emit('flush-clients');
                });

                this.view.addFlushRequestsButton(function () {
                    console.log('flush requests');
                    client.connection.emit('flush-requests');
                });

                client.connection.on('refresh-requests', function (requestStore) {
                    console.log('refresh-requests', requestStore);
                });

                client.connection.on('refresh-clients', function (clientData) {
                    client.view.refreshClient(clientData);
                    console.log('refresh-client', clientData);
                });

                client.connection.on('server-notification', function(notification) {
                    if (notification.type === 'online') {
                        console.log(notification.user);
                        client.view.addClient(notification.user);
                    } else if (notification.type === 'offline') {
                        client.view.removeClient(notification.user);
                    }
                });

                client.connection.on('disconnect', function() {
                    client.view.removeClient(client.info);
                });

                client.connection.on('server-request', function(requestData) {

                    var request = new Request(requestData);

                    if (!request.hasResponse() && !request.isCancelled()) {
                        client.view.addRequest(request.get());
                    } else
                    if (request.isCancelled()) {
                        client.view.addResponse(request.getSender());
                    } else {
                        client.view.addResponse(request.getLatestResponse());
                    }
                });
            }
        };

        module.exports = client.extend(manage);
    });

}(typeof define === "function" ? define : function(fn) { fn(require, exports, module); }));