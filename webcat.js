/*
webcat.js
modern, node.js netcat
bobbybee
2014
*/

if(process.argv.length == 2) usage();
if(process.argv[2] == '--help') help();

function usage(e) {
    console.log("node webcat.js [-lws] [ip] port");
    if(!e) process.exit(0);
}
function help() {
    usage(1);
    console.log("-l: listen on port");
    console.log("-w: use websocket");
    console.log("-s: use socket.io");
    process.exit(0);
}

var SOCKET = 0,
    WEBSOCKET = 1,
    SOCKETIO = 2;

var listen = false;
var medium = SOCKET;

var ip = '0.0.0.0', port = 1234;

for(var i = 2; i < process.argv.length; ++i) {
    var arg = process.argv[i];
    if(arg[0] == '-') {
        var args = arg.slice(1).split('');
        for(var j = 0; j < args.length; j++) {
            if(args[j] == 'l') listen = true;
            if(args[j] == 'w') medium = WEBSOCKET;
            if(args[j] == 's') medium = SOCKETIO;
        }
    } else if(i == process.argv.length - 2) {
        ip = arg;
    } else if(i == process.argv.length - 1) {
        port = arg;
    }
}

console.log(ip+","+port+","+listen+","+medium);