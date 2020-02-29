'use strict'

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

    })

    instance.on('clientDisconnect', function(client){

    })

    instance.on('subscribe', function(client, err){

    })

    instance.on('unsubscribe', function(client, err){

    })

    instance.on('clientError', function(client, err){

    })

    instance.on('publish', function(client, err){
                
    })
}

module.exports = logging