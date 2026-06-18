# WebSocket handling

> Part of the [Web API Gateway](moleculer-web.html). It works the same on all Jakarta EE servers
> (servlet containers) and on Netty (standalone mode).

WebSocket is a HTTP-based protocol, providing realtime communication between the server and browser.
The Moleculer API Gateway WebSocket implementation **works the same** on all Jakarta EE servers (Servlet containers) and Netty (in "standalone" run mode).
The WebSocket communication implemented by Moleculer is **not duplex**,
it can only send a message from the server to the browser (or other WebSocket client API).
Reverse (client-to-server) communication is possible **with REST** requests.
Both ways of communication can pass through HTTP firewalls.

You can send WebSocket messages from anywhere in the application using Moleculer events.
It is mandatory to insert a "path" and a "data" block in the event.
The "path" is the URL to which the WebSocket client is connected,
and "data" is the data block sent to the client.
The "data" block may contain any structure.
For example, the following structure is sent to clients that are connected to the URL "http://host:port/ws/chat":

```json{2}
{
    "path": "ws/chat",
    "data": {
        "type": "command1",
        "sample": "foo"
    }
}
```

The above WebSocket message can be sent by broadcasting it as a "websocket.send" event:

```java{4}
Tree packet = new Tree();
packet.put("path", "ws/chat");
packet.putMap("data").put("type", "command").put("sample", "foo");
broker.broadcast("websocket.send", packet);
```

The "websocket.send" event is monitored by the API Gateway and, when such an event occurs,
it forwards its content to the appropriate WebSocket clients.
In the case of a browser, the WebSocket client is
[this JavaScript module](https://github.com/moleculer-java/moleculer-spring-boot-demo/blob/master/src/main/resources/www/js/websocket.js)
.

The HTML page must include the WebSocket API ("websocket.js")
and the "app.js" application that processes incoming messages:

```html
<html>
	<head>	
		<script src="websocket.js"></script>
		<script src="app.js"></script>
	</head>
	<body>
		<div id="outDiv">WebSocket Sample</div>
	</body>
</html>
```

The structure of "app.js" that processes messages is similar to the following:

```js{6,10}
// Netty or Jakarta EE WebSocket connection
var ws;

// Handle connect
window.addEventListener("load", function(event) {
	ws = MoleculerWebsocket("ws/chat", function(msg) {
		
		// Message received from server;
		var data = JSON.parse(msg);
		if (data.type === "command") {
			var outDiv = document.getElementById("outDiv");
            outDiv.innerHTML = data.sample;
		}
		
	}, {
				
		// Set the WebSocket connection parameters
		heartbeatInterval: 60 * 1000,
		heartbeatTimeout:  10 * 1000,
		debug: true
		
	});
	ws.connect();
});

// Handle disconnect
window.addEventListener("unload", function(event) {
	if (ws) {
		ws.disconnect();
		ws = null;
	}
});
```

The first parameter of "MoleculerWebsocket" is the URL that WebSocket will connected to ("ws/chat").
The use of the "type" parameter is optional,
but can facilitate the processing of messages.
For each type of data packet,
we place different "type" parameter on the server side (eg. "command1", "command2", "command3").
And in the browser, we can decide what to do by the value of the "type".

The
[HTTP Client API](http-client.html#receiving-websocket-messages)
allows a Java Program to connect to the server via WebSocket.
As with browser communication, this connection works over an HTTP firewall.
