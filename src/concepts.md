## Core Moleculer concepts

Moleculer's central communication module is the `ServiceBroker`.
The `ServiceBroker` supports the following communication patterns:

- Publish / subscribe for broadcasting messages
- Request-response messaging

`ServiceBroker` registers the `Services`,
which are essentially clustered services (available over the network).
Local or remote `Services` can be accessed in the same way.
The `Services` send dynamically generated structured data to each other, mostly in JSON format.
The resulting data is processed in a non-blocking, asynchronous manner.

## Universal data type

The `Services` send packets of structured hierarchical data to each other during communication.
Data packets are mostly in JSON format, but other data interchange formats can be set.
Because the `Services` can be locally or remotely hosted,
services also send and receive JSON data during their internal communication.
In the Node.js-based Moleculer implementation,
JSON data corresponds to a JavaScript Object inside the `Services`.
A JavaScript Object is a collection of named values, eg.:

```js
// JavaScript code
var params = {param1: "value1",
              param2: "value2",
              param3: 12345678,
              param3: true};
```

There is no similar native support for dynamic creation of JSON objects in Java language.
Because of this, Moleculer uses an
[abstract API](https://berkesa.github.io/datatree/)
instead of a certain JSON implementation.
The `Tree` object is an **abstract layer** that uses an arbitrary JSON implementation.
Tree API supports 18 popular
[JSON implementations](serializers.html#json-serializer) (eg. Jackson, Gson, Boon, Jodd, FastJson),
and 10 non-JSON data formats (YAML, ION, BSON, MessagePack, etc.).
Java-based JSON (and non-JSON) APIs are constantly evolving,
so no specific implementation is forced on developers.
The following Java code snippet builds similar JSON structure like the previous JavaScript code:

```java
// Java code
Tree params = new Tree();
params.put("param1", "value1");
params.put("param2", "value2");
params.put("param3", 12345678);
params.put("param4", true);
```

The following Java statement...
```java
System.out.println(params);
```
... will print this:
```json
{
  "param1" : "value1",
  "param2" : "value2",
  "param3" : 12345678,
  "param4" : true
}
```

In addition, the Tree API provides some useful features:

- JSON path functions (`tree.get("cities[2].location")`)
- Easy iteration over Java Collections and Maps (`for (Tree child: parent)`)
- Recursive deep cloning (`Tree copy = tree.clone()`)
- Support for all Java types of Appache Cassandra (`BigDecimal`, `UUID`, `InetAddress`, etc.)
- Support for all Java types of MongoDB (`BsonNumber`, `BsonNull`, `BsonString`, `BsonBoolean`, etc.)
- Root and parent pointers, methods to traverse the data structure
- Methods for type-check (`Class valueClass = tree.getType()`)
- Methods for modify the type of the underlying Java value (`tree.setType(String.class)`)
- Method chaining (`tree.put("name1", "value1").put("name2", "value2")`)
- Merging, filtering structures (`tree.copyFrom(source)`, `tree.find(condition)`, etc.)

In summary, Node.js-based Moleculer `Services` sends and receives JavaScript Objects.
The equivalent is the `Tree` Object in the Java-based Moleculer.

## Avoid Reflection

The Reflection API is a powerful feature of the Java language.
With the API, the Java program can create an object or call a method on the fly.
From execution prospective, the calls to reflection API are quite expensive,
it could have a performance impact on the applications.
Because of this, Moleculer uses the reflection API in very few cases.
`Actions` and `Event` listeners are not methods but `Functional Interfaces`.
Calling them is much faster than calling methods using the Reflection API.

```java
// Actions and Listeners are Functional Interfaces
Action action = ctx -> { ... };
Listener listener = ctx -> { ... };
```

## No Object Mapping

For similar performance reasons, Moleculer `Services` do not use Java Object Mappers.
The data is received, processed and returned in "raw" JSON format.
Object Mapper's are useful when starting the system,
and we process configuration files using the Spring Framework, for example.
However, it is faster at runtime if the incoming data packet is received immediately
after parsing it from the binary (JSON, MessagePack, etc.) format.

```java
// Input and output data are in "raw" JSON format
Action action = ctx -> {

    // Process input
    String value1 = ctx.params.get("key1", "default");
    double value2 = ctx.params.get("key2", 0d);

    // Generate output
    Tree out = new Tree();
    out.put("result", "ok");
    return out;
};
```

The input for Action and Event Listener is always a
[Context](actions.html#context)
(which has metadata besides input JSON, such as who sent the message).
The returned value cannot be a POJO (Plain Old Java Object),
such values must be converted to a `Tree` object.
The output can be one of the following:

- *null*
- String
- *Numbers:* byte, short, int, long, float, double, BigDecimal, BigInteger
- boolean
- byte array
- java.util.Date
- java.util.UUID
- java.net.InetAddress
- `Tree` object (hierarchical data structure from the above types)
- `Promise` object (it's like an asynchronous `Tree`)
- `PacketStream` object (when transferring large, binary files)

## Non-blocking JSON processing

Moleculer uses ES6-like
[Promises](https://berkesa.github.io/datatree-promise/)
(based on the Java8's CompletableFuture API) to avoid
[callback hell](https://www.google.com/search?q=callback+hell+promise).
A Promise is an object that may produce a simple value (or a `Tree` object) some time in the future:
either a resolved value, or a reason that it's not resolved (e.g., a network error occurred).
Promise users can attach callbacks to handle the fulfilled `Tree` or the reason for rejection.

The main difference between Promise-based operation of other systems and Moleculer
is that the Moleculer Promise object works with "raw" JSON objects.
The value of a Moleculer Promise, which you get after the asynchronous processing,
is always a `Tree` object.
This `Tree` structure may come from other Services (including, for example, Node.js-based Services)
or from asynchronous APIs (such as REST client or MongoDB APIs).

```java
// Sequential "waterfall" processing of Promises
Action createNewUser = ctx -> {

    // Validate user name
    return httpClient.get("http://acl/check").then(rsp -> {

        // Save new user
        return userDAO.createNewUser(rsp);

    }).then(rsp -> {

        // Log info
        String id = rsp.get("_id", "");
        logger.info("New user record: " + rsp);

    }).then(rsp -> {

        // Find email address
        return ctx.call("email.findByID", rsp);

    }).then(rsp -> {

        // Send email to user
        return ctx.call("email.sendVerification", rsp);

    });
}
```