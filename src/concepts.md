## Asynchronous programming concepts

There are basically two kinds of processing; synchronous and asynchronous.
Synchronous processing blocks the current Thread until processing is complete.
Asynchronous processing doesn't block the current Thread,
instead of waiting, Thread will work on other tasks in the mean time.
Asynchronous applications are more difficult to design,
but they can handle thousands of parallel requests,
while synchronous applications are limited by the maximum number of Threads that can be run.
There are many different forms and implementations of asynchronous processing in Java, such as:

- [Quasar](https://github.com/puniverse/quasar): Quasar uses non-blocking [Lightweight Threads](https://docs.paralleluniverse.co/quasar/) called "Fibers"
- [Reactor](https://projectreactor.io/): Reactor uses [Reactive Streams](https://github.com/reactive-streams/reactive-streams-jvm) for building reactive applications
- [Vert.x](https://vertx.io/): The core Vert.x components use [Callbacks](https://en.wikipedia.org/wiki/Callback_(computer_programming))
and there are modules for [RxJava](https://github.com/ReactiveX/RxJava) and Quasar

To summarize the essence of "Moleculer for Java" in a similar way, we could describe this:

- [Moleculer](https://moleculer-java.github.io/moleculer-java/): Moleculer uses [Promises](https://berkesa.github.io/datatree/promise-introduction.html)
and manages sequential flow controls through "*then().then().then()*"
[chaining](concepts.html#non-blocking-json-processing) of Promises

## JavaScript and Java parallels

Java and Node.js-based Moleculer have the **same internal architecture** as possible for these two languages.
Most internal objects and properties have the same names in both implementations.
After a relatively short period of time, Java programmers understand the code of a Node.js-based Moleculer service and vice versa.
This help to increase the skills of the programmers and make their collaboration more efficient.

Most Moleculer modules do not require any specific explanation, they are quite similar in use in the two programming languages
(such modules include
[Cachers](caching.html#caching-action-calls),
[Transporters](transporters.html#types-of-transporters),
[Serializers](serializers.html#about-data-serialization)
and other high-level "building blocks").
However, a low-level "building block", the dynamic *JavaScript object*,
cannot be easily implemented in a statically-typed language.
The next chapter is about how to effectively handle the JavaScript/JSON data structures in Moleculer Java,
and how to organize asynchronous "JSON functions" into a workflow.

## DataTree API for JavaScript objects

The `Services` send packets of structured hierarchical data to each other during communication.
Because the `Services` can be remotely hosted,
services send and receive JSON data during their communication.
In the Node.js-based Moleculer implementation, the
transferable data corresponds to JavaScript objects.
A JavaScript object is a collection of named values, eg.:

```js
// JavaScript code
var params = {param1: "value1",
              param2: "value2",
              param3: 12345678,
              param3: true};
```

There is no similar native support for dynamic creation of JSON objects in Java language.
Because of this, Moleculer uses an
[abstract API](https://berkesa.github.io/datatree/introduction.html)
instead of a certain JSON implementation.
The `io.datatree.Tree` object is an **abstract layer** that uses an arbitrary JSON implementation.
`Tree` API supports 18 popular
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

In addition, the `Tree` API provides some useful features:

- JSON path functions (`tree.get("cities[2].location")`)
- Easy iteration over Java Collections and Maps (`for (Tree child: parent)`)
- Recursive deep cloning (`Tree copy = tree.clone()`)
- Support for all Java types of Appache Cassandra (`BigDecimal`, `UUID`, `InetAddress`, etc.)
- Support for all Java types of MongoDB (`BsonNumber`, `BsonNull`, `BsonString`, `BsonBoolean`, etc.)
- Root and parent pointers, methods to traverse the data structure (`tree.getParent()` or `tree.getRoot()`)
- Methods for type-check (`Class valueClass = tree.getType()`)
- Methods for modify the type of the underlying Java value (`tree.setType(String.class)`)
- Method chaining (`tree.put("name1", "value1").put("name2", "value2")`)
- Merging, filtering structures (`tree.copyFrom(source)`, `tree.find(condition)`, etc.)

In summary, Node.js-based Moleculer `Services` sends and receives JavaScript objects.
The equivalent is the `Tree` object in the Java-based Moleculer.

## Avoid reflection

The Reflection API is a powerful feature of the Java language.
With the API, the Java program can create an object or call a method on the fly.
From execution prospective, the calls to reflection API are quite expensive,
it could have a performance impact on the applications.
Because of this, Moleculer uses the reflection API in very few cases. For example
[Actions](actions.html#about-actions) and event [Listeners](events.html#types-of-event-broadcasts)
are not methods but Functional Interfaces.
Calling them is much faster than calling methods using the Reflection API.

```java
// Actions and Listeners are Functional Interfaces
Action action = ctx -> { ... };
Listener listener = ctx -> { ... };
```

## No object mapping

For the sake of simplicity, and similarity to Node.js version, Moleculer does not use *Java Object Mappers*.
The data is received, processed and returned in "raw" JSON format.
Object Mapper's are useful when starting the system,
and we process configuration files using the Spring Framework, for example.
However, it is faster at runtime if the incoming data packet is received immediately
after parsing it from the binary (JSON, MessagePack, etc.) format.
The [Tree](https://berkesa.github.io/datatree/introduction.html)
data type helps in accurate type conversion, even allowing you to specify default values.

```java
// Input and output data are in "raw" JSON format
Action action = ctx -> {

    // Process input:
    // {
    //     "key1": "abc",
    //     "key2": 12345
    // }
    String value1 = ctx.params.get("key1", "default");
    double value2 = ctx.params.get("key2", 0d);

    // Generate output:
    // {
    //     "result": "ok"
    // }
    Tree out = new Tree();
    out.put("result", "ok");
    return out;
};
```

The input for `Action` and event `Listener` is always a
[Context](actions.html#context)
(which has metadata besides input JSON, such as who sent the message).
The returned value cannot be a POJO (Plain Old Java Object with getter/setter methods),
such values must be converted to a `Tree` object.
The output can be one of the following:

- *null*
- String
- *Numbers:* byte, short, int, long, float, double, `BigDecimal`, `BigInteger`
- boolean
- byte array
- `java.util.Date`
- `java.util.UUID`
- `java.net.InetAddress`
- `Tree` object (hierarchical data structure from the above types)
- `Promise` object (it's like an asynchronous `Tree`)
- `PacketStream` object (for transferring large, binary files)

## Non-blocking JSON processing

Moleculer uses ES6-like
[Promises](https://berkesa.github.io/datatree/promise-introduction.html)
(based on the Java8's `CompletableFuture` API) to avoid
[callback hell](https://www.google.com/search?q=callback+hell+promise).
An `io.datatree.Promise` is an object that may produce a simple value (or a `Tree` object) some time in the future:
either a resolved value, or a reason that it's not resolved (e.g., a network error occurred).
`Promise` users can attach callbacks to handle the fulfilled `Tree` or the reason for rejection.

The main difference between Promise-based operation of other systems and Moleculer
is that the Moleculer `Promise` object works with "raw" JSON objects.
The value of a Moleculer `Promise`, which you get after the asynchronous processing,
is always a `Tree` object.
This `Tree` structure may come from other `Services` or from asynchronous APIs.

```java
// Sequential "waterfall" processing of Promises
Action anAction = ctx -> {

    // Invoke the firs async method; this method returns a Promise,
    // the "next" is called when the Promise value is assigned
    return callAsyncMethod1(ctx)
      .then(rsp -> { // Response of previous call (in a "Tree" object)

        // Process response and call next async method
        return callAsyncMethod2(rsp);

    }).then(rsp -> { // Response of previous call

        // Process response and call next async method
        return callAsyncMethod3(rsp);

    }).catchError(err -> { // Throwable of previous calls

        // Handle error and call next async method
        return callAsyncMethod4(err);

    }).then(rsp -> { // Response of previous call

        // Process response and call last async method
        return callAsyncMethod5(rsp);
    });
}
```

[Read more about Promises](performance-tips.html#use-non-blocking-apis)
or continue to the
[next](broker.html#introduction-to-service-broker) chapter.