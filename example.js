var http = require('http')
var ws = require('websocket-stream')
var aedes = require('aedes');
var logger = require('./')

var server = http.createServer()

logger({
    instance: aedes(),
    servers: [server]
})

ws.createServer({
    server: server
}, aedes)