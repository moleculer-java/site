## Introduction to Service Broker

The `ServiceBroker` is the main component of the Moleculer Framework.
Each Node connected to a Moleculer Cluster has a `ServiceBroker` instance.
It registers `Services`, handles `Action` calls, and forwards Events between the Nodes.
The Java-based `ServiceBroker` can run as standalone back-end (Windows or Linux) service
or can be built into a Jakarta EE application server as a standard Web Module.
Another important feature of `ServiceBroker` is that it is basically designed to not block `Threads`,
and can handle a large volume of requests in parallel.

## Create a Service Broker

**Create Broker with default settings**

```java
ServiceBroker broker = new ServiceBroker();

// Create a Service
broker.createService(new Service("test") {
    public Action action = ctx -> {
        return ctx.params.get("a", 0) +
               ctx.params.get("b", 0);
    };
});

// Invoke the Action of the Service
broker.call("test.action", "a", 3, "b", 4).then(rsp -> {
    System.out.println(rsp);
});
```

> **The `call("svc.action", "a", 3, "b", 4)` form** passes parameters as **key–value varargs** — it is
> shorthand for the params object `{"a": 3, "b": 4}`. (Equivalently, pass a `Tree`:
> `broker.call("test.action", new Tree().put("a", 3).put("b", 4))`.) A Node.js developer expecting
> `call(name, paramsObject)` gets that too — the varargs are just a convenience. See
> [Actions](actions.html#calling-actions) for the full calling syntax.

**Create Broker with custom settings**

There are two ways to create a `ServiceBroker`, using either
- `ServiceBrokerConfig` instance or
- `ServiceBroker.builder()` :

```java
// Solution #1
// Configuration with ServiceBrokerConfig:
ServiceBrokerConfig config = new ServiceBrokerConfig();

config.setNodeID("node1");
config.setTransporter(new RedisTransporter("redis://host"));
config.setStrategyFactory(new CpuUsageStrategyFactory());
config.setCacher(new MemoryCacher());

ServiceBroker broker = new ServiceBroker(config);

// Solution #2
// Configuration with ServiceBroker.builder:
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("node1")
                                    .transporter(...)
                                    .strategy(...)
                                    .cacher(...)
                                    .build();
```

**Create the broker with Spring (optional)**

If you use the Spring Framework, the broker and your services become Spring beans — Spring creates
them and a `SpringRegistrator` hands them to the broker. **The service class is exactly the same as
above**; only the broker's creation and startup move into Spring. The XML and Spring Boot setups live
on their own page: **[Running under Spring](spring.html)**.

::: tip Moleculer runner
The Moleculer Runner is a utility API that helps the application run as a background service.
Use the Moleculer Runner to create, start, stop the `ServiceBroker` simply and reliably.
This
[demo project](https://moleculer-java.github.io/moleculer-spring-boot-demo/)
uses Moleculer runner to run the application
(in standalone mode or integrated into a Jakarta EE server).
[Read more about Moleculer Runner.](runner.html#types-of-moleculer-runners)  
:::

## Configuration options

List of all available `ServiceBrokerConfig` options:

| Name | Type | Default | Description |
| ------- | ----- | ------- | ------- |
| namespace | String | "" | Namespace of nodes to segment your nodes on the same network. |
| nodeID | String | hostname + PID | Node identifier. Must be unique in the cluster. |
| internalServices | boolean | true | Register [internal services](internal-services.html). |
| jsonReaders | String | null | Comma-separated list of the preferred JSON deserializer APIs (jackson, gson, jodd, genson, etc.). |
| jsonWriters | String | null | Comma-separated list of the preferred JSON serializer APIs (jackson, gson, jodd, genson, etc.). |
| uidGenerator | UidGenerator | IncrementalUidGenerator | Implementation of the UID generator. |
| strategyFactory | StrategyFactory | RoundRobinStrategyFactory | Implementation of the [Invocation Strategy](balancing.html#about-load-balancing). |
| eventbus | Eventbus | DefaultEventbus | Implementation of the [Event Bus](services.html#events). |
| serviceRegistry | ServiceRegistry | DefaultServiceRegistry | Implementation of the [Service Registry](services.html#actions). |
| cacher | Cacher | MemoryCacher | Implementation of the [service-level Cache](caching.html#caching-action-calls) |
| serviceInvoker | ServiceInvoker | DefaultServiceInvoker | Implementation of the [Service Invoker](fault-tolerance.html#default-service-invoker). |
| transporter | Transporter | null | Implementation of the [Transporter](transporters.html#types-of-transporters). |
| monitor | Monitor | JmxMonitor | Implementation of the [CPU monitor](balancing.html#cpu-usage-based-strategy). |
| shutDownThreadPools | boolean | true | Shut down thread pools during the shutdown stage. |

This
[demo project](https://github.com/moleculer-java/moleculer-spring-boot-demo)
shows you how to build a Spring Boot based web application.
The demo also shows you how to set the above parameters.

## Service Broker methods

| Name | Response |  Description |
| ------- | ----- | ------- |
| broker.getConfig() | ServiceBrokerConfig | Returns the Broker's configuration and module container. |
| broker.getNodeID() | String | Returns the Broker's unique identifier. |
| broker.start() | ServiceBroker | Starts broker. Blocks until the end of the boot. |
| broker.stop() | ServiceBroker | Stops broker. Blocks until the end of the shutdown process. |
| broker.getLogger() | Logger | Return's the ServiceBroker's logger (this project uses SLF4J API). |
| broker.getLogger(class) | Logger | Returns a logger named corresponding to the class passed as parameter. |
| broker.getLogger(name) | Logger | Return a logger named according to the name parameter. |
| broker.createService(service) | ServiceBroker | Installs a new service instance and notifies other nodes about the service. |
| broker.createService(name, service) | ServiceBroker | Installs a new service with the specified name (eg. "user" service). |
| broker.getLocalService(name) | Service | Returns a local service by name (eg. "user" service). |
| broker.use(middlewares) | ServiceBroker | Installs a collection (or array) of Middlewares. |
| broker.getAction(name) | Action | Returns a local or remote Action by name. |
| broker.getAction(name, nodeID) | Action | Returns an Action by name and nodeID. |
| broker.call(actionName, params) | Promise | Call an action of the specified service (eg. "service.action"). |
| broker.waitForServices(services) | Promise | Waits for one (or an array of) service(s) to be created. |
| broker.waitForServices(timeout, services) | Promise | Wait for the specified services to be created within the specified time. |
| broker.ping(nodeID) | Promise | Sends a PING message to the specified node. The ping timeout is 3 seconds. |
| broker.ping(timeout, nodeID) | Promise | Sends a PING message to the specified node with the specified timeout. |
| createStream() | PacketStream | Creates a stream what is suitable for transferring large files between the nodes. |
| broker.repl() | boolean | Start Interactive Developer Console. |
| broker.emit(name, params) | - | Emit a balanced event. |
| broker.broadcast(name, params) | - | Broadcast an event. |
| broker.broadcastLocal(name, params) | - | Broadcast an event to local services. |
