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