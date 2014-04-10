/*
webcat.js
modern, node.js netcat
bobbybee
2014
*/

if(process.argv.length == 2) usage();
if(process.argv[2] == '--help') help();

function usage(e) {
    console.log("node webcat.js [-lwsbq] [ip] port");
    if(!e) process.exit(0);
}
function help() {
    usage(1);
    console.log("-l: listen on port");
    console.log("-w: use websocket");
    console.log("-s: use socket.io");
    console.log('-b: use binary data [unimplemented]')
    console.log("-q: suppress all non-data")
    process.exit(0);
}

var SOCKET = 0,
    WEBSOCKET = 1,
    SOCKETIO = 2;

var listen = false;
var medium = SOCKET;
var quiet = false;

var ip = '0.0.0.0', port = 1234;

for(var i = 2; i < process.argv.length; ++i) {
    var arg = process.argv[i];
    if(arg[0] == '-') {
        var args = arg.slice(1).split('');
        for(var j = 0; j < args.length; j++) {
            if(args[j] == 'l') listen = true;
            if(args[j] == 'w') medium = WEBSOCKET;
            if(args[j] == 's') medium = SOCKETIO;
            if(args[j] == 'q') quiet = true;
        }
    } else if(i == process.argv.length - 2) {
        ip = arg;
    } else if(i == process.argv.length - 1) {
        port = arg;
    }
}

switch(medium) {
case SOCKET:
    var net = require('net');
    if(listen) {
        net.createServer(function(conn) {
            newConn(conn);
            conn.on('data', function(d) {
                ondata(conn, d.toString());
            });
            conn.on('end', function(){ 
                end(conn);
            });
        }).listen(port);
    } else {
        var sockcli = net.connect({port: port, host: ip}, function() {
            newConn(sockcli)
        });
        sockcli.on('data', function(data) {
            ondata(sockcli, data.toString())
        })
        sockcli.on('end', function(){
            end(sockcli);
        })
    }
    break;
}

var client = null;

function newConn(conn) {
    if(!quiet) console.log("open");
    client = conn;
}

function ondata(conn, data) {
    console.log(data);
}

function end(conn) {
    process.exit(0);
}

process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdin.on("data", function(chunk) {
    if(medium == SOCKET) client.write(chunk);
})