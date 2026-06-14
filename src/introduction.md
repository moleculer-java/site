## What is Moleculer Java?

Moleculer Java (or Moleculer for Java) is the implementation of the [Moleculer Microservices Framework](http://moleculer.services/) for the JVM.
Moleculer Ecosystem is designed to facilitate the development of non-blocking distributed applications.
Moleculer is useful for a large range of applications: micro-services,
REST backends for modern JavaScript front-ends,
high volume message processing,
common platform for modules written in different languages.

## Features

- Polyglot (implemented in [multiple languages](https://github.com/moleculerjs/awesome-moleculer#polyglot-implementations))
- High-performance, non-blocking messaging and event APIs
- Asynchronous REST Services for high-load React, Angular or VueJS applications
- Runs as a standard Jakarta EE application or with a built-in Netty server
- Fault Tolerance and high availability (circuit breaker, request timeout, retry, etc.)
- Load balanced requests & events (round-robin, random, cpu-usage, network latency, sharding)
- Pluggable transporters (P2P TCP, NATS, MQTT, Redis, AMQP, Kafka, JMS, Ably.io)
- Pluggable serializers (JSON, MessagePack, BSON, CBOR, Ion, Smile)
- Built-in caching solution (memory cache, Redis cache, JCache)
- Send and receive streamed data (for transferring large files, media content)
- Built-in service registry & dynamic service discovery
- Supports WebSockets, SSL, Middlewares (for using cache, encryption or logging modules)
- Supports template engines for generating server-side HTMLs (FreeMarker, Mustache, Thymeleaf, Pebble, etc.)
- Interactive developer console (local or telnet) with custom commands
- Open source - Moleculer is 100% open source and free of charge

## Prerequisites

Moleculer Java requires Java 21.

## REST service example

Here's how to create a REST service using Moleculer:

```java
import services.moleculer.ServiceBroker;
import services.moleculer.service.Action;
import services.moleculer.service.Service;
import services.moleculer.web.ApiGateway;
import services.moleculer.web.netty.NettyServer;

public class Sample {
  public static void main(String[] args) throws Exception {
    new ServiceBroker()
      .createService(new NettyServer(8080))
      .createService(new ApiGateway("**"))
      .createService(new Service("math") {
        Action add = ctx -> {
          return ctx.params.get("a", 0) +
                 ctx.params.get("b", 0);
          };
        }).start();
  }
}
```

After starting the program, enter the following URL into your browser:  
`http://localhost:8080/math/add?a=3&b=6`

The response will be "9" (because 3 and 6 are the values of the "a" and "b" parameters).
The above service can also be invoked using a POST method.
To do this, submit the {"a":3,"b":5} JSON (as POST body) to this URL:  
`http://localhost:8080/math/add`

## Dependencies of the example

The Moleculer packages can be downloaded from the central
[Maven repository](https://mvnrepository.com/artifact/com.github.berkesa/moleculer-java).

**Gradle**

```gradle
dependencies {
    implementation group: 'org.slf4j',          name: 'slf4j-jdk14',        version: '2.0.18'
    implementation group: 'com.github.berkesa', name: 'moleculer-java',     version: '2.0.0'
    implementation group: 'com.github.berkesa', name: 'moleculer-java-web', version: '2.0.0' 
}
```

**Maven**

```xml
<dependencies>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-jdk14</artifactId>
        <version>2.0.18</version>
    </dependency>
    <dependency>
        <groupId>com.github.berkesa</groupId>
        <artifactId>moleculer-java</artifactId>
        <version>2.0.0</version>
    </dependency>
    <dependency>
        <groupId>com.github.berkesa</groupId>
        <artifactId>moleculer-java-web</artifactId>
        <version>2.0.0</version>
    </dependency>
</dependencies>
```

## Detailed Example

[This demo project](https://moleculer-java.github.io/moleculer-spring-boot-demo/)
demonstrating the basic capabilities of a Moleculer-based web application. 
The project can be imported into the Eclipse IDE or IntelliJ IDEA.
The brief examples illustrate the following:

- Integration of Moleculer API into the [Spring Boot Framework](broker.html#create-a-service-broker)
- Configuring HTTP [Routes](moleculer-web.html#routes) and [Middlewares](moleculer-web.html#http-middlewares)
- Creating non-blocking Moleculer [Services](services.html#about-moleculer-services)
- Publishing and invoking Moleculer `Services` as [REST Services](moleculer-web.html#aliases)
- Generating HTML pages in multiple languages using [Template Engines](moleculer-web.html#template-engines)
- Using [WebSockets](moleculer-web.html#websocket-handling) (sending real-time server-side events to browsers)
- Using file upload and [download](moleculer-web.html#response-type-status-code)
- Video streaming and server-side image generation
- Creating a WAR from the finished project (Servlet-based runtime)
- Run code without any changes in "standalone mode" (Netty-based runtime)

## Subprojects

**Java**

- [High-performance Web API for Moleculer Apps](moleculer-web.html#about-api-gateway)
- [Interactive Developer Console](moleculer-repl.html#about-the-developer-console)
- [MongoDB API for Moleculer](mongo-client.html#about-mongodb-client)
- [HTTP Client for Moleculer](http-client.html#about-the-async-http-client)
- [JMX Service for Moleculer](jmx-service.html#about-the-jmx-service)

**Node.js**

Node.js-based Moleculer `Services` can be used in Java-based applications as well as local `Services`
(in order for Node.js and Java Moleculer applications to communicate with each other,
they must both configure a
[Transporter](transporters.html#types-of-transporters)
of the same type).

- [List of Node.js-based Moleculer Modules](https://moleculer.services/modules.html)

## License

Moleculer for Java is available under the [MIT license](https://tldrlegal.com/license/mit-license),
can be used in commercial products for free.