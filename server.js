/*
global $: false, console : false, s_gi : false
jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true,
undef:true, unused:true,curly:true, browser:true, indent:4, maxerr:50
*/

var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    requestStore = require('./static/js/models/store/requests'),
    clientStore = require('./static/js/models/store/clients'),
    Request = require('./static/js/models/request');

server.listen(5000, '0.0.0.0');

//needed for heroku
io.configure(function () { 
    io.set("transports", ["websocket","xhr-polling"]); 
    io.set("polling duration", 10); 
    //io.set("log level", 1);
});

// dispatch http requests:
app.get('/manage', function (req, res) {
  res.sendfile(__dirname + '/static/manage.html');
});

//to serve static assets
app.use("/static/js", express.static(__dirname + '/static/js'));
app.use("/static/css", express.static(__dirname + '/static/css'));
app.use("/lib", express.static(__dirname + '/lib'));

//delay (seconds) till a request is not location specific
var locatedTimeout = 10;

//TODO consolidate the event listeners below
var processRequest = function (requestData, callback) {

};

//TODO consolidate the event listeners below
var processClient  = function (clientData, callback) {

};

//websocket events
io.sockets.on('connection', function (socket) {

    socket.on('client-request-update', function(requestData, callback) {

        if (callback) callback();

        requestData = requestStore.update(requestData.id, requestData);

        console.log('requestData', requestData.id);

        (function callLocatedClient(data) {

            var requestModel = new Request(data);

            if (requestModel.alreadyHasPositiveResponse() || !requestStore.find(requestData.id)) {
                console.log('clear timeout');
                clearTimeout(requestTimer);
                return;
            }
            console.log('emitting', data.id);
            io.sockets.emit('server-request', data);

            if (data.located === true && !requestModel.alreadyHasPositiveResponse()) {
                requestTimer = setTimeout(function () {
                    console.log('fire timeout');
                    data.located = false;
                    callLocatedClient(data);
                    clearTimeout(requestTimer);
                }, locatedTimeout * 1000);
            }
         })(requestData);
    });

    socket.on('client-pair-request', function (client, fn) {
        io.sockets.emit('clients-pair-request', {'client' : client});
        console.log('clients-pair-request');
    });

    socket.on('client-pair-response', function (client, fn) {
        io.sockets.emit('clients-pair-response', {'client' : client});
        console.log('clients-pair-response');
    });

    socket.on('connect', function(data, callback) {
        socket.set('id', data.id, function () {
            console.log('connect', requestStore.registry);
            if (clientStore.update(data.id, data)) {
                console.log('client in registry');
                if (callback) callback(clientStore.find(data.id));
            };

            io.sockets.emit('server-notification' , {'user' : data, 'type' : 'online', 'id' : data.id});
            io.sockets.emit('server-sync', {requests : requestStore.registry})
        });
    });

    socket.on('disconnect', function(data, callback) {
        socket.get('id', function (err, id) {
            if (callback) callback();
            console.log('disconnect');
            io.sockets.emit('server-notification' , {'user' : clientStore.find(id), 'type' : 'offline'} );
            //clientStore.remove(id);
        });
    });

    socket.on('client-update', function(data, callback) {
        clientStore.update(data.id, data);
        console.log('client update', clientStore.registry);
        io.sockets.emit('refresh-clients', clientStore.registry[data.id]);
    });

    //events for client web app tool
    socket.on('flush-requests', function () {
        requestStore.flush('timestamp', 6000);

        //TODO in callback for after timeout
        //io.sockets.emit('refresh-requests', requestStore);
    });

    socket.on('flush-clients', function () {
        clientStore.flush();
        io.sockets.emit('flushing');

        //TODO in callback
        //io.sockets.emit('refresh-clients', clientStore);
    });

    socket.on('acknowledge', function (client, fn) {
        console.log('client acknowledged', client);
        clientStore.addActive(client.id, client);
    });
});
