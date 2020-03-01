
var ws = require('websocket-stream')
var aedes = require('aedes');
var logger = require('./')

var instance = aedes()
var server = logger({
    instance: instance,
})

ws.createServer({
    server: server
}, instance.handle)