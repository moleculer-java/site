## About the Async HTTP Client

The "moleculer-java-httpclient" is an asynchronous HTTP client API,
specially designed for Java-based Moleculer Ecosystem.
The client is suitable for handling large numbers of REST requests,
and it can receive WebSocket messages from a Netty/Jakarta-EE-based Moleculer application.
The built-in Heartbeat function automatically checks if a connection has been lost.
If a connection is lost, the client automatically rebuilds the connection.


## Download

**Maven**

```xml
<dependencies>
	<dependency>
		<groupId>com.github.berkesa</groupId>
		<artifactId>moleculer-java-httpclient</artifactId>
		<version>2.0.0</version>
	</dependency>
</dependencies>
```

## Examples

### Blocking usage

Blocking is not recommended, but you can use the "waitFor" method to wait for the server response if necessary.
The [Tree](https://berkesa.github.io/datatree/introduction.html) object is practically a JSON structure.
Its contents can be retrieved using "get" function calls, as in a "Map" object.

```java
Tree rsp = client.get("http://host/rest").waitFor();
```

### Invoking a REST service

In the example below, we call a REST service that provides a JSON response to a JSON request.

```java
// Create HTTP client (connection pool and timeout handler)
HttpClient client = new HttpClient();
client.start();

// Build JSON request
Tree req = new Tree();
req.put("key1", "value1");
req.put("key2", 123);
req.put("key3", true);

client.post("http://host/path", req).then(rsp -> {

    // Success (process JSON response)
    String value4 = rsp.get("key4", "defaultValue");

}).catchError(err -> {

    // Failed
    err.printStackTrace();

});
```

### Invoking with custom parameters

```java
client.get("http://host/rest", params -> {
	
    // Set parameters of the request
    params.addHeader("HttpHeader", "value");
    params.setCharset(StandardCharsets.ISO_8859_1);
			
}).then(rsp -> {

    // Parsing response ("rsp" is a "Tree" object)
    System.out.println(rsp.get("key", "defaultValue"));
			
});
```

### Receiving WebSocket messages

In the following case, the client connects to the server immediately.
The heartbeat timer checks the connection every minute.

```java
client.ws("http://localhost:3000/ws/jmx", payload -> {

    // Message received!
    System.out.println("RECEIVED: " + payload);
    
});
```

### WebSocket connection events

In the example below, you can create your own event listeners
for the WebSocket connection and also specify connection parameters.

```java
WebSocketConnection ws =
    client.ws("http://localhost:3000/ws/jmx", new WebSocketHandler() {

    public void onOpen(WebSocket webSocket) {

        // WebSocket connection opened
    }

    public void onMessage(Tree payload) {

        // Receiving message
        System.out.println("RECEIVED:\r\n" + payload);				
    }

    public void onError(Throwable t) {

        // Error occured
    }

    public void onClose(WebSocket webSocket, int code, String reason) {

        // WebSocket connection closed
    }
			
}, params -> {
			
    // Set connection parameters
    params.setHeader("HttpHeaderName", "value");
    params.setHeartbeatInterval(120); // 2 mins
			
}, false);
		
// Connect to server
ws.connect();
		
// Close connection
ws.disconnect();
```

### Redirecting response

The 'transferTo' method is used to redirect the response to an OutputStream, WritableByteChannel or PacketStream.

```java
// Create OutputStream
FileOutputStream out = new FileOutputStream("/target.txt");

client.get("http://host/path", params -> {
			
    // Redirect response into OutputStream
    params.transferTo(out);
			
}).then(rsp -> {
			
    // Transfer finished
			
});
```

### Receiving "raw" response

As a result of the "returnAsByteArray" method, the client API will not attempt
to process the response as JSON, but will return it in raw byte-array format.

```java
client.get("http://host/path", params -> {
			
    // Do not parse the response
    params.returnAsByteArray();
			
}).then(rsp -> {
			
    // Get response body
    byte[] bytes = rsp.asBytes();
			
});
```

### Status code and headers

The "returnStatusCode" and "returnHttpHeaders" methods cause the client API to copy
the status code and http headers into the "meta" block of the response Tree.

```java
client.get("http://host/path", params -> {
			
    // Instructs the client to copy the values
    // into the "meta" block
    params.returnStatusCode();
    params.returnHttpHeaders();
			
}).then(rsp -> {
			
    // Get status code
    Tree meta = rsp.getMeta();
    int status = meta.get("$status", 0);
			
    // Get headers
    for (Tree header: meta.get("$headers")) {
        String headerName = header.getName();
        String headerValue = header.asString();
    }
			
});
```

### Upload a file

The "setBody" method is used to send files or Stream content to the server.

```java
// Source file to upload
File file = new File("/source.bin");
		
client.post("http://host/path", params -> {
			
    // Set body
    params.setBody(file);

}).then(rsp -> {
			
    // File uploaded
			
});
```

### Streaming with PacketStreams

PacketStreams provide low-level push-to-data delivery.
It allows you to redirect responses of other Moleculer Actions directly to the HTTP request stream
(or you can open an online media stream to the server for live microphone audio recording, etc.).

```java
// The "broker" is a Moleculer Service Broker
ServiceBroker broker = new ServiceBroker();
// ...
broker.start();

// Create PacketStream
PacketStream stream = broker.createStream();
		
// Start sending...
client.post("http://host/path", stream);
		
stream.sendData("packet1".getBytes());		
stream.sendData("packet2".getBytes());		
stream.sendData("packet3".getBytes());
		
stream.sendClose();
```