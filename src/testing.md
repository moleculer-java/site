# Testing services

Testing a Moleculer service needs no special framework: build a `ServiceBroker`, register the service,
call it, and assert on the returned `Tree`. The one piece you can't guess is how to test **cluster**
behaviour (remote calls, events, serializers) without standing up NATS — that is what the in-memory
**`InternalTransporter`** is for. Use any test runner; the examples below use JUnit 5.

## A single-node unit test (no transporter)

With no transporter the broker is a single in-JVM node — perfect for testing one service's logic:

```java
import io.datatree.Tree;
import org.junit.jupiter.api.*;
import services.moleculer.ServiceBroker;
import static org.junit.jupiter.api.Assertions.assertEquals;

class MathServiceTest {

    ServiceBroker broker;

    @BeforeEach
    void setUp() throws Exception {
        broker = new ServiceBroker();             // single, local-only node
        broker.createService(new MathService());
        broker.start();
    }

    @AfterEach
    void tearDown() {
        broker.stop();
    }

    @Test
    void addsTwoNumbers() throws Exception {
        Tree rsp = broker.call("math.add", "a", 3, "b", 4).waitFor(5000);
        assertEquals(7, rsp.asInteger());
    }
}
```

## A multi-node test with `InternalTransporter`

`services.moleculer.transporter.InternalTransporter` connects **multiple brokers running in the same
JVM** through a shared in-memory bus, so you can test remote calls, events and serializers with no
external broker. Give each broker its **own** `new InternalTransporter()` and a unique `nodeID`:

```java
import io.datatree.Tree;
import org.junit.jupiter.api.Test;
import services.moleculer.ServiceBroker;
import services.moleculer.transporter.InternalTransporter;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ClusterTest {

    @Test
    void callIsRoutedToTheRemoteNode() throws Exception {
        ServiceBroker nodeA = ServiceBroker.builder()
                .nodeID("node-a").transporter(new InternalTransporter()).build();
        ServiceBroker nodeB = ServiceBroker.builder()
                .nodeID("node-b").transporter(new InternalTransporter()).build();

        nodeB.createService(new MathService());   // the service lives only on node-b
        nodeA.start();
        nodeB.start();
        try {
            nodeA.waitForServices("math").waitFor(5000);                    // wait for discovery
            Tree rsp = nodeA.call("math.add", "a", 2, "b", 5).waitFor(5000); // routed to node-b
            assertEquals(7, rsp.asInteger());
        } finally {
            nodeA.stop();
            nodeB.stop();
        }
    }
}
```

> The `InternalTransporter` bus is shared **JVM-wide**, so keep `nodeID`s unique across concurrently
> running tests to avoid cross-talk. To verify cross-language behaviour against a real Node.js node, run
> the [integration demo](https://github.com/moleculer-java/moleculer-integration-demo) instead.
