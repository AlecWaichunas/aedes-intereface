'use strict'

var { JsonDB } = require('node-json-db')
var { Config } = require('node-json-db/dist/lib/JsonDBConfig')
var db = new JsonDB(new Config("db", true, true, "/"))

function logging(opts) {
    var instance = opts.instance
    var servers = opts.servers

    if (!servers) {
        if (opts.server)
            servers = [opts.server]
        else
            servers = []
    }

    instance.on('client', function (client) {
        db.push("/clients/" + client.id, { "connected": "true" }, false)
    })

    instance.on('clientDisconnect', function (client) {
        db.push("/clients/" + client.id, { "connected": "false" }, false)
    })

    instance.on('subscribe', function (subscriptions, client) {
        db.push("/subscriptions/" + client.id, { "subscriptions": subscriptions })
    })

    instance.on('unsubscribe', function (subscriptions, client) {
        db.push("/subscriptions/" + client.id, { "subscribedto": subscriptions })
    })

    instance.on('clientError', function (client, err) {
        db.push("/clientError/" + err, { "clientid": [client.id] }, false)
    })

    instance.on('published', function (packet, client) {
        db.push("/published/" + packet, { "clientid": [client.id] }, false)
    })
}

//returns true if client is connected
function isConnected(client) {
    return db.getData("/clients/" + client.id + "/").connected == "true"
}

//returns all connected clients
function getConnectedClients() {
    var connectedClients = []
    for (var client in db.getData("/clients/")) {
        if (isConnected(client)) {
            connectedClients.push(client)
        }
    }
    return connectedClients
}

// //returns all clients
// function getAllClients() {
//     return db.getData("/clients")
// }

//returns topics to which client is subscribed. this shouldnt be 3 layers deep yet here we are
function getSubscriptions(client) {
    return db.getData("/subscriptions/" + client.id + "/subscribedto/")
}

//returns all subscriptions of all clients
function getAllSubscriptions() {
    var subscriptions = []
    for (var client in getConnectedClients()) {
        subscriptions.push(getSubscriptions(client))
    }
    return subscriptions
}

//returns list of clients that sent err
function getError(err) {
    return db.getData("/clientError/" + err + "/clientid/")
}

//returns clients that published packet
function getPublished(packet, client) {
    return db.getData("/published/" + packet + "/clientid/")
}

//returns all published packets
function getAllPublished() {
    return db.getData("/published/")
}

module.exports = logging