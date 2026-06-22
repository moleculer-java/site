## About load balancing

Moleculer has several built-in load balancing strategies.
If a `Service` has **multiple running instances**,
`ServiceRegistry` uses these strategies to select a node from all available nodes.
The default (pre-set) invocation mode is the `RoundRobinStrategy`.

<div align="center">
    <img src="action-balancing.gif" alt="Action balancing diagram" />
</div>

## Balancing across languages

A `service.action` is addressed the same way no matter which language hosts it, so **all** running
instances of an action are interchangeable to the balancer — Java and Node.js instances sit in one
pool. If `mathNode.add` runs on, say, two Node.js nodes and one Java node, a caller's strategy
(round-robin by default) spreads calls across **all three**, regardless of the caller's own language:
you do not target a language, you target the action. To keep a call inside the local JVM whenever a
local instance exists, set `setPreferLocal(true)` on the strategy (see [Round-Robin](#round-robin-strategy)
below) — every `StrategyFactory` supports it.

## Built-in Strategies

To configure `Strategy`, set "strategy()" builder option when creating the `ServiceBroker`.
Alternatively, set up the `Strategy` of the `ServiceBrokerConfig` using the "setStrategyFactory()" method.

**Configure a balancing Strategy**

```java{6}
// Create a "StrategyFactory"
StrategyFactory strategy = new XorShiftRandomStrategyFactory();

// Method #1: Setup using ServiceBrokerConfig
ServiceBrokerConfig config = new ServiceBrokerConfig();
config.setStrategyFactory(strategy);
ServiceBroker broker = new ServiceBroker(config);

// Method #2: Setup using ServiceBroker.builder()
ServiceBroker broker = ServiceBroker.builder()
                                    .strategy(strategy)
                                    .build();
```

### Round-Robin Strategy

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
This Strategy selects a node based on [round-robin](https://en.wikipedia.org/wiki/Round-robin_DNS) algorithm.
This is the default invocation `Strategy`.
You can use the "setPreferLocal" function to configure `ServiceRegistry`
to invoke locally available services whenever they are available in the JVM.
If set to "true", `ServiceBroker` will always use internal `Action` calls, if possible.
Such a function exists for each `StrategyFactory`.

**Usage**

```java
RoundRobinStrategyFactory strategy = new RoundRobinStrategyFactory();
strategy.setPreferLocal(true);
ServiceBroker broker = ServiceBroker.builder().strategy(strategy).build();
```

### Random Strategies

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
These strategies randomly select the callable node.
The load on each node (as in round-robin) will be roughly the same.

**Usage**

```java
// Faster pseudo random
XorShiftRandomStrategyFactory strategy = new XorShiftRandomStrategyFactory();

// Slower secure random
SecureRandomStrategyFactory strategy = new SecureRandomStrategyFactory();
```
### CPU usage-based Strategy

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
This `Strategy` selects a node which has the lowest CPU usage.
Due to the node list can be very long,
it gets samples and selects the node with the lowest CPU usage from only samples instead of the whole node list.
CPU-based load balancing works even when the application is heterogeneous (consisting of Java and Node.js modules).

**Usage**

```java
// Create CPU monitor
JmxMonitor cpuMonitor = new JmxMonitor();
        
// Create CPU-based strategy
CpuUsageStrategyFactory invocationStrategy = new CpuUsageStrategyFactory();
invocationStrategy.setLowCpuUsage(5);
invocationStrategy.setMaxTries(3);
        
// Create service broker
ServiceBroker broker = ServiceBroker.builder()
                                    .strategy(invocationStrategy)
                                    .monitor(cpuMonitor)
                                    .build();        
```

To determine CPU usage, `ServiceBroker` needs a `Monitor` instance that can query the current CPU usage.
The default is the `JmxMonitor`, which reads the CPU load through the JVM's built-in
**JMX** (`java.lang.management`) API — it needs no native libraries or extra dependencies.
If JMX cannot report a CPU load on the given platform, `ServiceBroker` automatically falls back
to the `ConstantMonitor` (which always reports the same value).

**Strategy options**

| Name | Type | Default | Description |
| ---- | ---- | --------| ----------- |
| sampleCount | int | 3 | The number of samples. The minimum value is 1 (you can't turn off sampling). |
| lowCpuUsage | int | 10 | The low CPU usage percent (%). The node which has lower CPU usage than this value is selected immediately. |

### Latency-based Strategy

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
This `Strategy` selects a node which has the lowest latency, measured by periodic ping commands.
`NetworkLatencyStrategy` will ping each node one by one.
Due to slow sampling, it may take a few minutes for the `Services` to select optimal nodes.

**Usage**

```java
// Create latency-based strategy
NetworkLatencyStrategyFactory strategy = new NetworkLatencyStrategyFactory();
strategy.setSampleCount(5);
strategy.setCollectCount(10);
strategy.setPingInterval(10);
strategy.setPingTimeout(5000);
        
// Create service broker
ServiceBroker broker = ServiceBroker.builder().strategy(strategy).build();
```

**Strategy options**

| Name | Type | Default | Description |
| ---- | ---- | --------| ----------- |
| sampleCount | int | 5 | The number of samples. If you have a lot of hosts/nodes, it's recommended to *increase* the value. Minimum value is "1". |
| collectCount | int | 5 | The number of measured latency per host to keep in order to calculate the average latency. |
| pingInterval | int | 10 | Ping interval in SECONDS. If you have a lot of host/nodes, it's recommended to *increase* the value. |
| pingTimeout | long | 5000 | Ping timeout time, in MILLISECONDS. |

### Sharding Strategy

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
Shard invocation `Strategy` is based on [consistent-hashing](https://www.toptal.com/big-data/consistent-hashing) algorithm.
It uses a key value from context "params" or "meta" to route the request to nodes.
It means that requests with same key value will be routed to the same node.

**Usage**

Shard key is "name" in context params :

```java
// Create sharding strategy
ShardStrategyFactory strategy = new ShardStrategyFactory();
strategy.setShardKey("name");
        
// Create service broker
ServiceBroker broker = ServiceBroker.builder().strategy(strategy).build();
```

Shard key is user.id in context meta :

```java
ShardStrategyFactory strategy = new ShardStrategyFactory();
strategy.setShardKey("#user.id");
ServiceBroker broker = ServiceBroker.builder().strategy(strategy).build();
```

::: tip
If shard key is in context's "meta" it must be declared with a "#" at the beginning.
The actual "#" is ignored.
:::

**Strategy options**

| Name | Type | Default | Description |
| ---- | ---- | --------| ----------- |
| shardKey | String | null |  Shard key |
| vnodes | int | 10 | Number of virtual nodes |
| ringSize | Integer | null | Size of the ring |
| cacheSize | int | 1024 | Size of the cache |

## Custom Strategy

Custom `Strategy` can be created by implementing `StrategyFactory` and `Strategy` interfaces.
We recommend to copy the source of [SecureRandomStrategyFactory](https://github.com/moleculer-java/moleculer-java/blob/master/src/main/java/services/moleculer/strategy/SecureRandomStrategyFactory.java)
and [SecureRandomStrategy](https://github.com/moleculer-java/moleculer-java/blob/master/src/main/java/services/moleculer/strategy/SecureRandomStrategy.java)
classes, and modify the "next()" method in the "SecureRandomStrategy.java".

**Usage**

```java
MyCustomStrategyFactory strategy = new MyCustomStrategyFactory();
ServiceBroker broker = ServiceBroker.builder().strategy(strategy).build();
```