# Call Java from Node.js

**You are a Node.js Moleculer developer.** You want to add some Java functionality to your system — a
Spring Boot service, a JVM library you can only reach from Java, a CPU-heavy job — and call it from your
existing JavaScript code, without replacing your architecture.

You do not rewrite anything. You start a Java node, point it at the same message bus (see
[Setup](interop-setup.html)), and call its actions exactly like any other Moleculer service. This page is
the Node.js developer's view; the reverse direction is [Call Node.js from Java](call-node-from-java.html).

## 1. See the Java node join the cluster

Once the Java node is up, it appears in the built-in `$node` introspection service like any other node.
From your Node.js code:

```js
// $node.list returns every node in the cluster (local + remote).
const nodes = await broker.call("$node.list");
const java = nodes.find(n => n.id === "java-node");

console.log(java.available);    // true
console.log(java.client.type);  // "java"  — the remote is a moleculer-java node

// $node.services aggregates the services advertised by every node.
const services = await broker.call("$node.services");
const names = services.map(s => s.name);
console.log(names.includes("mathJava")); // true — the Java service is visible
```

No registration step is needed on your side: discovery is automatic over the transporter.

## 2. Call a Java action

Say the Java side exposes a `mathJava` service. From Node.js you call `mathJava.add` and `mathJava.greet`
just like a local action — the framework handles discovery, routing, serialization and deserialization
across the language boundary.

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
// Your Node.js code calling the Java actions
const sum = await broker.call("mathJava.add", { a: 2, b: 3 });
broker.logger.info(sum); // 5

const greeting = await broker.call("mathJava.greet", { name: "Ada" });
broker.logger.info(greeting); // "Hello Ada from Java!"
```
:::

::: tab Java
```java
// The Java service you are calling
@Name("mathJava")
public class MathJavaService extends Service {

    public Action add = ctx ->
            ctx.params.get("a", 0) + ctx.params.get("b", 0);

    public Action greet = ctx ->
            "Hello " + ctx.params.get("name", "world") + " from Java!";
}
```
:::

::::

The request body you pass as the second argument becomes `ctx.params` on the Java side (an
`io.datatree.Tree`), and whatever the Java action returns comes back to you as a plain JavaScript value.

## 3. Send an event to Java

Java services can subscribe to your events. Broadcast (or `emit`) an event from Node.js and a Java
listener receives the payload:

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
// Fire-and-forget event to every listener on every node.
await broker.broadcast("demo.fromNode", { from: "node", n: 7 });
```
:::

::: tab Java
```java
// A Java listener for the event you sent
@Subscribe("demo.fromNode")
public Listener onFromNode = ctx -> {
    // ctx.params is the event payload: { from: "node", n: 7 }
    String from = ctx.params.get("from", "unknown"); // "node"
    int    n    = ctx.params.get("n", 0);            // 7
};
```
:::

::::

The difference between `emit` (load-balanced to one listener per group) and `broadcast` (delivered to
every listener) works across languages too — see the
[Events section](interop-data-types.html#events) of the data-types reference.

## 4. Errors and timeouts

If a Java action throws, the failure crosses back as a rejected promise, so a normal `try/catch` handles
it. Add a per-call timeout through the call options:

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
try {
    const sum = await broker.call("mathJava.add", { a: 2, b: 3 }, { timeout: 5000 });
} catch (err) {
    broker.logger.error("call to Java failed:", err.message);
}
```
:::

::: tab Java
```java
// The same call from a Java caller (CallOptions is services.moleculer.context.CallOptions)
try {
    Tree params = new Tree();
    params.put("a", 2);
    params.put("b", 3);
    // CallOptions.timeout(ms) is the Java equivalent of { timeout: 5000 }
    int sum = broker.call("mathJava.add", params, CallOptions.timeout(5000))
                    .waitFor(5000).asInteger();
} catch (Exception err) {
    logger.error("call to Java failed: " + err.getMessage());
}
```
:::

::::

You can also pin a call to a specific node with `{ nodeID: "java-node" }` (in Java,
`CallOptions.nodeID("java-node")`, chainable with `.timeout(5000)`) when more than one node offers the
same service.

## Next

- **[Data types & features](interop-data-types.html)** — pass lists, nested objects, cached values,
  metadata and binary streams to and from Java.
- **[Call Node.js from Java](call-node-from-java.html)** — the same story from the Java side.

> Every snippet here is trimmed from a runnable, test-verified integration demo where a Node.js node and
> a Java node prove these calls and events in both directions.
