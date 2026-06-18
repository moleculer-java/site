## Types of event broadcasts

Molculer `ServiceBroker` has a built-in event bus for sending events to local and remote services.
Events can be used to create event-driven, runtime scalable applications from services
deployed on different operating systems and implemented in different languages.

Events can be grouped; events can be sent to
- to all `Listeners` (unconditional "broadcast")
- to a group of `Listeners` ("broadcast" with "groups" parameter)
- to one member from all groups (unconditional "emit")
- or to one member from the specified groups ("emit" with "groups" parameter)

## Emit balanced events

The event `Listeners` are arranged to logical groups.
It means that only one listener is triggered in every group.

**Example**

An application contains 2 main services: "users" & "payments".
Both subscribe to the "user.created" event.
3 instances of "users" service and 2 instances of "payments" service run.
If the "user.created" event is emitted, only one "users" and one "payments" service will receive this event.

<div align="center">
    <img src="balanced-events.gif" alt="Balanced events diagram" />
</div>

The group name comes from the `Service` name, but it can be overwritten in event definition in services
(by the "@Group" Annotation).

**Example**

```java{7,8}
import services.moleculer.eventbus.*;
import services.moleculer.service.*;

@Name("payment")
public class PaymentService extends Service {

    @Subscribe("order.created")
    @Group("other")
    Listener orderCreated = ctx -> {
        logger.info("Payload: {}", ctx.params);
        logger.info("Sender: {}", ctx.nodeID);
        logger.info("Metadata: {}", ctx.params.getMeta());
        logger.info("The called event name: {}", ctx.name);

        // Example of parsing the "params" block:
        String firstName = ctx.params.get("firstName", "defaultValue");
        String lastName  = ctx.params.get("lastName").asString();
    };

}
```

Balanced events can be sent using "broker.emit" function.
The first parameter is the name of the event, the second parameter is the payload. 
To send multiple/hierarchical values, wrap them into a
[Tree](https://berkesa.github.io/datatree/introduction.html) object:

```java{12}
// The payload is a "Tree" object (~=JSON structure)
// that will be serialized for transport:
// {
//   "firstName": "John",
//   "lastName": "Doe"
// }
Tree user = new Tree();
user.put("firstName", "John");
user.put("lastName", "Doe");

// Emit event
broker.emit("user.created", user);
```

Specify which groups/services shall receive the event:

```java
// Only the "mail" & "payments" services receive this event
broker.emit("user.created", user, Groups.of("mail", "payments"));
```

### Simplified syntax for sending key-value pairs

If the data structure to be sent consists only of key-value pairs,
it is not necessary to create a `Tree` object.
It is enough to list the key-value pairs after the event name
(the same syntax can be used for the "ctx.broadcast" and "broker.broadcast" methods):

```java{2,3}
ctx.emit("user.created",
         "firstName", "John",
         "lastName", "Doe",
         Groups.of("mail", "payments"));
```

Creating a [Tree](https://berkesa.github.io/datatree/introduction.html)
object is required when passing more complex data structures between nodes,
which contain sub-structures (~=hierarchical JSON objects and JSON arrays).

### Streaming binary files

In addition to JSON structures, it is possible to send large files
and/or media content (videos, audio).

```java
// Opening stream
PacketStream stream = broker.createStream();
broker.emit("service.listener", stream);

// Sending file...
stream.transferFrom(new File("source.bin")).then(rsp -> {
    // File submitted
}).catchError(err -> {
    // Unexpected error occurred
});
```

It is possible to send data immediately if we are not sending data from a file
(for example, transmitting a microphone signal).

```java
// Opening stream
PacketStream stream = broker.createStream();
broker.emit("service.listener", stream);

// Sending packets
stream.sendData("packet1".getBytes());
stream.sendData("packet2".getBytes());
stream.sendData("packet3".getBytes());

// Always close streams!
stream.sendClose();
```

## Broadcast event

The broadcast event is sent to all available local & remote `Services`.
It is not balanced, all event `Listener` instances receive this event.

<div align="center">
    <img src="broadcast-events.gif" alt="Broadcast events diagram" />
</div>

Send broadcast events with "broker.broadcast" method:

```java{16}
// The payload is a hierarchical (~=JSON) structure:
// {
//   "key": "value",
//   "anArray": [1, 2, 3],
//   "anObject": {
//     "port": 1234,
//     "host": "server1"
//   }
// }
Tree config = new Tree();
config.put("key", "value");
config.putList("anArray").add(1).add(2).add(3);
config.putMap("anObject").put("port", 1234).put("host", "server1");

// Send "config" to all listeners
broker.broadcast("config.changed", config);
```

Specify which groups/services shall receive the event:

```java
// Send to all "mail" service instances
broker.broadcast("user.created", user, Groups.of("mail"));

// Send to all "user" & "purchase" service instances.
broker.broadcast("user.created", user, Groups.of("user", "purchase"));

// Same thing, but with simplified syntax
ctx.broadcast("user.created",
              "firstName", "John",
              "lastName", "Doe",
              Groups.of("user", "purchase"));
```

## Local broadcast event

Send broadcast events only to all local `Services` with "broker.broadcastLocal" method:
```java
broker.broadcastLocal("config.changed", config);
```

## Subscribe to events

The contents of the events are wrapped in an object called event `Context` to receive the message.
The event `Context` is very similar to `Context` of `Actions`.

**Context-based event handler & emit a nested event**

```java{14}
@Name("accounts")
public class AccountService extends Service {

    @Subscribe("user.created")
    Listener userCreated = ctx -> {
        logger.info("Payload: {}", ctx.params);
        logger.info("Sender: {}", ctx.nodeID);
        logger.info("Metadata: {}", ctx.params.getMeta());
        logger.info("The called event name: {}", ctx.name);

        // Emit a new, nested Event
        Tree payload = new Tree();
        payload.copyFrom(ctx.params, "user");
        ctx.emit("accounts.created", payload);
    };

}
```

**Wildcards**

Wildcards (`?`, `*`, `**`) can be used when making event subscriptions.

```java
public class MyService extends Service {

    // Subscribe to "user.created" event
    @Subscribe("user.created")
    Listener userCreated = ctx -> {
        logger.info("User created event received: {}", ctx.params);
    };

    // Subscribe to all "user" events
    @Subscribe("user.*")
    Listener userEvents = ctx -> {
        logger.info("User event received: {}", ctx.params);
    };
        
    // Subscribe to all internal events
    // (internal event names start with "$" prefix)
    @Subscribe("$**")
    Listener internalEvents = ctx -> {
        logger.info("Event " + ctx.name + " received:", ctx.params);
    };
        
}
```

**Private (local or hidden) Event Listeners**

With the "private" modifier, only the local events are monitored by the event `Listener`.
Such event `Listeners` are invisible from the outside of the node,
and cannot be called from other `ServiceBrokers`.

```java
@Subscribe("$services.changed")
private Listener listener = ctx -> {
    logger.info("The list of services has changed!");
};
```

**Redirecting streamed content**

Stream data can be redirected to a `File`, `ByteChannel` or `OutputStream`.

```java
ctx.stream.transferTo(new File("/temp.bin")).then(rsp -> {
    // File received and saved successfully
}).catchError(err -> {
    // Unexpected error occurred
});
```

**Processing streamed content**

Stream data can also be processed per packet.

```java
ctx.stream.onPacket((bytes, error, closed) -> {
    if (bytes != null) {
        // A byte-array has received
    } else if (error != null) {
        // Error occurred
    }
    if (closed) {
        // Incoming stream closed (EOF)
    }
});
```

## Context

When you emit an event, the `ServiceBroker` creates a `Context` instance which contains all
request information and passes it to the event handler as a single argument.

**Available properties & methods of `Context`**

| Name | Type |  Description |
| ------- | ----- | ------- |
| ctx.id | String | Unique Context ID. |
| ctx.name | String | Name of the event. |
| ctx.params | Tree | Request params. Contains meta-data (ctx.params.getMeta()). |
| ctx.level | int | Request level (in nested-calls). The first level is 1. |
| ctx.nodeID | String | The caller or target Node ID. |
| ctx.parentID | String | Parent context ID (in nested-calls). |
| ctx.requestID | String | Request ID (does not change during the call chain). |
| ctx.stream | PacketStream | Streamed content (large files or real-time media). |
| ctx.opts | Options | Calling options. |
| ctx.call() | Method | Make nested-calls. Same arguments like in broker.call |
| ctx.emit() | Method | Emit an event, same as broker.emit |
| ctx.broadcast() | Method | Broadcast an event, same as broker.broadcast |

## Internal events

The `ServiceBroker` broadcasts some internal events.
Internal events always starts with "$" prefix.

### $services.changed

The `ServiceBroker` sends this event if the local node or a remote node loads or destroys services.

**Payload**

| Name | Type | Description |
| ---- | ---- | ----------- |
| localService | boolean | True if a local service changed. |

### $node.connected

The `ServiceBroker` sends this event when a node connected or reconnected.

**Payload**

| Name | Type | Description |
| ---- | ---- | ----------- |
| node | Tree | Node info object |
| reconnected | boolean | Is reconnected? |

### $node.updated

The `ServiceBroker` sends this event when it has received an INFO message from a node
(ie. a `Service` is loaded or destroyed).

**Payload**

| Name | Type | Description |
| ---- | ---- | ----------- |
| node | Tree | Node info object |

### $node.disconnected

The `ServiceBroker` sends this event when a node disconnected (gracefully or unexpectedly).

**Payload**

| Name | Type | Description |
| ---- | ---- | ----------- |
| node | Tree | Node info object |
| unexpected | boolean | "true" - Not received heartbeat, "false" - Received "DISCONNECT" message from node. |

### $broker.started

The `ServiceBroker` sends this event once "broker.start()" is called and all local `Services` are started.

### $broker.stopped

The `ServiceBroker` sends this event once "broker.stop()" is called and all local `Services` are stopped.

### $transporter.connected

The `Transporter` sends this event once the `Transporter` is connected.

### $transporter.disconnected

The `Transporter` sends this event once the `Transporter` is disconnected.