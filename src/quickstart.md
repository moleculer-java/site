# Quick start

This is the five-minute version: two nodes — one Java, one Node.js — each exposing a tiny `add` action,
calling each other across the language boundary.

You need a **message broker** running (the examples use **NATS** at `nats://localhost:4222`) and both projects wired up as shown in
**[Setup — one cluster](interop-setup.html)** (the dependency and the broker configuration). Then follow
the three steps below.

## 1. Define a service on each side

A Moleculer service is a named bag of actions. In Java a service extends `Service` and its actions are
public `Action` fields (lambdas); in Node.js it is a plain object with an `actions` map.

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
// services/math-node.service.js
module.exports = {
    name: "mathNode",
    actions: {
        // mathNode.add — adds two integers
        add(ctx) {
            return Number(ctx.params.a) + Number(ctx.params.b);
        }
    }
};
```
:::

::: tab Java
```java
// MathJavaService.java
@Name("mathJava")
public class MathJavaService extends Service {

    // mathJava.add — adds two integers
    public Action add = ctx -> ctx.params.get("a", 0) + ctx.params.get("b", 0);
}
```
:::

::::

The two services are named `mathNode` and `mathJava` — an action is addressed as
`<serviceName>.<actionName>`, so they expose `mathNode.add` and `mathJava.add` to the whole cluster.

## 2. Start both nodes

Each side creates a broker (configured as in [Setup](interop-setup.html)), registers its service and
starts. Start them in either order — they find each other over the message bus.

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
const { ServiceBroker } = require("moleculer");
const config = require("./moleculer.config.js");

const broker = new ServiceBroker(config);
broker.createService(require("./services/math-node.service.js"));
broker.start();
```
:::

::: tab Java
```java
// Spring Boot starts the @Bean broker for you (see Setup); or, standalone:
broker.createService(new MathJavaService());
broker.start();
```
:::

::::

## 3. Call across the boundary

Before the first call, wait for the remote service to be discovered, then call it. The call is identical
whether the target is local or on the other language's node.

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
// Node.js -> Java
await broker.waitForServices(["mathJava"], 10000);

const sum = await broker.call("mathJava.add", { a: 2, b: 3 });
broker.logger.info("mathJava.add =>", sum); // -> 5
```
:::

::: tab Java
```java
// Java -> Node.js
broker.waitForServices(10000, "mathNode").waitFor(12000);

Tree params = new Tree();
params.put("a", 2);
params.put("b", 3);
int sum = broker.call("mathNode.add", params).waitFor(10000).asInteger();
System.out.println("mathNode.add => " + sum); // -> 5
```
:::

::::

That is the whole loop: a Node.js process called a Java action and a Java process called a Node.js
action, over one cluster, with no REST layer or shared database between them.

## Where to go next

- **[Call Java from Node.js](call-java-from-node.html)** — the Node-developer's view: discover and call
  Java services, send events.
- **[Call Node.js from Java](call-node-from-java.html)** — the Java-developer's view: call Node.js
  actions, inspect and ping the remote node.
- **[Data types & features](interop-data-types.html)** — pass lists, nested objects, events, cached
  values, metadata and binary streams across the boundary.

> The `add` services and the calls above are taken verbatim (trimmed) from a runnable, test-verified
> integration demo — so they compile and run as shown.
