# A minimal Java service for Node.js developers

You have a running Node.js Moleculer system and you want to add **one** action in Java — nothing
more. This page is that path end to end: a single class, one action, a NATS transporter, started from
a plain `main()`. **No Spring, no Netty, no Jakarta EE, no WAR.** When you later want the web gateway
or Spring, those are add-ons — they do not change the service you write here.

> **The service class is identical with or without Spring** — only how you *create and start the
> broker* differs. Everything in the [Core reference](services.html) applies to this service as-is.

## 1. Add the dependencies (Maven)

```xml
<!-- pom.xml -->
<dependencies>

    <!-- Moleculer core -->
    <dependency>
        <groupId>com.github.berkesa</groupId>
        <artifactId>moleculer-java</artifactId>
        <version>2.0.0</version>
    </dependency>

    <!-- NATS transporter client (optional inside moleculer-java, so declare it) -->
    <dependency>
        <groupId>io.nats</groupId>
        <artifactId>jnats</artifactId>
        <version>2.21.1</version>
    </dependency>

    <!-- An SLF4J binding so logs go somewhere (see the Logging page) -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-jdk14</artifactId>
        <version>2.0.18</version>
    </dependency>

</dependencies>
```

## 2. Write the service

One class, one action. The action is a **`public` instance field** (a lambda) — that is how the
broker discovers it, and `public` is what publishes it to the cluster so your Node.js node can call it.

```java
import io.datatree.Tree;
import services.moleculer.service.Name;
import services.moleculer.service.Service;
import services.moleculer.service.Action;

@Name("mathJava")
public class MathJavaService extends Service {

    public Action add = ctx ->
            ctx.params.get("a", 0) + ctx.params.get("b", 0);
}
```

That `ctx.params` is a [`Tree`](tree.html) — the Java stand-in for a JavaScript object.

## 3. Start a broker and register it

A plain `main()` builds the broker, points it at the shared NATS bus, registers the service and
starts. This is the whole Java process.

```java
import io.datatree.Tree;
import services.moleculer.ServiceBroker;
import services.moleculer.config.ServiceBrokerConfig;
import services.moleculer.transporter.NatsTransporter;
import services.moleculer.serializer.JsonSerializer;

public class Main {
    public static void main(String[] args) throws Exception {

        ServiceBrokerConfig cfg = new ServiceBrokerConfig();
        cfg.setNodeID("java-node");          // unique in the cluster
        cfg.setProtocolVersion("5");         // matches Moleculer JS 0.15 (the default)

        NatsTransporter nats = new NatsTransporter("nats://localhost:4222");
        nats.setSerializer(new JsonSerializer());   // JSON is the default; set explicitly for clarity
        cfg.setTransporter(nats);

        ServiceBroker broker = new ServiceBroker(cfg);
        broker.createService(new MathJavaService());  // register BEFORE start
        broker.start();
    }
}
```

That is the complete standalone node — no application server, no framework. (Need a NATS server?
`docker run -p 4222:4222 nats`.)

## 4. Call it from Node.js

From your existing Node.js system, `mathJava.add` is just another action — call it as if it were
local:

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
// your existing Node.js node, on the same NATS bus
await broker.waitForServices(["mathJava"], 10000);

const sum = await broker.call("mathJava.add", { a: 2, b: 3 });
broker.logger.info("mathJava.add =>", sum); // -> 5
```
:::

::: tab "Java (the other direction)"
```java
// the blocking form, if a Java node calls it
int sum = broker.call("mathJava.add", "a", 2, "b", 3).waitFor(5000).asInteger(); // -> 5
```
:::

::::

For the cluster-alignment details (transporter, serializer, protocol version, unique `nodeID`) see
**[Setup — one cluster](interop-setup.html)**; for a runnable hello in both directions see the
**[Quick start](quickstart.html)**.

## Where to go next in the core reference

Everything below builds on the exact service above — the class never changes:

- **[Services](services.html)** — names, versions, lifecycle handlers, multiple actions.
- **[Actions](actions.html)** — call options, metadata, validation, streaming, REST aliases.
- **[Events](events.html)** — subscribe to and emit events across the cluster.
- **[Caching](caching.html)**, **[Fault tolerance](fault-tolerance.html)**, **[Load balancing](balancing.html)** — the cluster-side building blocks.
- Want HTTP/REST in front of it? Add the **[Web API Gateway](moleculer-web.html)**. Want Spring DI?
  See **[Running under Spring](spring.html)** — same service class, different startup.
