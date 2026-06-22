# Running under Spring

Spring is **optional** in Moleculer for Java. You never need it to run a service — see
[A minimal Java service](minimal-service.html) for the framework-free path. Reach for Spring when you
want its dependency injection: services that need DAOs, repositories or other Spring components
injected, or an existing Spring Boot application you are adding Moleculer to.

> **The Moleculer `Service` class is identical with or without Spring.** Actions are the same `public`
> instance fields, the lifecycle handlers are the same. Spring only changes **who creates the broker
> and the services** — Spring instantiates them as beans and a `SpringRegistrator` hands them to the
> broker. The rest of the [Core reference](services.html) applies unchanged.

## How registration works

In a Spring environment, Moleculer `Services` are Spring beans:

1. Mark each service with `@Controller` (or `@Component`) so Spring creates it.
2. A `services.moleculer.config.SpringRegistrator` bean discovers those beans after startup and calls
   `broker.createService(...)` for each.
3. The `ServiceBroker` bean is started/stopped by Spring via `init-method="start"` /
   `destroy-method="stop"` — do **not** also call them yourself.

A Spring-managed service therefore looks exactly like a normal one, plus the stereotype annotation:

```java
package my.services;

import org.springframework.stereotype.Controller;
import services.moleculer.service.*;

@Name("service1")
@Controller
public class TestService extends Service {

    @Name("action1")
    public Action testAction = ctx ->
            ctx.params.get("a", 0) + ctx.params.get("b", 0);
}
```

The optional REPL, JMX, Web (API Gateway) and MongoDB modules are registered the same way — declare
them as beans and `SpringRegistrator` wires them into the broker.

## Option A — Spring Boot (Java configuration)

No XML. Put the broker in a `@Configuration` as a `@Bean` (Spring starts/stops it via
`initMethod`/`destroyMethod`), add a `SpringRegistrator`, and let component scanning pick up your
`@Controller`-annotated services. The two classes below are a **complete, runnable** Java node that
joins the same NATS cluster as a Node.js node — the `service1.action1` service from
[above](#how-registration-works) becomes callable from Node.js as
`broker.call("service1.action1", { a, b })`.

```java
// MoleculerApplication.java — the entry point
package my.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({ "my.app", "my.services" })   // scan the broker config and the services
public class MoleculerApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MoleculerApplication.class);
        app.setWebApplicationType(WebApplicationType.NONE); // talks over NATS, serves no HTTP
        app.run(args);
    }
}
```

```java
// BrokerConfig.java — the broker as a Spring bean
package my.app;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import services.moleculer.ServiceBroker;
import services.moleculer.config.ServiceBrokerConfig;
import services.moleculer.config.SpringRegistrator;
import services.moleculer.serializer.JsonSerializer;
import services.moleculer.transporter.NatsTransporter;

@Configuration
public class BrokerConfig {

    // Spring starts the broker (initMethod) and stops it on shutdown (destroyMethod).
    @Bean(initMethod = "start", destroyMethod = "stop")
    public ServiceBroker serviceBroker() {
        ServiceBrokerConfig cfg = new ServiceBrokerConfig();
        cfg.setNodeID("java-node");                  // unique in the cluster (Node side uses e.g. "node-node")

        NatsTransporter nats = new NatsTransporter("nats://localhost:4222"); // the shared bus
        nats.setSerializer(new JsonSerializer());    // JSON: the cross-language default
        cfg.setTransporter(nats);

        // No broker.createService(...) here: the SpringRegistrator below discovers the
        // @Controller-annotated services and registers them automatically.
        return new ServiceBroker(cfg);
    }

    // Discovers @Controller/@Component beans of type Service and registers them with the broker.
    @Bean
    public SpringRegistrator springRegistrator() {
        return new SpringRegistrator();
    }
}
```

Add the NATS client (`io.nats:jnats`) to your `pom.xml` alongside `moleculer-java`; see
[Setup — one cluster](interop-setup.html) for the dependency block and the cluster-alignment rules.

## Option B — Classic XML configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context-3.0.xsd">

    <!-- ENABLE ANNOTATION PROCESSING -->

    <context:annotation-config />

    <!-- PACKAGE OF THE MOLECULER SERVICES -->

    <context:component-scan base-package="my.services" />

    <!-- SPRING REGISTRATOR FOR MOLECULER SERVICES -->

    <bean id="registrator"
          class="services.moleculer.config.SpringRegistrator"
          depends-on="broker" />

    <!-- SERVICE BROKER INSTANCE -->

    <bean id="broker" class="services.moleculer.ServiceBroker"
        init-method="start"
        destroy-method="stop">
        <constructor-arg ref="brokerConfig" />
    </bean>

    <!-- SERVICE BROKER SETTINGS -->

    <bean id="brokerConfig" class="services.moleculer.config.ServiceBrokerConfig">
        <property name="nodeID" value="node-1" />
        <property name="transporter" ref="transporter" />
    </bean>

    <!-- CONFIGURE TRANSPORTER -->

    <bean id="transporter" class="services.moleculer.transporter.TcpTransporter" />

</beans>
```

With this configuration Spring loads Moleculer `Services` from the `my.services` package. There is an
extended [XML configuration sample](https://github.com/moleculer-java/moleculer-java/tree/master/cfg)
on the project's GitHub page that also shows how to declare internal Moleculer modules in XML.

## Spring `init`/`destroy` vs. Moleculer `started`/`stopped`

The Moleculer `started(broker)` / `stopped()` handlers are always invoked by the **`ServiceBroker`**,
not by Spring — so do not register them as Spring `init-method` / `destroy-method`. If you also need
Spring init/destroy callbacks, create separate methods for them; the broker lifecycle and the Spring
lifecycle run independently. See [Lifecycle](lifecycle.html#service-lifecycle).

## Starting and packaging

A Spring Boot Moleculer app can run standalone (Netty) or inside a Jakarta EE servlet container, and
is typically launched with the **[Moleculer Runner](runner.html)**. For a minimal, runnable
**Spring Boot ↔ Node.js interop** reference, see the
[integration demo](https://github.com/moleculer-java/moleculer-integration-demo) — a Spring Boot Java
node and a Moleculer 0.15 Node.js node on one NATS cluster. The larger
[Spring Boot demo](https://moleculer-java.github.io/moleculer-spring-boot-demo/) wires the broker, the
Web API Gateway, the REPL and JMX together and ships a Windows installer.
