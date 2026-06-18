## About Moleculer Services

The `Service` is a basic component in the Moleculer Ecosystem.
`Services` may have `Actions` that other `Services` can invoke locally or over the network.
`Services` can also define event `Listeners` that can react to events created in the Moleculer Cluster.
Using the Moleculer Framework, `Services` written in
[different languages](https://github.com/moleculerjs/awesome-moleculer#polyglot-implementations)
can work effectively with each other.

Moleculer can be integrated with the [Spring Framework](https://spring.io/).
In the Spring Environment, Moleculer `Services` and `ServiceBroker` are Spring Beans.
This will allow Moleculer `Services` to access the other Spring Components
(eg. [DAO](https://en.wikipedia.org/wiki/Data_access_object) classes for access the backend).

The [WEB API Gateway](moleculer-web.html#about-api-gateway)
module enables the Moleculer `Services` to function as REST/HTML services
generating HTML pages using server-side Template Engines.
In addition, they can receive / send large files or send WebSocket packets to browsers.

## Actions

The actions are the callable/public methods of a `Service`.
They are callable with "broker.call()" or "ctx.call()" methods.

**Example**

A `Service` schema of adding and subtracting two numbers (the example defines two `Actions`):

```java{4,9}
@Name("math")
public class MathService extends Service {

    public Action add = ctx -> {
        return ctx.params.get("a", 0) + 
               ctx.params.get("b", 0);
    };
    
    public Action sub = ctx -> {
        return ctx.params.get("a", 0) -
               ctx.params.get("b", 0);
    };
    
}
```

::: warning Action fields must be `public` (and never `static`)
The `ServiceBroker` discovers `Actions` by reflecting over the `Action` fields of your `Service`.
Declare them **`public`**: a package-private or private `Action` is registered with `protected`
visibility, which means it is callable **only on the local node** and is **not published to the
cluster** — a Node.js node could never reach it. `Action` fields are instance fields, never
`static` (a `static` lambda cannot see the service's `this`/`broker`). This is the one rule to
remember; every example below follows it.
:::

::: tip Canonical form — and the anonymous alternative
The `@Name`-annotated class above is the **canonical** service form used throughout this
documentation. For a short, inline example you may also see the equivalent **anonymous** form (an
inline subclass), which the broker registers the same way:

```java
broker.createService(new Service("math") {
    public Action add = ctx -> ctx.params.get("a", 0) + ctx.params.get("b", 0);
});
```

Prefer the named class for anything reusable; the `public` / non-`static` action rule applies to both.
:::

The "@Name" attribute isn't a mandatory property, if missing,
ServiceBroker will generate the `Service` name from the Class name.
The algorithm used to create `Services` names is similar to when Spring registers Beans;
the first letter will be lowercase, the rest will not change
(for example, `MathService` registers as "mathService").
This rule also applies to `Action` names;
you can specify the name with the "@Name" annotation;
if missing, the Java field name will be the action name (eg. "add" `Action` registers as "add").

To register the `MathService` in a ServiceBroker, use the "createService" method:

```java{2}
ServiceBroker broker = ServiceBroker.builder().build();
broker.createService(new MathService());
broker.start();
```

::: tip No folder auto-loading or hot reload
You register services explicitly with `broker.createService(...)` (or as Spring beans). Moleculer
for Java has **no `loadServices("./services")` folder scanner and no `--hot` hot-reload** that some
Node.js setups rely on. Add each service in code (or let Spring inject them); to pick up changes,
restart the broker. See also the [Runner](runner.html) page.
:::

To call the `Service`, use the "call" method:

```java{3,8}
// in thread-blocking style:

Tree rsp = broker.call("math.add", "a", 5, "b", 3).waitFor();
System.out.println("Response: " + rsp.asInteger());

// ...or, in non-blocking style:

broker.call("math.sub", "a", 5, "b", 3).then(rsp -> {
    System.out.println("Response: " + rsp.asInteger());
});
```

From the caller perspective does not matter the physical location of the `Service`.
The "math.add" and "math.sub" `Actions` can be on other machine,
written in a different programming language.  
[Read more about Actions.](actions.html)

## Versioned Services

```java{2}
@Name("math")
@Version("2")
public class MathV2Service extends Service {

    // Modified "add" and "sub" Actions...    
}
```

To call the versioned `Service`, use the "v2." prefix:

```java
broker.call("v2.math.add", "a", 5, "b", 3);
```

::: tip REST call
Via [WEB API Gateway](moleculer-web.html#about-api-gateway), make a request to GET /v2/math/add.
:::

## Service configuration (the `settings` equivalent)

Node.js services keep configuration in a `settings` object (`this.settings`). Java has no `settings`
block — a service is a normal class, so its configuration is just **fields**, read directly in your
actions and lifecycle handlers:

```java
@Name("mail")
public class MailService extends Service {

    // The "settings" of this service are plain fields
    private final String smtpHost = "localhost";
    private final int    smtpPort = 25;

    public Action send = ctx -> {
        // ... use smtpHost / smtpPort ...
        return null;
    };
}
```

For values that come from the environment or a config file, assign them in the constructor or in
[`started(broker)`](lifecycle.html#service-lifecycle) (e.g. from `broker.getConfig()`, or — under
Spring — via `@Value` / injected beans).

## Events

`Services` can monitor events.
Events can come from local but also from remote nodes.
The content of the event is a "JSON structure" (ctx.params) inside a `Context` object.

**Example**

```java{3,4}
public class PaymentService extends Service {

    @Subscribe("order.created")
    Listener orderCreated = ctx -> {
        logger.info("Received data: {}", ctx.params);
    };
}
```

[Read more about event handling.](events.html)

## Lifecycle handlers

There are some lifecycle service events, that will be triggered by the `ServiceBroker`.

```java{3,9}
public class TestService extends Service {

    public void started(ServiceBroker broker) throws Exception {
        super.started(broker);
        // Custom initialization functions
    }

    @Override
    public void stopped() {
        // Closing resources, stopping timers
    }
    
} 
```

These are called when `ServiceBroker` starts or stops the `Services`.  
[Read more about lifecycle of Services.](lifecycle.html)

Other system-level events can be handled by event `Listeners`
(eg. another Node joining the cluster or a change in the `Service` list).  
[Read more about internal events.](events.html)

## Dependencies

If a `Service` depends on other `Services`, use the "@Dependencies" annotation to denote dependencies.
The service waits for dependent services before calls the "started" lifecycle event handler. 

```java{1}
@Dependencies({"logService", "backendService"})
public class RestService extends Service {
    // ...
}
```

The main difference between the "@Dependencies" annotation and Spring "@DependsOn" annotation
is that "@Dependencies" monitors the entire Moleculer Cluster.
In the example above, "logService" or "backendService" can be a **remote** `Service`.
The Spring "@DependsOn" annotation only monitors the local `ApplicationContext`.

## Wait for services via ServiceBroker

To wait for services, you can also use the "waitForServices" method of `ServiceBroker`.
It returns a `Promise` which will be resolved when all defined services are available & started.

**Example**

```java
broker.waitForServices("posts", "users").then(rsp -> {
    // Called after the "posts" and "users" services are available
});
```

**Handle timeout**

```java
broker.waitForServices(10 * 1000, "accounts").then(rsp -> {
    // Call it when the "accounts" service becomes available within 10 seconds
}).catchError(err -> {
    // Called if the wait time is more than 10 seconds
});
```

::: warning
Do not use the "waitForServices" method to block the Spring initialization process (for example, while creating Beans).
`ServiceBroker` starts completely after Spring initialization is complete.
:::