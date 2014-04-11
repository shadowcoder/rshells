!function(v){if("object"==typeof exports)module.exports=v();else if("function"==typeof define&&define.amd)define(v);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self);e.eio=v()}}(function(){return function e(h,g,d){function b(c,k){if(!g[c]){if(!h[c]){var s="function"==typeof require&&require;if(!k&&s)return s(c,!0);if(a)return a(c,!0);throw Error("Cannot find module '"+c+"'");}s=g[c]={exports:{}};h[c][0].call(s.exports,function(a){var d=
h[c][1][a];return b(d?d:a)},s,s.exports,e,h,g,d)}return g[c].exports}for(var a="function"==typeof require&&require,c=0;c<d.length;c++)b(d[c]);return b}({1:[function(e,h,g){h.exports=e("./lib/")},{"./lib/":3}],2:[function(e,h,g){e=e("emitter");h.exports=e;e.prototype.addEventListener=e.prototype.on;e.prototype.removeEventListener=e.prototype.off;e.prototype.removeListener=e.prototype.off},{emitter:16}],3:[function(e,h,g){h.exports=e("./socket");h.exports.parser=e("engine.io-parser")},{"./socket":4,
"engine.io-parser":17}],4:[function(e,h,g){(function(d){function b(c,l){if(!(this instanceof b))return new b(c,l);l=l||{};c&&"object"==typeof c&&(l=c,c=null);c&&(c=q(c),l.host=c.host,l.secure="https"==c.protocol||"wss"==c.protocol,l.port=c.port,c.query&&(l.query=c.query));this.secure=null!=l.secure?l.secure:d.location&&"https:"==location.protocol;if(l.host){var m=l.host.split(":");l.hostname=m.shift();m.length&&(l.port=m.pop())}this.agent=l.agent||!1;this.hostname=l.hostname||(d.location?location.hostname:
"localhost");this.port=l.port||(d.location&&location.port?location.port:this.secure?443:80);this.query=l.query||{};"string"==typeof this.query&&(this.query=a.qsParse(this.query));this.upgrade=!1!==l.upgrade;this.path=(l.path||"/engine.io").replace(/\/$/,"")+"/";this.forceJSONP=!!l.forceJSONP;this.forceBase64=!!l.forceBase64;this.timestampParam=l.timestampParam||"t";this.timestampRequests=l.timestampRequests;this.flashPath=l.flashPath||"";this.transports=l.transports||["polling","websocket","flashsocket"];
this.readyState="";this.writeBuffer=[];this.callbackBuffer=[];this.policyPort=l.policyPort||843;this.rememberUpgrade=l.rememberUpgrade||!1;this.open();this.binaryType=null;this.onlyBinaryUpgrades=l.onlyBinaryUpgrades}var a=e("./util"),c=e("./transports"),f=e("./emitter"),k=e("debug")("engine.io-client:socket"),g=e("indexof"),p=e("engine.io-parser"),q=e("parseuri"),r=e("parsejson");h.exports=b;b.priorWebsocketSuccess=!1;f(b.prototype);b.protocol=p.protocol;b.Socket=b;b.Transport=e("./transport");b.Emitter=
e("./emitter");b.transports=e("./transports");b.util=e("./util");b.parser=e("engine.io-parser");b.prototype.createTransport=function(a){k('creating transport "%s"',a);var l=this.query,m={},b;for(b in l)l.hasOwnProperty(b)&&(m[b]=l[b]);m.EIO=p.protocol;m.transport=a;this.id&&(m.sid=this.id);return new c[a]({agent:this.agent,hostname:this.hostname,port:this.port,secure:this.secure,path:this.path,query:m,forceJSONP:this.forceJSONP,forceBase64:this.forceBase64,timestampRequests:this.timestampRequests,
timestampParam:this.timestampParam,flashPath:this.flashPath,policyPort:this.policyPort,socket:this})};b.prototype.open=function(){var a;a=this.rememberUpgrade&&b.priorWebsocketSuccess&&-1!=this.transports.indexOf("websocket")?"websocket":this.transports[0];this.readyState="opening";a=this.createTransport(a);a.open();this.setTransport(a)};b.prototype.setTransport=function(a){k("setting transport %s",a.name);var c=this;this.transport&&(k("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners());
this.transport=a;a.on("drain",function(){c.onDrain()}).on("packet",function(a){c.onPacket(a)}).on("error",function(a){c.onError(a)}).on("close",function(){c.onClose("transport close")})};b.prototype.probe=function(a){function c(b){if(!d){d=!0;var l=Error("probe error: "+b);l.transport=m.name;m.close();m=null;k('probe transport "%s" failed because of error: %s',a,b);f.emit("upgradeError",l)}}k('probing transport "%s"',a);var m=this.createTransport(a,{probe:1}),d=!1,f=this;b.priorWebsocketSuccess=!1;
m.once("open",function(){if(this.onlyBinaryUpgrades){var e=!this.supportsBinary&&f.transport.supportsBinary;d=d||e}d||(k('probe transport "%s" opened',a),m.send([{type:"ping",data:"probe"}]),m.once("packet",function(e){d||("pong"==e.type&&"probe"==e.data?(k('probe transport "%s" pong',a),f.upgrading=!0,f.emit("upgrading",m),b.priorWebsocketSuccess="websocket"==m.name,k('pausing current transport "%s"',f.transport.name),f.transport.pause(function(){d||"closed"==f.readyState||"closing"==f.readyState||
(k("changing transport and sending upgrade packet"),m.removeListener("error",c),f.setTransport(m),m.send([{type:"upgrade"}]),f.emit("upgrade",m),m=null,f.upgrading=!1,f.flush())})):(k('probe transport "%s" failed',a),e=Error("probe error"),e.transport=m.name,f.emit("upgradeError",e)))}))});m.once("error",c);m.open();this.once("close",function(){m&&(k("socket closed prematurely - aborting probe"),d=!0,m.close(),m=null)});this.once("upgrading",function(a){m&&a.name!=m.name&&(k('"%s" works - aborting "%s"',
a.name,m.name),m.close(),m=null)})};b.prototype.onOpen=function(){k("socket open");this.readyState="open";b.priorWebsocketSuccess="websocket"==this.transport.name;this.emit("open");this.onopen&&this.onopen.call(this);this.flush();if("open"==this.readyState&&this.upgrade&&this.transport.pause){k("starting upgrade probes");for(var a=0,c=this.upgrades.length;a<c;a++)this.probe(this.upgrades[a])}};b.prototype.onPacket=function(a){if("opening"==this.readyState||"open"==this.readyState)switch(k('socket receive: type "%s", data "%s"',
a.type,a.data),this.emit("packet",a),this.emit("heartbeat"),a.type){case "open":this.onHandshake(r(a.data));break;case "pong":this.setPing();break;case "error":var c=Error("server error");c.code=a.data;this.emit("error",c);break;case "message":this.emit("data",a.data),this.emit("message",a.data),c={data:a.data,toString:function(){return a.data}},this.onmessage&&this.onmessage.call(this,c)}else k('packet received with socket readyState "%s"',this.readyState)};b.prototype.onHandshake=function(a){this.emit("handshake",
a);this.id=a.sid;this.transport.query.sid=a.sid;this.upgrades=this.filterUpgrades(a.upgrades);this.pingInterval=a.pingInterval;this.pingTimeout=a.pingTimeout;this.onOpen();this.setPing();this.removeListener("heartbeat",this.onHeartbeat);this.on("heartbeat",this.onHeartbeat)};b.prototype.onHeartbeat=function(a){clearTimeout(this.pingTimeoutTimer);var c=this;c.pingTimeoutTimer=setTimeout(function(){if("closed"!=c.readyState)c.onClose("ping timeout")},a||c.pingInterval+c.pingTimeout)};b.prototype.setPing=
function(){var a=this;clearTimeout(a.pingIntervalTimer);a.pingIntervalTimer=setTimeout(function(){k("writing ping packet - expecting pong within %sms",a.pingTimeout);a.ping();a.onHeartbeat(a.pingTimeout)},a.pingInterval)};b.prototype.ping=function(){this.sendPacket("ping")};b.prototype.onDrain=function(){for(var a=0;a<this.prevBufferLen;a++)if(this.callbackBuffer[a])this.callbackBuffer[a]();this.writeBuffer.splice(0,this.prevBufferLen);this.callbackBuffer.splice(0,this.prevBufferLen);this.prevBufferLen=
0;0==this.writeBuffer.length?this.emit("drain"):this.flush()};b.prototype.flush=function(){"closed"!=this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(k("flushing %d packets in socket",this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))};b.prototype.write=b.prototype.send=function(a,c){this.sendPacket("message",a,c);return this};b.prototype.sendPacket=function(a,c,b){a={type:a,data:c};this.emit("packetCreate",
a);this.writeBuffer.push(a);this.callbackBuffer.push(b);this.flush()};b.prototype.close=function(){if("opening"==this.readyState||"open"==this.readyState)this.onClose("forced close"),k("socket closing - telling transport to close"),this.transport.close();return this};b.prototype.onError=function(a){k("socket error %j",a);b.priorWebsocketSuccess=!1;this.emit("error",a);this.onerror&&this.onerror.call(this,a);this.onClose("transport error",a)};b.prototype.onClose=function(a,c){if("opening"==this.readyState||
"open"==this.readyState){k('socket close with reason: "%s"',a);var b=this;clearTimeout(this.pingIntervalTimer);clearTimeout(this.pingTimeoutTimer);setTimeout(function(){b.writeBuffer=[];b.callbackBuffer=[];b.prevBufferLen=0},0);this.transport.removeAllListeners();this.readyState="closed";this.id=null;this.emit("close",a,c);this.onclose&&this.onclose.call(this)}};b.prototype.filterUpgrades=function(a){for(var c=[],b=0,d=a.length;b<d;b++)~g(this.transports,a[b])&&c.push(a[b]);return c}}).call(this,
"undefined"!==typeof self?self:"undefined"!==typeof window?window:{})},{"./emitter":2,"./transport":5,"./transports":7,"./util":12,debug:15,"engine.io-parser":17,indexof:24,parsejson:25,parseuri:26}],5:[function(e,h,g){function d(a){this.path=a.path;this.hostname=a.hostname;this.port=a.port;this.secure=a.secure;this.query=a.query;this.timestampParam=a.timestampParam;this.timestampRequests=a.timestampRequests;this.readyState="";this.agent=a.agent||!1;this.socket=a.socket}e("./util");var b=e("engine.io-parser");
e=e("./emitter");h.exports=d;e(d.prototype);d.prototype.onError=function(a,c){var b=Error(a);b.type="TransportError";b.description=c;this.emit("error",b);return this};d.prototype.open=function(){if("closed"==this.readyState||""==this.readyState)this.readyState="opening",this.doOpen();return this};d.prototype.close=function(){if("opening"==this.readyState||"open"==this.readyState)this.doClose(),this.onClose();return this};d.prototype.send=function(a){if("open"==this.readyState)this.write(a);else throw Error("Transport not open");
};d.prototype.onOpen=function(){this.readyState="open";this.writable=!0;this.emit("open")};d.prototype.onData=function(a){this.onPacket(b.decodePacket(a,this.socket.binaryType))};d.prototype.onPacket=function(a){this.emit("packet",a)};d.prototype.onClose=function(){this.readyState="closed";this.emit("close")}},{"./emitter":2,"./util":12,"engine.io-parser":17}],6:[function(e,h,g){(function(d){function b(a){f.call(this,a);this.flashPath=a.flashPath;this.policyPort=a.policyPort}function a(a,c){if(q[a])return c();
var b=document.createElement("script"),d=!1;g('loading "%s"',a);b.onload=b.onreadystatechange=function(){if(!d&&!q[a]){var f=b.readyState;f&&"loaded"!=f&&"complete"!=f||(g('loaded "%s"',a),b.onload=b.onreadystatechange=null,d=!0,q[a]=!0,c())}};b.async=1;b.src=a;var f=document.getElementsByTagName("head")[0];f.insertBefore(b,f.firstChild)}function c(c,b){function d(m){if(!c[m])return b();a(c[m],function(){d(++m)})}d(0)}var f=e("./websocket"),k=e("../util"),g=e("debug")("engine.io-client:flashsocket");
h.exports=b;var p=d[["Active"].concat("Object").join("X")];k.inherits(b,f);b.prototype.name="flashsocket";b.prototype.supportsBinary=!1;b.prototype.doOpen=function(){function a(c){return function(){var a=Array.prototype.join.call(arguments," ");g("[websocketjs %s] %s",c,a)}}if(this.check()){d.WEB_SOCKET_LOGGER={log:a("debug"),error:a("error")};d.WEB_SOCKET_SUPPRESS_CROSS_DOMAIN_SWF_ERROR=!0;d.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION=!0;d.WEB_SOCKET_SWF_LOCATION||(d.WEB_SOCKET_SWF_LOCATION=this.flashPath+
"WebSocketMainInsecure.swf");var b=[this.flashPath+"web_socket.js"];d.swfobject||b.unshift(this.flashPath+"swfobject.js");var f=this;c(b,function(){f.ready(function(){WebSocket.__addTask(function(){f.ws=new WebSocket(f.uri());f.addEventListeners()})})})}};b.prototype.doClose=function(){if(this.ws){var a=this;WebSocket.__addTask(function(){f.prototype.doClose.call(a)})}};b.prototype.write=function(){var a=this,c=arguments;WebSocket.__addTask(function(){f.prototype.write.apply(a,c)})};b.prototype.ready=
function(a){function c(){b.loaded||(843!=f.policyPort&&WebSocket.loadFlashPolicyFile("xmlsocket://"+f.hostname+":"+f.policyPort),WebSocket.__initialize(),b.loaded=!0);a.call(f)}if("undefined"!=typeof WebSocket&&"__initialize"in WebSocket&&d.swfobject&&!(10>d.swfobject.getFlashPlayerVersion().major)){var f=this;if(document.body)return c();k.load(c)}};b.prototype.check=function(){if("undefined"==typeof window||"undefined"!=typeof WebSocket&&!("__initialize"in WebSocket))return!1;if(p){var a=null;try{a=
new p("ShockwaveFlash.ShockwaveFlash")}catch(c){}if(a)return!0}else for(var a=0,b=navigator.plugins.length;a<b;a++)for(var d=0,f=navigator.plugins[a].length;d<f;d++)if("Shockwave Flash"==navigator.plugins[a][d].description)return!0;return!1};var q={}}).call(this,"undefined"!==typeof self?self:"undefined"!==typeof window?window:{})},{"../util":12,"./websocket":11,debug:15}],7:[function(e,h,g){(function(d){var b=e("xmlhttprequest"),a=e("./polling-xhr"),c=e("./polling-jsonp"),f=e("./websocket"),k=e("./flashsocket");
g.polling=function(f){var e=!1;if(d.location){var e="https:"==location.protocol,k=location.port;k||(k=e?443:80);e=f.hostname!=location.hostname||k!=f.port}f.xdomain=e;return new b(f)&&!f.forceJSONP?new a(f):new c(f)};g.websocket=f;g.flashsocket=k}).call(this,"undefined"!==typeof self?self:"undefined"!==typeof window?window:{})},{"./flashsocket":6,"./polling-jsonp":8,"./polling-xhr":9,"./websocket":11,xmlhttprequest:13}],8:[function(e,h,g){(function(d){function b(c){a.call(this,c);k||(d.___eio||(d.___eio=
[]),k=d.___eio);this.index=k.length;var b=this;k.push(function(a){b.onData(a)});this.query.j=this.index}var a=e("./polling"),c=e("../util");h.exports=b;var f=/\n/g,k;c.inherits(b,a);b.prototype.supportsBinary=!1;b.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null);this.form&&(this.form.parentNode.removeChild(this.form),this.form=null);a.prototype.doClose.call(this)};b.prototype.doPoll=function(){var a=this,b=document.createElement("script");
this.script&&(this.script.parentNode.removeChild(this.script),this.script=null);b.async=!0;b.src=this.uri();b.onerror=function(c){a.onError("jsonp poll error",c)};var d=document.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d);this.script=b;c.ua.gecko&&setTimeout(function(){var a=document.createElement("iframe");document.body.appendChild(a);document.body.removeChild(a)},100)};b.prototype.doWrite=function(a,c){function b(){d();c()}function d(){if(e.iframe)try{e.form.removeChild(e.iframe)}catch(a){e.onError("jsonp polling iframe removal error",
a)}try{t=document.createElement('<iframe src="javascript:0" name="'+e.iframeId+'">')}catch(c){t=document.createElement("iframe"),t.name=e.iframeId,t.src="javascript:0"}t.id=e.iframeId;e.form.appendChild(t);e.iframe=t}var e=this;if(!this.form){var k=document.createElement("form"),m=document.createElement("textarea"),g=this.iframeId="eio_iframe_"+this.index,t;k.className="socketio";k.style.position="absolute";k.style.top="-1000px";k.style.left="-1000px";k.target=g;k.method="POST";k.setAttribute("accept-charset",
"utf-8");m.name="d";k.appendChild(m);document.body.appendChild(k);this.form=k;this.area=m}this.form.action=this.uri();d();this.area.value=a.replace(f,"\\n");try{this.form.submit()}catch(w){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"==e.iframe.readyState&&b()}:this.iframe.onload=b}}).call(this,"undefined"!==typeof self?self:"undefined"!==typeof window?window:{})},{"../util":12,"./polling":10}],9:[function(e,h,g){(function(d){function b(){}function a(a){g.call(this,
a);if(d.location){var c="https:"==location.protocol,b=location.port;b||(b=c?443:80);this.xd=a.hostname!=d.location.hostname||b!=a.port}}function c(a){this.method=a.method||"GET";this.uri=a.uri;this.xd=!!a.xd;this.async=!1!==a.async;this.data=void 0!=a.data?a.data:null;this.agent=a.agent;this.create(a.isBinary,a.supportsBinary)}function f(){for(var a in c.requests)c.requests.hasOwnProperty(a)&&c.requests[a].abort()}var k=e("xmlhttprequest"),g=e("./polling"),p=e("../util"),q=e("../emitter"),r=e("debug")("engine.io-client:polling-xhr");
h.exports=a;h.exports.Request=c;var n=d.document&&d.document.attachEvent;p.inherits(a,g);a.prototype.supportsBinary=!0;a.prototype.request=function(a){a=a||{};a.uri=this.uri();a.xd=this.xd;a.agent=this.agent||!1;a.supportsBinary=this.supportsBinary;return new c(a)};a.prototype.doWrite=function(a,c){var b=this.request({method:"POST",data:a,isBinary:"string"!==typeof a&&void 0!==a}),d=this;b.on("success",c);b.on("error",function(a){d.onError("xhr post error",a)});this.sendXhr=b};a.prototype.doPoll=
function(){r("xhr poll");var a=this.request(),c=this;a.on("data",function(a){c.onData(a)});a.on("error",function(a){c.onError("xhr poll error",a)});this.pollXhr=a};q(c.prototype);c.prototype.create=function(a,b){var d=this.xhr=new k({agent:this.agent,xdomain:this.xd}),f=this;try{r("xhr open %s: %s",this.method,this.uri);d.open(this.method,this.uri,this.async);b&&(d.responseType="arraybuffer");if("POST"==this.method)try{a?d.setRequestHeader("Content-type","application/octet-stream"):d.setRequestHeader("Content-type",
"text/plain;charset=UTF-8")}catch(e){}"withCredentials"in d&&(d.withCredentials=!0);d.onreadystatechange=function(){var a;try{if(4!=d.readyState)return;200==d.status||1223==d.status?a="application/octet-stream"===d.getResponseHeader("Content-Type")?d.response:b?"ok":d.responseText:setTimeout(function(){f.onError(d.status)},0)}catch(c){f.onError(c)}if(null!=a)f.onData(a)};r("xhr data %s",this.data);d.send(this.data)}catch(g){setTimeout(function(){f.onError(g)},0);return}n&&(this.index=c.requestsCount++,
c.requests[this.index]=this)};c.prototype.onSuccess=function(){this.emit("success");this.cleanup()};c.prototype.onData=function(a){this.emit("data",a);this.onSuccess()};c.prototype.onError=function(a){this.emit("error",a);this.cleanup()};c.prototype.cleanup=function(){if("undefined"!=typeof this.xhr){this.xhr.onreadystatechange=b;try{this.xhr.abort()}catch(a){}n&&delete c.requests[this.index];this.xhr=null}};c.prototype.abort=function(){this.cleanup()};n&&(c.requestsCount=0,c.requests={},d.attachEvent("onunload",
f))}).call(this,"undefined"!==typeof self?self:"undefined"!==typeof window?window:{})},{"../emitter":2,"../util":12,"./polling":10,debug:15,xmlhttprequest:13}],10:[function(e,h,g){(function(d){function b(c){var b=c&&c.forceBase64;if(!g||b)this.supportsBinary=!1;a.call(this,c)}var a=e("../transport"),c=e("../util"),f=e("engine.io-parser"),k=e("debug")("engine.io-client:polling");h.exports=b;var g=function(){return null!=(new (e("xmlhttprequest"))({agent:this.agent,xdomain:!1})).responseType}();c.inherits(b,
a);b.prototype.name="polling";b.prototype.doOpen=function(){this.poll()};b.prototype.pause=function(a){function c(){k("paused");b.readyState="paused";a()}var b=this;this.readyState="pausing";if(this.polling||!this.writable){var d=0;this.polling&&(k("we are currently polling - waiting to pause"),d++,this.once("pollComplete",function(){k("pre-pause polling complete");--d||c()}));this.writable||(k("we are currently writing - waiting to pause"),d++,this.once("drain",function(){k("pre-pause writing complete");
--d||c()}))}else c()};b.prototype.poll=function(){k("polling");this.polling=!0;this.doPoll();this.emit("poll")};b.prototype.onData=function(a){var c=this;k("polling got data %s",a);f.decodePayload(a,this.socket.binaryType,function(a,b,d){if("opening"==c.readyState)c.onOpen();if("close"==a.type)return c.onClose(),!1;c.onPacket(a)});"closed"!=this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"==this.readyState?this.poll():k('ignoring poll - transport state "%s"',this.readyState))};b.prototype.doClose=
function(){function a(){k("writing close packet");c.write([{type:"close"}])}var c=this;"open"==this.readyState?(k("transport open - closing"),a()):(k("transport not open - deferring close"),this.once("open",a))};b.prototype.write=function(a){var c=this;this.writable=!1;var b=function(){c.writable=!0;c.emit("drain")},c=this;f.encodePayload(a,this.supportsBinary,function(a){c.doWrite(a,b)})};b.prototype.uri=function(){var a=this.query||{},b=this.secure?"https":"http",f="";("ActiveXObject"in d||c.ua.chromeframe||
c.ua.android||c.ua.ios6||this.timestampRequests)&&!1!==this.timestampRequests&&(a[this.timestampParam]=+new Date);this.supportsBinary||a.sid||(a.b64=1);a=c.qs(a);this.port&&("https"==b&&443!=this.port||"http"==b&&80!=this.port)&&(f=":"+this.port);a.length&&(a="?"+a);return b+"://"+this.hostname+f+this.path+a}}).call(this,"undefined"!==typeof self?self:"undefined"!==typeof window?window:{})},{"../transport":5,"../util":12,debug:15,"engine.io-parser":17,xmlhttprequest:13}],11:[function(e,h,g){function d(a){a&&
a.forceBase64&&(this.supportsBinary=!1);b.call(this,a)}var b=e("../transport"),a=e("engine.io-parser"),c=e("../util");e("debug")("engine.io-client:websocket");var f=e("ws");h.exports=d;c.inherits(d,b);d.prototype.name="websocket";d.prototype.supportsBinary=!0;d.prototype.doOpen=function(){if(this.check()){var a=this.uri();this.ws=new f(a,void 0,{agent:this.agent});void 0===this.ws.binaryType&&(this.supportsBinary=!1);this.ws.binaryType="arraybuffer";this.addEventListeners()}};d.prototype.addEventListeners=
function(){var a=this;this.ws.onopen=function(){a.onOpen()};this.ws.onclose=function(){a.onClose()};this.ws.onmessage=function(c){a.onData(c.data)};this.ws.onerror=function(c){a.onError("websocket error",c)}};"undefined"!=typeof navigator&&/iPad|iPhone|iPod/i.test(navigator.userAgent)&&(d.prototype.onData=function(a){var c=this;setTimeout(function(){b.prototype.onData.call(c,a)},0)});d.prototype.write=function(c){var b=this;this.writable=!1;for(var d=0,f=c.length;d<f;d++)a.encodePacket(c[d],this.supportsBinary,
function(a){b.ws.send(a)});setTimeout(function(){b.writable=!0;b.emit("drain")},0)};d.prototype.onClose=function(){b.prototype.onClose.call(this)};d.prototype.doClose=function(){"undefined"!==typeof this.ws&&this.ws.close()};d.prototype.uri=function(){var a=this.query||{},b=this.secure?"wss":"ws",d="";this.port&&("wss"==b&&443!=this.port||"ws"==b&&80!=this.port)&&(d=":"+this.port);this.timestampRequests&&(a[this.timestampParam]=+new Date);this.supportsBinary||(a.b64=1);a=c.qs(a);a.length&&(a="?"+
a);return b+"://"+this.hostname+d+this.path+a};d.prototype.check=function(){return!!f&&!("__initialize"in f&&this.name===d.prototype.name)}},{"../transport":5,"../util":12,debug:15,"engine.io-parser":17,ws:27}],12:[function(e,h,g){(function(d){var b=!1;g.inherits=function(a,c){function b(){}b.prototype=c.prototype;a.prototype=new b};g.keys=Object.keys||function(a){var c=[],b=Object.prototype.hasOwnProperty,d;for(d in a)b.call(a,d)&&c.push(d);return c};g.on=function(a,c,b,d){a.attachEvent?a.attachEvent("on"+
c,b):a.addEventListener&&a.addEventListener(c,b,d)};g.load=function(a){if(d.document&&"complete"===document.readyState||b)return a();g.on(d,"load",a,!1)};"undefined"!=typeof window&&g.load(function(){b=!0});g.ua={};g.ua.webkit="undefined"!=typeof navigator&&/webkit/i.test(navigator.userAgent);g.ua.gecko="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);g.ua.android="undefined"!=typeof navigator&&/android/i.test(navigator.userAgent);g.ua.ios="undefined"!=typeof navigator&&/^(iPad|iPhone|iPod)$/.test(navigator.platform);
g.ua.ios6=g.ua.ios&&/OS 6_/.test(navigator.userAgent);g.ua.chromeframe=Boolean(d.externalHost);g.qs=function(a){var c="",b;for(b in a)a.hasOwnProperty(b)&&(c.length&&(c+="&"),c+=encodeURIComponent(b)+"="+encodeURIComponent(a[b]));return c};g.qsParse=function(a){var c={};a=a.split("&");for(var b=0,d=a.length;b<d;b++){var e=a[b].split("=");c[decodeURIComponent(e[0])]=decodeURIComponent(e[1])}return c}}).call(this,"undefined"!==typeof self?self:"undefined"!==typeof window?window:{})},{}],13:[function(e,
h,g){var d=e("has-cors");h.exports=function(b){b=b.xdomain;try{if("undefined"!=typeof XMLHttpRequest&&(!b||d))return new XMLHttpRequest}catch(a){}if(!b)try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(c){}}},{"has-cors":23}],14:[function(e,h,g){(function(d){function b(b,c){c=c||{};for(var d=new a,f=0;f<b.length;f++)d.append(b[f]);return c.type?d.getBlob(c.type):d.getBlob()}var a=d.BlobBuilder||d.WebKitBlobBuilder||d.MSBlobBuilder||d.MozBlobBuilder,c;try{c=2==(new Blob(["hi"])).size}catch(f){c=
!1}var e=a&&a.prototype.append&&a.prototype.getBlob;d=c?d.Blob:e?b:void 0;h.exports=d}).call(this,"undefined"!==typeof self?self:"undefined"!==typeof window?window:{})},{}],15:[function(e,h,g){function d(a){return d.enabled(a)?function(c){c instanceof Error&&(c=c.stack||c.message);var b=new Date,e=b-(d[a]||b);d[a]=b;c=a+" "+c+" +"+d.humanize(e);window.console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}:function(){}}h.exports=d;d.names=[];d.skips=[];d.enable=function(a){try{localStorage.debug=
a}catch(b){}for(var f=(a||"").split(/[\s,]+/),e=f.length,g=0;g<e;g++)a=f[g].replace("*",".*?"),"-"===a[0]?d.skips.push(RegExp("^"+a.substr(1)+"$")):d.names.push(RegExp("^"+a+"$"))};d.disable=function(){d.enable("")};d.humanize=function(a){return 36E5<=a?(a/36E5).toFixed(1)+"h":6E4<=a?(a/6E4).toFixed(1)+"m":1E3<=a?(a/1E3|0)+"s":a+"ms"};d.enabled=function(a){for(var b=0,f=d.skips.length;b<f;b++)if(d.skips[b].test(a))return!1;b=0;for(f=d.names.length;b<f;b++)if(d.names[b].test(a))return!0;return!1};
try{window.localStorage&&d.enable(localStorage.debug)}catch(b){}},{}],16:[function(e,h,g){function d(a){if(a){for(var b in d.prototype)a[b]=d.prototype[b];return a}}var b=e("indexof");h.exports=d;d.prototype.on=function(a,b){this._callbacks=this._callbacks||{};(this._callbacks[a]=this._callbacks[a]||[]).push(b);return this};d.prototype.once=function(a,b){function d(){e.off(a,d);b.apply(this,arguments)}var e=this;this._callbacks=this._callbacks||{};b._off=d;this.on(a,d);return this};d.prototype.off=
d.prototype.removeListener=d.prototype.removeAllListeners=function(a,c){this._callbacks=this._callbacks||{};if(0==arguments.length)return this._callbacks={},this;var d=this._callbacks[a];if(!d)return this;if(1==arguments.length)return delete this._callbacks[a],this;var e=b(d,c._off||c);~e&&d.splice(e,1);return this};d.prototype.emit=function(a){this._callbacks=this._callbacks||{};var b=[].slice.call(arguments,1),d=this._callbacks[a];if(d)for(var d=d.slice(0),e=0,g=d.length;e<g;++e)d[e].apply(this,
b);return this};d.prototype.listeners=function(a){this._callbacks=this._callbacks||{};return this._callbacks[a]||[]};d.prototype.hasListeners=function(a){return!!this.listeners(a).length}},{indexof:24}],17:[function(e,h,g){(function(d){function b(a,b,c){if(!b)return g.encodeBase64Packet(a,c);var d=new FileReader;d.onload=function(){a.data=d.result;g.encodePacket(a,b,c)};return d.readAsArrayBuffer(a.data)}function a(a,b,c){var d=Array(a.length);c=h(a.length,c);for(var e=function(a,c,e){b(c,function(b,
c){d[a]=c;e(b,d)})},f=0;f<a.length;f++)e(f,a[f],c)}var c=e("./keys"),f=e("arraybuffer.slice"),k=e("base64-arraybuffer"),h=e("after"),p=navigator.userAgent.match(/Android/i);g.protocol=2;var q=g.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},r=c(q),n={type:"error",data:"parser error"},l=e("blob");g.encodePacket=function(a,c,e){"function"==typeof c&&(e=c,c=!1);var f=void 0===a.data?void 0:a.data.buffer||a.data;if(d.ArrayBuffer&&f instanceof ArrayBuffer){if(c){f=a.data;c=new Uint8Array(f);
f=new Uint8Array(1+f.byteLength);f[0]=q[a.type];for(a=0;a<c.length;a++)f[a+1]=c[a];a=e(f.buffer)}else a=g.encodeBase64Packet(a,e);return a}if(l&&f instanceof d.Blob)return c?p?a=b(a,c,e):(c=new Uint8Array(1),c[0]=q[a.type],a=new l([c.buffer,a.data]),a=e(a)):a=g.encodeBase64Packet(a,e),a;c=q[a.type];void 0!==a.data&&(c+=String(a.data));return e(""+c)};g.encodeBase64Packet=function(a,b){var c="b"+g.packets[a.type];if(l&&a.data instanceof l){var e=new FileReader;e.onload=function(){var a=e.result.split(",")[1];
b(c+a)};return e.readAsDataURL(a.data)}var f;try{f=String.fromCharCode.apply(null,new Uint8Array(a.data))}catch(k){f=new Uint8Array(a.data);for(var h=Array(f.length),u=0;u<f.length;u++)h[u]=f[u];f=String.fromCharCode.apply(null,h)}c+=d.btoa(f);return b(c)};g.decodePacket=function(a,b){if("string"==typeof a||void 0===a){if("b"==a.charAt(0))return g.decodeBase64Packet(a.substr(1),b);var c=a.charAt(0);return Number(c)==c&&r[c]?1<a.length?{type:r[c],data:a.substring(1)}:{type:r[c]}:n}var c=(new Uint8Array(a))[0],
d=f(a,1);l&&"blob"===b&&(d=new l([d]));return{type:r[c],data:d}};g.decodeBase64Packet=function(a,b){var c=r[a.charAt(0)];if(!d.ArrayBuffer)return{type:c,data:{base64:!0,data:a.substr(1)}};var e=k.decode(a.substr(1));"blob"===b&&l&&(e=new l([e]));return{type:c,data:e}};g.encodePayload=function(b,c,d){"function"==typeof c&&(d=c,c=null);if(c)return l&&!p?g.encodePayloadAsBlob(b,d):g.encodePayloadAsArrayBuffer(b,d);if(!b.length)return d("0:");a(b,function(a,b){g.encodePacket(a,c,function(a){b(null,a.length+
":"+a)})},function(a,b){return d(b.join(""))})};g.decodePayload=function(a,b,c){if("string"!=typeof a)return g.decodePayloadAsBinary(a,b,c);"function"===typeof b&&(c=b,b=null);var d;if(""==a)return c(n,0,1);d="";for(var e,f,k=0,h=a.length;k<h;k++)if(f=a.charAt(k),":"!=f)d+=f;else{if(""==d||d!=(e=Number(d)))return c(n,0,1);f=a.substr(k+1,e);if(d!=f.length)return c(n,0,1);if(f.length){d=g.decodePacket(f,b);if(n.type==d.type&&n.data==d.data)return c(n,0,1);if(!1===c(d,k+e,h))return}k+=e;d=""}if(""!=
d)return c(n,0,1)};g.encodePayloadAsArrayBuffer=function(b,c){if(!b.length)return c(new ArrayBuffer(0));a(b,function(a,b){g.encodePacket(a,!0,function(a){return b(null,a)})},function(a,b){var d=b.reduce(function(a,b){var c;c="string"===typeof b?b.length:b.byteLength;return a+c.toString().length+c+2},0),e=new Uint8Array(d),f=0;b.forEach(function(a){var b="string"===typeof a,c=a;if(b){for(var c=new Uint8Array(a.length),d=0;d<a.length;d++)c[d]=a.charCodeAt(d);c=c.buffer}b?e[f++]=0:e[f++]=1;a=c.byteLength.toString();
for(d=0;d<a.length;d++)e[f++]=parseInt(a[d]);e[f++]=255;c=new Uint8Array(c);for(d=0;d<c.length;d++)e[f++]=c[d]});return c(e.buffer)})};g.encodePayloadAsBlob=function(b,c){a(b,function(a,b){g.encodePacket(a,!0,function(a){var c=new Uint8Array(1);c[0]=1;if("string"===typeof a){for(var d=new Uint8Array(a.length),e=0;e<a.length;e++)d[e]=a.charCodeAt(e);a=d.buffer;c[0]=0}for(var d=(a instanceof ArrayBuffer?a.byteLength:a.size).toString(),f=new Uint8Array(d.length+1),e=0;e<d.length;e++)f[e]=parseInt(d[e]);
f[d.length]=255;l&&(a=new l([c.buffer,f.buffer,a]),b(null,a))})},function(a,b){return c(new l(b))})};g.decodePayloadAsBinary=function(a,b,c){"function"===typeof b&&(c=b,b=null);for(var d=[];0<a.byteLength;){for(var e=new Uint8Array(a),k=0===e[0],h="",l=1;255!=e[l];l++)h+=e[l];a=f(a,2+h.length);h=parseInt(h);l=f(a,0,h);if(k)try{l=String.fromCharCode.apply(null,new Uint8Array(l))}catch(p){k=new Uint8Array(l);e=Array(k.length);for(l=0;l<k.length;l++)e[l]=k[l];l=String.fromCharCode.apply(null,e)}d.push(l);
a=f(a,h)}var n=d.length;d.forEach(function(a,d){c(g.decodePacket(a,b),d,n)})}}).call(this,"undefined"!==typeof self?self:"undefined"!==typeof window?window:{})},{"./keys":18,after:19,"arraybuffer.slice":20,"base64-arraybuffer":21,blob:14}],18:[function(e,h,g){h.exports=Object.keys||function(d){var b=[],a=Object.prototype.hasOwnProperty,c;for(c in d)a.call(d,c)&&b.push(c);return b}},{}],19:[function(e,h,g){function d(){}h.exports=function(b,a,c){function e(b,d){if(0>=e.count)throw Error("after called too many times");
--e.count;b?(g=!0,a(b),a=c):0!==e.count||g||a(null,d)}var g=!1;c=c||d;e.count=b;return 0===b?a():e}},{}],20:[function(e,h,g){h.exports=function(d,b,a){var c=d.byteLength;b=b||0;a=a||c;if(d.slice)return d.slice(b,a);0>b&&(b+=c);0>a&&(a+=c);a>c&&(a=c);if(b>=c||b>=a||0===c)return new ArrayBuffer(0);d=new Uint8Array(d);for(var c=new Uint8Array(a-b),e=0;b<a;b++,e++)c[e]=d[b];return c.buffer}},{}],21:[function(e,h,g){(function(d){g.encode=function(b){b=new Uint8Array(b);var a,c=b.buffer.byteLength,e="";
for(a=0;a<c;a+=3)e+=d[b.buffer[a]>>2],e+=d[(b.buffer[a]&3)<<4|b.buffer[a+1]>>4],e+=d[(b.buffer[a+1]&15)<<2|b.buffer[a+2]>>6],e+=d[b.buffer[a+2]&63];2===c%3?e=e.substring(0,e.length-1)+"=":1===c%3&&(e=e.substring(0,e.length-2)+"==");return e};g.decode=function(b){var a=0.75*b.length,c=b.length,e=0,g,h,p,q;"="===b[b.length-1]&&(a--,"="===b[b.length-2]&&a--);for(var r=new ArrayBuffer(a),n=new Uint8Array(r),a=0;a<c;a+=4)g=d.indexOf(b[a]),h=d.indexOf(b[a+1]),p=d.indexOf(b[a+2]),q=d.indexOf(b[a+3]),n[e++]=
g<<2|h>>4,n[e++]=(h&15)<<4|p>>2,n[e++]=(p&3)<<6|q&63;return r}})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")},{}],22:[function(e,h,g){h.exports=function(){return this}()},{}],23:[function(e,h,g){e=e("global");try{h.exports="XMLHttpRequest"in e&&"withCredentials"in new e.XMLHttpRequest}catch(d){h.exports=!1}},{global:22}],24:[function(e,h,g){var d=[].indexOf;h.exports=function(b,a){if(d)return b.indexOf(a);for(var c=0;c<b.length;++c)if(b[c]===a)return c;return-1}},{}],25:[function(e,
h,g){(function(d){var b=/^[\],:{}\s]*$/,a=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,c=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,e=/(?:^|:|,)(?:\s*\[)+/g,g=/^\s+/,s=/\s+$/;h.exports=function(h){if("string"!=typeof h||!h)return null;h=h.replace(g,"").replace(s,"");if(d.JSON&&JSON.parse)return JSON.parse(h);if(b.test(h.replace(a,"@").replace(c,"]").replace(e,"")))return(new Function("return "+h))()}}).call(this,"undefined"!==typeof self?self:"undefined"!==typeof window?window:{})},
{}],26:[function(e,h,g){var d=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,b="source protocol authority userInfo user password host port relative path directory file query anchor".split(" ");h.exports=function(a){a=d.exec(a||"");for(var c={},e=14;e--;)c[b[e]]=a[e]||"";return c}},{}],27:[function(e,h,g){function d(a,
c,d){return c?new b(a,c):new b(a)}e=function(){return this}();var b=e.WebSocket||e.MozWebSocket;h.exports=b?d:null;b&&(d.prototype=b.prototype)},{}]},{},[1])(1)});