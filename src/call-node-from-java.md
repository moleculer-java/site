# Call Node.js from Java

**You are a Java developer.** Your organization already runs Moleculer services in Node.js, and you want
to reach them from your Java (Spring Boot) application — call their actions, read their health, ping
them — without porting anything to the JVM.

You connect your Java node to the same message bus (see [Setup](interop-setup.html)) and call the Node.js
actions with the broker's `Promise`-based API. This page is the Java developer's view; the reverse
direction is [Call Java from Node.js](call-java-from-node.html).

## 1. Call a Node.js action

A Node.js service `mathNode` exposes `add` and `greet`. From Java you build the params as an
`io.datatree.Tree` and call the action; `broker.call(...)` returns a `Promise` that resolves to a `Tree`.

:::: tabs :options="{ useUrlFragment: false }"

::: tab Java
```java
// Your Java code calling the Node.js actions
Tree params = new Tree();
params.put("a", 2);
params.put("b", 3);
int sum = broker.call("mathNode.add", params).waitFor(5000).asInteger();
System.out.println(sum); // 5

Tree greetParams = new Tree();
greetParams.put("name", "Ada");
String greeting = broker.call("mathNode.greet", greetParams).waitFor(5000).asString();
System.out.println(greeting); // "Hello Ada from Node!"
```
:::

::: tab "Node.js (JavaScript)"
```js
// The Node.js service you are calling
module.exports = {
    name: "mathNode",
    actions: {
        add(ctx) {
            return Number(ctx.params.a) + Number(ctx.params.b);
        },
        greet(ctx) {
            return `Hello ${ctx.params.name ?? "world"} from Node!`;
        }
    }
};
```
:::

::::

`waitFor(5000)` blocks until the response arrives (the argument is a millisecond timeout; handy in tests
and `main()` methods). In service code you
normally stay non-blocking and chain the `Promise` instead — the same `then()` / `catchError()` style you
use for any Moleculer call:

```java
broker.call("mathNode.add", params)
    .then(rsp -> {
        int result = rsp.asInteger(); // 5
        // ...continue the workflow
        return result;
    })
    .catchError(err -> {
        // the Node.js action threw, or the call timed out
        return handle(err);
    });
```

## 2. Inspect the remote Node.js node

The built-in `$node.health` action reports a node's runtime characteristics. Target the Node.js node
explicitly so you read *its* health, not your own:

:::: tabs :options="{ useUrlFragment: false }"

::: tab Java
```java
Tree health = broker.call("$node.health", new Tree(),
        CallOptions.nodeID("node-node").timeout(5000)).waitFor(5000);

String framework = health.get("client.type", "");                 // "nodejs"
String version   = health.get("client.version", "");
long   cores     = health.get("cpu.cores", 0L);
String osType    = health.get("os.type", "");
long   heapUsed  = health.get("process.memory.heapUsed", 0L);
```
:::

::: tab "Node.js (JavaScript)"
```js
// The same introspection, the other way around
const health = await broker.call("$node.health", {}, { nodeID: "java-node", timeout: 10000 });

health.client.type;                 // "java"
health.cpu.cores;
health.os.type;
health.process.memory.heapUsed;
```
:::

::::

`$node.list` and `$node.services` work the same way from Java — iterate the returned `Tree` to find the
remote node and the services it advertises.

## 3. Ping the remote node

`broker.ping` measures the round trip to a node and returns its timing:

:::: tabs :options="{ useUrlFragment: false }"

::: tab Java
```java
// ping(timeout, nodeID): allow up to 3000 ms for the remote node to answer.
Tree pong = broker.ping(3000, "node-node").waitFor(5000);
long arrived = pong.get("arrived", 0L); // remote timestamp; > 0 means the node answered
```
:::

::: tab "Node.js (JavaScript)"
```js
// Note the argument order: ping(nodeID, timeout) on the Node side.
const pong = await broker.ping("java-node", 10000);
// -> { nodeID: "java-node", elapsedTime, timeDiff }
```
:::

::::

> **Tip.** A few APIs are idiomatic to each language rather than identical — `broker.ping` takes its
> arguments in the opposite order, Java returns a `Tree` where Node returns a plain object, and metadata
> is reached differently on each side. Keep each call in its own language's natural form; do not try to
> make them look identical.

## Next

- **[Data types & features](interop-data-types.html)** — receive lists, nested objects, cached values,
  metadata and binary streams from Node.js.
- **[Call Java from Node.js](call-java-from-node.html)** — the same story from the Node.js side.

> Every snippet here is trimmed from a runnable, test-verified integration demo where a Java node and a
> Node.js node prove these calls in both directions.
