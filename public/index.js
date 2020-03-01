console.log("Hello World!")

var canvas = document.getElementById('page')
var maxCircleSize = 75
var total_clients = 10;
var broker = null;
var clients = [];

function deg_to_rad(deg){
    return deg * Math.PI/180
}

function generate_obj(x, y, radius, props){
    if(props == undefined) props = {}
    return {x: x, y: y, radius: radius, props: props}
}

function init(){
    var midX = screen.width / 2 - maxCircleSize / 2
    var midY = screen.height / 2 - maxCircleSize / 2
    broker = generate_obj(midX, midY, maxCircleSize)
}

function generate_clients(clientdata){
    //deal with client JSON here
    var distance = 2 + total_clients/10
    for(var i = 0; i < total_clients; i++){
        var offsetX = maxCircleSize * distance * Math.sin(deg_to_rad(360/total_clients * i - 180))
        var offsetY = maxCircleSize * distance * Math.cos(deg_to_rad(360/total_clients * i - 180))
        clients.push(generate_obj(broker.x + offsetX, broker.y + offsetY, maxCircleSize / 2))
    }
}

function drawMap(){
    canvas.setAttribute('width', screen.width + 'px')
    canvas.setAttribute('height', screen.height + 'px')
    var ctx = canvas.getContext("2d")
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.arc(broker.x, broker.y, broker.radius, 0, 2 * Math.PI)
    ctx.stroke()

    //draw clients
    clients.forEach(client =>{
        ctx.beginPath()
        if(client.props.selection){
            ctx.fillStyle = 'red'
        }else{
            ctx.fillStyle = 'blue'
        }
        ctx.arc(client.x, client.y, client.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    })
}

var mouseMove = function(event){
    var offset = canvas.getBoundingClientRect()
    clients.forEach(obj => {
        var d = Math.sqrt(Math.pow(event.clientX - obj.x -offset.left, 2) + Math.pow(event.clientY - obj.y - offset.top, 2))
        var change = false;
        if(d < obj.radius && !obj.props.selection){
            obj.props.selection = true
            change = true
        }else if(d > obj.radius && obj.props.selection){
            obj.props.selection = false
            change = true
        }
        if(change){
            drawMap()
        }
    })
}

canvas.addEventListener("mousemove", mouseMove)

function gatherData(datauri){
    var xhttp = new XMLHttpRequest()
    xhttp.open("GET", datauri, false)
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send()
    return JSON.parse(xhttp.responseText)
}

init()
generate_clients()
drawMap()

console.log(gatherData('/clients'));

window.setInterval(gatherData, 15000)