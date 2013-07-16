(function(define) {

    define(function(require, exports, module) {

        var base = require('../../views/client');

        /**
         * @module views/client/manage
         */
        var manage =  {

            /**
             * @method  init
             * @return {void}
             */
            init : function () {
                this._super();
                this.flushClients = $('#flush-clients');
                this.flushRequests = $('#flush-requests');
                this.clientList = $('#client-list tbody');
                this.requestList = $('#request-list tbody');
            },

            /**
             * @method  addFlushClientsButton
             * @param {Function} callback
             */
            addFlushClientsButton : function (callback) {
                this.flushClients.click(callback);
            },

            /**
             * @method  addFlushRequestsButton
             * @param {Function} callback
             */
            addFlushRequestsButton : function (callback) {
                this.flushRequests.click(callback);
            },

            /**
             * @method  addClient
             * @param {void} client
             */
            addClient : function (client) {

                var clientHtml = '<tr id="id-' + client.id + '">' +
                        '<td>' + client.id + '</td>' +
                        '<td><input class="name" type="text" value="' + client.auth.displayName + '" /></td>' +
                        '<td><input class="floor" type="text" value="' + client.floor + '" /></td>' +
                        '<td><input class="location" type="text" value="' + client.location + '" /></td>' + 
                    '</tr>';

                this.clientList.append(clientHtml);
            },

            /**
             * @method  addRequest
             * @param {void} request
             */
            addRequest : function (request) {

                var requestTime = new Date(request.timestamp),
                    requestHtml = '<tr id="id-' + request.sender.id + '">' +
                        '<td>' + request.id + '</td>' +
                        '<td>' + request.sender.id + '</td>' +
                        '<td><ul><li>request sent: ' +
                            requestTime.getHours() + ':' + 
                            requestTime.getMinutes() + ':' + 
                            requestTime.getSeconds() + 
                        '</li></ul></td>' +
                    '</tr>';

                this.requestList.append(requestHtml);
            },

            /**
             * @method  addResponse
             * @param {void} response
             */
            addResponse : function (response) {
                
                var responseTime = new Date(response.timestamp),
                    responseHtml = '<li>' +
                        (response.type === 'customer' ? 'customer ' : 'response ') +
                        (response.status ? 'accepted' : (response.type === 'customer' ? 'cancelled' : 'declined')) + ': ' + 
                        responseTime.getHours() + ':' + 
                        responseTime.getMinutes() + ':' + 
                        responseTime.getSeconds() + 
                    '</li>';

                this.requestList.find('ul').append(responseHtml);
            },

            /**
             * @method  removeClient
             * @param  {object} client
             * @return {void}       
             */
            removeClient : function (client) {
                this.clientList.find('#id-' + client.id).remove();
            },

            /**
             * @method  removeResponse
             * @param  {object} client
             * @return {void}       
             */
            removeResponse : function (client) {
                this.clientList.find('#rid-' + client.id).remove();
            },

            /**
             * @method  refreshClients
             * @return {void}
             */
            refreshClient : function (client) {

                var clientRow = $('#id-' + client.id);

                for (var d in client) {
                    clientRow.find('.' + d).attr('value', client[d]);
                }
            }
        };

        module.exports = base.extend(manage);
    });

}(typeof define === "function" ? define : function(fn) { fn(require, exports, module); }));