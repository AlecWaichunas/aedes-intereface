'use strict'

var {JsonDB} = require('node-json-db')
var {Config} = require('node-json-db/dist/lib/JsonDBConfig')
var db = new JsonDB(new Config("db", true, true, "/"))

function logging(opts){
    var instance = opts.instance
    var servers = opts.servers

    if(!servers){
        if(opts.server)
            servers = [opts.server]
        else
            servers = []
    }

    instance.on('client', function(client){
        db.push("/connected", {client})
    })

    instance.on('clientDisconnect', function(client){
        db.delete("/connected", {client})
    })

    instance.on('subscribe', function(client, err){
        db.push("/connected", {client: topic})
    })

    instance.on('unsubscribe', function(client, err){
        db.delete("/connected", {client: topic})
    })

    instance.on('clientError', function(client, err){
        db.push("/clientError", {client: err})
    })

    instance.on('publish', function(packet, client){
        db.push("/publish", {client: packet})
    })
}

module.exports = logging