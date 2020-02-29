var http = require('http')
var ws = require('websocket-stream')
var aedes = require('aedes');
var logger = require('./')

var server = http.createServer()
ws.createServer({
    server: server
}, aedes)

logger({
    instance: instance,
    servers: [server]
})