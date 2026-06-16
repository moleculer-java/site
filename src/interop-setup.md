# Setup — one cluster

A Java node and a Node.js node join the **same Moleculer cluster** when four things line up:

1. **The same transporter** — both connect to one message bus. These examples use **NATS** at
   `nats://localhost:4222`.
2. **The same serializer** — **JSON** on both sides (the default), the common denominator that makes the
   two frameworks wire-compatible.
3. **The same protocol version** — Moleculer JS 0.15 speaks **v5**; moleculer-java 2.0.0 defaults to
   **v5**, so they match out of the box.
4. **A unique `nodeID` per process** — every node in the cluster needs its own id; colliding ids break
   discovery.

Get those right and discovery, routing, request/response, events and streaming all work across the
language boundary with no gateway in between.

## 1. Add the dependency

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```json
// package.json
{
  "dependencies": {
    "moleculer": "^0.15.0",
    "nats": "^2"
  }
}
```
:::

::: tab Java
```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.github.berkesa</groupId>
    <artifactId>moleculer-java</artifactId>
    <version>2.0.0</version>
</dependency>

<!-- The NATS transporter is OPTIONAL inside moleculer-java,
     so the jnats client must be declared explicitly. -->
<dependency>
    <groupId>io.nats</groupId>
    <artifactId>jnats</artifactId>
    <version>2.21.1</version>
</dependency>
```
:::

::::

## 2. Configure the broker

The same four knobs, expressed in each language. On the Java side the **service class is identical**
whether you run under Spring or not — only how you create and start the broker differs (see
[Runner](runner.html) for more ways to start a Java node). Both Java tabs below register this one service:

```java
// MathJavaService.java — registered unchanged by both Java setups below.
// Actions are INSTANCE fields (lambdas), discovered by reflection — never static.
@Name("mathJava")
public class MathJavaService extends Service {

    public Action add = ctx ->
            ctx.params.get("a", 0) + ctx.params.get("b", 0);
}
```

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
// moleculer.config.js
module.exports = {
    nodeID: "node-node",                  // unique in the cluster (differs from "java-node")
    transporter: "nats://localhost:4222", // the shared NATS bus
    serializer: "JSON"                    // the common denominator
    // Moleculer JS 0.15 speaks wire protocol v5; the Java side is aligned to v5.
};

// index.js — start the broker from that config
const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker(require("./moleculer.config.js"));
broker.createService(require("./services/math-node.service.js"));
broker.start();
```
:::

::: tab "Java — Spring Boot"
```java
// A Spring @Bean — Spring calls broker.start() for you via initMethod.
@Configuration
public class BrokerConfig {

    @Bean(initMethod = "start", destroyMethod = "stop")
    public ServiceBroker serviceBroker() {
        ServiceBrokerConfig cfg = new ServiceBrokerConfig();
        cfg.setNodeID("java-node");        // unique in the cluster (differs from "node-node")
        cfg.setProtocolVersion("5");       // match Moleculer JS 0.15 (v5)

        NatsTransporter nats = new NatsTransporter("nats://localhost:4222");
        nats.setSerializer(new JsonSerializer()); // JSON is the default; set explicitly for clarity
        cfg.setTransporter(nats);

        ServiceBroker broker = new ServiceBroker(cfg);
        broker.createService(new MathJavaService()); // register your services before start
        return broker;                     // Spring calls broker.start() via initMethod
    }
}
```
:::

::: tab "Java — standalone"
```java
// No Spring: build, register and start the broker yourself in a main() method.
public static void main(String[] args) throws Exception {
    ServiceBrokerConfig cfg = new ServiceBrokerConfig();
    cfg.setNodeID("java-node");
    cfg.setProtocolVersion("5");

    NatsTransporter nats = new NatsTransporter("nats://localhost:4222");
    nats.setSerializer(new JsonSerializer());
    cfg.setTransporter(nats);

    ServiceBroker broker = new ServiceBroker(cfg);
    broker.createService(new MathJavaService()); // same class as the Spring setup
    broker.start();
}
```
:::

::::

## 3. Start a NATS server

Both nodes assume a NATS server is reachable at `nats://localhost:4222`. Start one however you prefer —
for example with Docker:

```bash
docker run -p 4222:4222 nats
```

Then bring up both nodes (order does not matter — each side can wait for the other's services before it
calls). For more transporter options (Redis, MQTT, Kafka, AMQP, JMS, TCP) and their cross-language
compatibility, see [Transporters](transporters.html#types-of-transporters); for serializer options see
[Serializers](serializers.html#about-data-serialization).

## The alignment rules at a glance

| Knob | Node.js | Java | Why |
|---|---|---|---|
| Transporter | `transporter: "nats://localhost:4222"` | `new NatsTransporter("nats://localhost:4222")` | Both nodes must share one bus. |
| Serializer | `serializer: "JSON"` | `nats.setSerializer(new JsonSerializer())` | JSON is the wire-compatible default on both. |
| Protocol | v5 (Moleculer 0.15, default) | `cfg.setProtocolVersion("5")` (default) | A node silently drops packets with a different version. |
| `nodeID` | `nodeID: "node-node"` | `cfg.setNodeID("java-node")` | Must be unique; colliding ids break discovery. |

> Talking to a legacy **Moleculer JS 0.14** node? Set the Java side to `cfg.setProtocolVersion("4")` —
> v4 and v5 are wire-compatible for the JSON serializer.

Next: try it end to end in the **[Quick start](quickstart.html)**.
