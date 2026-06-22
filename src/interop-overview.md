# Java ↔ Node.js Interoperability

Moleculer is **polyglot**. The original [Node.js framework](https://moleculer.services/) and the
Java implementation ([moleculer-java](https://github.com/moleculer-java/moleculer-java)) speak the
**same wire protocol** and use the **same JSON serialization**, so a Java node and a Node.js node can
join **one cluster** and call each other's services as if they were local.

This documentation puts that interoperability first. If you already run Moleculer in Node.js, or you
are adding microservices in Java, start here — the rest of the site (the Java core, clustering and the
optional Java modules) is reference material you can reach for later.

## The two doors

There are two ways to arrive at hybrid Java + Node.js Moleculer, and a page for each:

- **[Call Java from Node.js →](call-java-from-node.html)** — you are a **Node.js Moleculer developer**
  and want to add Java functionality (say, a Spring Boot service) to your existing system, then call it
  from your JavaScript code.
- **[Call Node.js from Java →](call-node-from-java.html)** — you are a **Java developer** and want to
  reuse or reach existing **Node.js Moleculer** actions and events from your Java application.

Either way the mechanics are the same: both processes connect to one message bus, discover each other,
and exchange requests, events and streams across the language boundary.

## One mental model: `service.action`

The whole model fits in one sentence: **an action is addressed as `<serviceName>.<actionName>`,
regardless of which language implements it.** Calling a remote action looks idiomatic in each language,
but it resolves to the same thing on the wire:

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
// Node calls a Java-hosted action — service.action addressing
const sum = await broker.call("mathJava.add", { a: 15, b: 25 }); // -> 40
```
:::

::: tab Java
```java
// Java calls a Node.js-hosted action — the same service.action addressing
Tree params = new Tree();
params.put("a", 15);
params.put("b", 25);

int sum = broker.call("mathNode.add", params).waitFor(5000).asInteger(); // -> 40
```
:::

::::

> **About the Java tab:** `broker.call(...)` returns a `Promise`. `.waitFor(5000)` **blocks** the
> current thread for up to 5 s until it resolves — the blocking form of JavaScript `await`. The
> resolved value is a `Tree`, so `.asInteger()` reads the number out of it. The non-blocking form is
> `broker.call(...).then(rsp -> rsp.asInteger())`; see [Call Node.js from Java](call-node-from-java.html).

There is no gateway, no REST hop and no schema compiler in between — the broker discovers the remote
service and routes the call over the shared transporter.

## What makes it work

Three things must line up between the two nodes. They are covered in
**[Setup — one cluster](interop-setup.html)**:

1. **A shared transporter** — both nodes connect to the same message bus (the demos use **NATS** at
   `nats://localhost:4222`).
2. **The same serializer** — **JSON** is the default on both frameworks and the common denominator that
   makes them wire-compatible.
3. **The same protocol version** — Moleculer JS 0.15 speaks protocol **v5**; moleculer-java 2.0.0
   defaults to **v5** too, so they match out of the box (configurable back to v4 for a legacy 0.14 node).

## Data across the boundary

Java is statically typed and Node.js is dynamic, so the two sides need a shared, JSON-shaped data model.
On the Java side that is the **`io.datatree.Tree`** API — the equivalent of a JavaScript object. The
[Moleculer concepts](concepts.html#javascript-and-java-parallels) chapter explains the parallels, and
[the DataTree API](concepts.html#datatree-api-for-javascript-objects) section shows how `Tree` mirrors a
JavaScript object.

Stick to **JSON-safe** values (objects/maps, arrays/lists, numbers, strings, booleans and `null`) and
everything round-trips intact. **[Data types & features](interop-data-types.html)** is the full
reference of what crosses the wire — primitives, nested objects, events, caching, metadata and binary
streams — with verified examples in both languages.

## Where to go next

- **[Setup — one cluster](interop-setup.html)** — wire both nodes to the same bus.
- **[Quick start](quickstart.html)** — a five-minute, runnable hello between a Java and a Node.js node.
- **[Call Java from Node.js](call-java-from-node.html)** / **[Call Node.js from Java](call-node-from-java.html)** — the two doors in detail.
- **[Data types & features](interop-data-types.html)** — the compatibility reference.

> All code on these interop pages is taken from a runnable, test-verified
> [integration demo](https://github.com/moleculer-java/moleculer-integration-demo) where a Spring Boot
> Java node and a Moleculer 0.15 Node.js node prove each scenario passes in both directions. Clone it,
> start NATS, run the Java side and the Node side, and watch the checks pass.
