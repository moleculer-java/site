## Types of Transporters

In order to communicate with other nodes (`ServiceBroker` instances) you need to configure a `Transporter`.
There are two types of `Transporter`:

- **Centralized** Transporters: `Transporters` using a central server. The central server can be, for example, a Redis, NATS, Kafka, MQTT or a JMS server.

- **Decentralized**, Peer-to-Peer Transporters: `Transporters` without a central server. For example, `TcpTransporter` belongs to this group, which uses Gossip protocol to publish the status of the nodes.

`Transporter` communicates with other nodes, transfers events, calls requests and processes responses.
If a `Service` runs on multiple instances on different nodes, the requests will be load-balanced among live nodes.
Each `Transporter` can be assigned a [Serializer](serializers.html#about-data-serialization).
`Serializers` convert messages into bytes and vice versa.
There are several built-in `Transporters` in Moleculer Framework.

## Centralized `Transporters`

Centralized `Transporters` connect to a central `MessageBroker` that provide a reliable way of exchanging messages among remote nodes.
These brokers use publish/subscribe messaging pattern to deliver data packets.

<div align="center">
    <img src="networking-centralized.svg" alt="Centralized topology" class="zoom" />
</div>

### NATS Transporter

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
Built-in transporter for [NATS](http://nats.io/).
NATS Server is a simple, high performance open source messaging system for cloud native applications,
IoT messaging, and microservices architectures.

```java
NatsTransporter transporter = new NatsTransporter("nats://nats.server:4222");
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

::: warning NATS dependencies
To use NATS Transporter, add the following dependency to the build script:  
[group: 'io.nats', name: 'jnats', version: '2.26.2'](https://mvnrepository.com/artifact/io.nats/jnats)
:::

Detailed example:

```java
// Create Transporter
NatsTransporter transporter = new NatsTransporter("host1", "host2");

// Configure Transporter
transporter.setSecure(true);
transporter.setUsername("user");
transporter.setPassword("secret");
transporter.setNoRandomize(true);

// Create Service Broker
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();

// Install distributed Services
broker.createService(new Service("testService") {
    Action testAction = ctx -> {

        // Process request JSON (ctx.params),
        // and create response JSON structure
        return new Tree();
    };
});
            
// Connect the Service Broker to other Nodes
broker.start();
```

### Redis Transporter

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
Built-in `Transporter` for [Redis](http://redis.io/).
Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker.

```java
RedisTransporter transporter = new RedisTransporter("redis://redis.server:6379");
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

::: warning Redis dependencies
To use Redis Transporter, add the following dependency to the build script:  
[group: 'io.lettuce', name: 'lettuce-core', version: '6.8.2.RELEASE'](https://mvnrepository.com/artifact/io.lettuce/lettuce-core)
:::

Detailed example:

```java
RedisTransporter transporter = new RedisTransporter("host1", "host2");
transporter.setSecure(true);
transporter.setPassword("secret");
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

### MQTT Transporter

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
Built-in `Transporter` for [MQTT](http://mqtt.org/) protocol.
MQTT Transporter (eg. for [Mosquitto](https://mosquitto.org/) MQTT Server or ActiveMQ Server).
MQTT is a machine-to-machine (M2M)/"Internet of Things" connectivity protocol.
It was designed as an extremely lightweight publish/subscribe messaging transport.
 
```java
MqttTransporter transporter = new MqttTransporter("mqtt://mqtt-server:1883");
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

::: warning MQTT dependencies
To use MQTT Transporter, add the following dependency to the build script:  
[group: 'org.eclipse.paho', name: 'org.eclipse.paho.client.mqttv3', version: '1.2.5'](https://mvnrepository.com/artifact/org.eclipse.paho/org.eclipse.paho.client.mqttv3)
:::

Detailed example:

```java
MqttTransporter transporter = new MqttTransporter("host1");
transporter.setUsername("user");
transporter.setPassword("secret");
transporter.setKeepAliveSeconds(120);
transporter.setConnectTimeoutSeconds(10);
transporter.setMessageResendIntervalSeconds(20);
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

### AMQP Transporter

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
Built-in `Transporter` for [AMQP](https://www.amqp.org/) protocol.
AMQP Transporter based on [RabbitMQ's](https://www.rabbitmq.com/) AMQP client API.
AMQP provides a platform-agnostic method for ensuring information is safely transported
between applications, among organizations, within mobile infrastructures, and across the Cloud.

```java
AmqpTransporter transporter = new AmqpTransporter("amqp://rabbitmq-server:5672");
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

::: warning AMQP dependencies
To use AMQP Transporter, add the following dependency to the build script:  
[group: 'com.rabbitmq', name: 'amqp-client', version: '5.35.0'](https://mvnrepository.com/artifact/com.rabbitmq/amqp-client)
:::

Detailed example:

```java
AmqpTransporter transporter = new AmqpTransporter("host1");
transporter.setUsername("user");
transporter.setPassword("secret");
transporter.setSslContextFactory(customSslFactory);
transporter.setQueueProperties(customQueueProperties);
transporter.setExchangeProperties(customExchangeProperties);
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

### Kafka Transporter

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
Built-in `Transporter` for [Kafka](https://kafka.apache.org/).
Kafka is used for building real-time data pipelines and streaming apps.
It is horizontally scalable, fault-tolerant, wicked fast, and runs in production in thousands of companies.
Kafka Transporter is a very simple implementation.
It transfers Moleculer packets to consumers via pub/sub.
There are not implemented offset, replay, etc. features.

```java
KafkaTransporter transporter = new KafkaTransporter("kafka://server:9092");
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

::: warning Kafka dependencies
To use Kafka Transporter, add the following dependency to the build script:  
[group: 'org.apache.kafka', name: 'kafka-clients', version: '4.3.1'](https://mvnrepository.com/artifact/org.apache.kafka/kafka-clients)
:::

Detailed example:

```java
KafkaTransporter transporter = new KafkaTransporter();
transporter.setUrls(new String[] { "192.168.51.29:9092" });
transporter.setDebug(true);
transporter.setProducerProperty("session.timeout.ms", "30000");
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

### JMS Transporter

Built-in `Transporter` for [Java Message Service](https://www.oracle.com/technical-resources/articles/java/intro-java-message-service.html).
The Java Message Service API is a Java Message Oriented Middleware API for sending messages between two or more clients.
It is an implementation to handle the Producer-consumer problem.
JMS is a part of the Java Enterprise Edition.

```java
// Sample of usage with Active MQ
JmsTransporter transporter = new JmsTransporter(new ActiveMQConnectionFactory());
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

::: warning JMS dependencies
To use JMS Transporter, add the following dependency to the build script:  
[group: 'jakarta.jms', name: 'jakarta.jms-api', version: '3.1.0'](https://mvnrepository.com/artifact/jakarta.jms/jakarta.jms-api)  
\+ dependencies of the JMS driver
:::

Detailed example:

```java
JmsTransporter transporter = new JmsTransporter(new ActiveMQConnectionFactory());
transporter.setUsername("user");
transporter.setPassword("secret");
transporter.setAcknowledgeMode(JMSContext.AUTO_ACKNOWLEDGE);
transporter.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
transporter.setTransacted(false);
transporter.setPriority(5);
transporter.setTtl(10000);
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

## Decentralized, Peer-to-Peer Transporters

<div align="center">
    <img src="networking-decentralized.svg" alt="Decentralized topology" class="zoom" />
</div>

### TCP Transporter

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  

> **Just choosing a transporter?** TCP needs no external broker, but it is the most advanced option —
> the rest of this section dives into Gossip discovery, sequence numbers and tuning. If you only need a
> working cluster, a centralized transporter above (NATS, Redis…) is simpler; come back here when you
> specifically want a broker-less, peer-to-peer setup.

TCP `Transporter` uses fault tolerant and peer-to-peer
[Gossip protocol](https://en.wikipedia.org/wiki/Gossip_protocol)
to discover location and service information about the other nodes
participating in a Moleculer Cluster. In Moleculer's P2P architecture all
nodes are equal, there is no "leader" or "controller" node, so the cluster is
truly horizontally scalable. This `Transporter` aims to run on top of an
infrastructure of hundreds of nodes.
TCP `Transporter` provides the highest speed data transfer between Moleculer
Nodes - hundred thousand packets per second can be transmitted from one node to another over a high-speed LAN.
There are two ways for TCP `Transporter` to find other nodes on the network:

- UDP multicast / broadcast discovery
- Based on a preset host list

It contains an integrated UDP discovery feature to detect new and disconnected nodes on the network.
If the UDP is prohibited on your network, use "urls" option to list the hosts.
The list contains remote endpoints; host/ip, port and nodeID.
The list can be static or a file path/URL which contains the list.
 
Example of using TCP `Transporter` with default settings with UDP discovery:

```java
// Create Transporter
TcpTransporter transporter = new TcpTransporter();

// Create Service Broker
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("node1")
                                    .transporter(transporter)
                                    .build();
            
// Install distributed Services
broker.createService(new Service("testService") {
    Action testAction = ctx -> {

        // Process request JSON (ctx.params),
        // and create response JSON structure
        return new Tree();
    };
});
            
// Connect the Service Broker to other Nodes
broker.start();
```

TCP `Transporter` with static endpoint list:

```java
TcpTransporter transporter = new TcpTransporter("172.17.0.1:6000/node-1",
                                                "172.17.0.2:6000/node-2",
                                                "172.17.0.3:6000/node-3");
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("node-1")
                                    .transporter(transporter)
                                    .build();
```

> You don't need to set "port" because it find & parse the self TCP port from URL list.

TCP `Transporter` with static endpoint list file:

```java
TcpTransporter transporter = new TcpTransporter(new URL("file:///nodes.json"));
```

```java
// nodes.json
[
    "127.0.0.1:6001/client-1",
    "127.0.0.1:7001/server-1",
    "127.0.0.1:7002/server-2"
]
```

<details>
<summary><b>Advanced — how Gossip discovery works</b></summary>

Network traffic is approximately constant when using TCP Transporter.
During operation, each node talks to another random node from time to time.
They communicate statements about what they know about other nodes of the cluster.
If they have conflicting information about another node, they decide which statement is true based on the "sequence number" in the information.
This "sequence number" continues to increase by one as the information changes.
New information is spreading at an increasing rate within the cluster;
the number of nodes that have new information may double every period.
(1, then 2, then 4, 8, 16, 32, etc.).
Thus, the spread of information is **not immediate**, but fast enough.

<div align="center">
    <img src="cluster/cluster-1581160126449.gif" alt="Visualistation of Moleculer's Gossip Protocol" class="zoom" />
</div>

The above visualization shows the communication of 50 nodes. Speed is five times the real speed.
During the simulation, nodes are randomly turned on and off.
The red squares indicate that one node knows that another node is off.
Green squares mean that one node knows that another node is on.
Dark-green means new information, light-green means older information
("old" information will be "new" when the node get information about another node).
The numbers represent the sequence number.
Not only the on / off status is distributed over the network in this way,
but also the list of `Services` and their properties.

</details>

**Options of TCP Transporter**

| Name | Type | Default | Description |
| ---- | ---- | --------| ----------- |
| port | int | 0 | TCP port (used by the Transporter and Gossiper services). A port number of zero will let the system pick up an ephemeral port in a bind operation. |
| gossipPeriod | int | 3| Gossiping period time, in SECONDS. |
| maxConnections | int | 32 | Max number of keep-alive connections (-1 = unlimited, 0 = disable keep-alive connections). |
| maxPacketSize | int | 1MB | Max enable packet size (BYTES). |
| urls | String[] | null | List of URLs ("tcp://host:port/nodeID" or "host:port/nodeID" or "host/nodeID"), when UDP discovery is disabled. |
| useHostName | boolean | true | Use hostnames instead of IP addresses As the DHCP environment is dynamic, any later attempt to use IPs instead hostnames would most likely yield false results. Therefore, use hostnames if you are using DHCP. |
| udpPort | int | 4445 | UDP broadcast/multicast port. |
| udpBindAddress | int | null | UDP bind address (null = autodetect) |
| udpPeriod | int | 30 | UDP broadcast/multicast period in SECONDS. |
| udpReuseAddr | boolean | true | Resuse addresses (UDP). |
| udpMaxDiscovery | int | 0 | Maximum number of outgoing multicast packets (0 = runs forever). |
| udpMulticast | String | "239.0.0.0" | UDP multicast address of automatic discovery service. |
| udpMulticastTTL | int | 1 | TTL of UDP multicast packets. |
| udpBroadcast | boolean | false | Use UDP broadcast WITH UDP multicast (false = use UDP multicast only). |
| udpMaxDiscovery | int | 0 | Maximum number of outgoing multicast packets (0 = runs forever). |

### Internal Transporter

Internal `Transporter` is a built-in message bus that can connect multiple `ServiceBrokers` running in the same JVM.
This `Transporter` is primarily used for **testing purposes** (eg. for testing `Serializers`, `Listeners` or `Actions`).
The calls are made in separate `Threads`, so call timeouts can be used.

Using the shared (static) communication group:

```java
ServiceBroker broker1 = ServiceBroker.builder()
                                     .nodeID("node1")
                                     .transporter(new InternalTransporter())
                                     .build();
ServiceBroker broker2 = ServiceBroker.builder()
                                     .nodeID("node2")
                                     .transporter(new InternalTransporter())
                                     .build();
```

Using independent communication groups:

```java
// --- CREATE COMMUNICATION GROUPS ---

Subscriptions group1 = new Subscriptions();
Subscriptions group2 = new Subscriptions();

// --- CREATE TRANSPORTERS ---

// Group-1
InternalTransporter transporter1 = new InternalTransporter(group1);
InternalTransporter transporter2 = new InternalTransporter(group1);

// Group-2
InternalTransporter transporter3 = new InternalTransporter(group2);
InternalTransporter transporter4 = new InternalTransporter(group2);

// --- CREATE SERVICE BROKERS ---

// Group-1
ServiceBroker broker1 = ServiceBroker.builder()
                                     .nodeID("node1")
                                     .transporter(transporter1)
                                     .build();
ServiceBroker broker2 = ServiceBroker.builder()
                                     .nodeID("node2")
                                     .transporter(transporter2)
                                     .build();

// Group-2
ServiceBroker broker3 = ServiceBroker.builder()
                                     .nodeID("node3")
                                     .transporter(transporter3)
                                     .build();
ServiceBroker broker4 = ServiceBroker.builder()
                                     .nodeID("node4")
                                     .transporter(transporter4)
                                     .build();
```

### File System Transporter

Built-in, filesystem-based, server-less `Transporter`.
With this `Transporter` multiple `Service` Brokers can communicate with each other through a shared directory structure.
File System `Transporter` is not advisable for use in production mode as it is much slower than other `Transporter`.
Rather it can be considered as a reference implementation or a code sample.

```java
FileSystemTransporter transporter = new FileSystemTransporter("/shared/dir");
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .build();
```

## Custom Transporter

Custom `Transporter` module can be created.
The simplest solution is to copy the source code of an existing `Transporter`
and modify the "connect", "stopped", "subscribe" and "publish" methods.

Create custom `Transporter`:

```java
public class CustomTransporter extends Transporter {
    public void connect { /*...*/ }
    public void stopped() { /*...*/ }
    public void publish(String channel, Tree message) { /*...*/ }
    public Promise subscribe(String channel) { /*...*/ }
}
```

Use custom `Transporter`:

```java
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(new CustomTransporter())
                                    .build();
```