# Metrics & tracing

Two related but very different stories on the Java side:

- **Metrics: yes, built in.** moleculer-java has a full **[Micrometer](https://micrometer.io/)**-based
  metrics subsystem (`services.moleculer.metrics`). It is **off by default**; turn it on and the broker
  records request, event, transit, transporter, circuit-breaker, cacher, retry and timeout metrics, and
  you can add your own. Despite that, there is **no `$node.metrics` action** — you read metrics through
  the registry, not through the `$node.*` introspection service.
- **Tracing: no native support.** There is **no** built-in tracer and **no** Jaeger / Zipkin /
  OpenTelemetry integration. See [Tracing](#tracing) for what to do instead.

## Enabling metrics

Metrics are collected by a `MetricMiddleware` that the broker installs **only** when
`metricsEnabled` is `true`. The registry implementation is `DefaultMetrics` (a Micrometer
`CompositeMeterRegistry`); a default instance is already in the config, so the minimum is one flag:

```java
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("java-node")
                                    .transporter(new NatsTransporter("nats://localhost:4222"))
                                    .metricsEnabled(true)   // installs the MetricMiddleware
                                    .build();
```

To configure reporting or add JVM gauges, build your own `DefaultMetrics` and hand it to the broker:

```java
DefaultMetrics metrics = new DefaultMetrics();
metrics.startConsoleReporter();   // periodic console dump (needs io.dropwizard.metrics:metrics-core)
metrics.addProcessorMetrics();    // optional JVM/system gauges
metrics.addJvmMemoryMetrics();

ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("java-node")
                                    .transporter(new NatsTransporter("nats://localhost:4222"))
                                    .metricsEnabled(true)
                                    .metrics(metrics)       // your configured registry
                                    .build();
```

The equivalent in Node.js is `metrics: { enabled: true, reporter: ... }` — same idea, wired in code.

## What is collected

With metrics enabled, the broker records these metric families (Micrometer counters, gauges and
timers); a few representative names:

| Family | Example metrics |
|---|---|
| Requests | `moleculer.request.total`, `moleculer.request.active`, `moleculer.request.error.total`, `moleculer.request.time` |
| Events | `moleculer.event.emit.total`, `moleculer.event.broadcast.total`, `moleculer.event.received.time` |
| Transit | `moleculer.transit.requests.active`, `moleculer.transit.connected` |
| Transporter | `moleculer.transporter.packets.sent.total`, `moleculer.transporter.packets.received.bytes` |
| Circuit breaker | `moleculer.circuit-breaker.opened.active`, `moleculer.circuit-breaker.opened.total` |
| Cacher / retry / timeout | cache get/set/del/clean counts, retry attempts, request timeouts |

You can also bind standard JVM/system meters on the `DefaultMetrics` instance:
`addProcessorMetrics()` (CPU), `addJvmMemoryMetrics()`, `addJvmGcMetrics()`, `addJvmThreadMetrics()`,
`addClassLoaderMetrics()`, and `addExecutorServiceMetrics(...)`.

## Reporting / exporting

`DefaultMetrics` ships with Dropwizard-backed reporters (each needs
`io.dropwizard.metrics:metrics-core` on the classpath):

```java
metrics.startConsoleReporter();           // every minute, to stdout
metrics.startSlf4jReporter();             // every minute, via SLF4J
metrics.startCsvReporter("./metrics");    // every second, to .csv files in a directory
```

For push/pull backends, give `DefaultMetrics` any Micrometer `MeterRegistry` (add the matching
`micrometer-registry-*` dependency — e.g. JMX, New Relic, Datadog):

```java
// Example: expose metrics over JMX (needs io.micrometer:micrometer-registry-jmx)
MeterRegistry jmx = new JmxMeterRegistry(JmxConfig.DEFAULT, Clock.SYSTEM);
DefaultMetrics metrics = new DefaultMetrics(jmx);   // Datadog / New Relic registries plug in the same way
```

## Custom metrics

Reach the registry with `broker.getConfig().getMetrics()` and record your own measurements through the
`Metrics` interface — a counter, a gauge, and a stoppable timer:

```java
import java.time.Duration;
import services.moleculer.metrics.Metrics;
import services.moleculer.metrics.StoppableTimer;

Metrics metrics = broker.getConfig().getMetrics();

// counter (name, description, delta, optional tags...)
metrics.increment("my.orders.total", "Number of orders", 1, "channel", "web");

// gauge (name, description, value, optional tags...)
metrics.set("my.queue.size", "Pending items", queue.size());

// timer — call stop() when the work finishes
StoppableTimer timer = metrics.timer("my.job.time", "Job duration", Duration.ofMinutes(5));
try {
    doWork();
} finally {
    timer.stop();
}
```

## Tracing

There is **no native distributed tracing** in moleculer-java: no built-in tracer, and no Jaeger,
Zipkin or OpenTelemetry exporter. If you need traces, choose one of these:

- **Propagate context yourself.** Every `Context` already carries `requestID` (stable across the whole
  call chain), `parentID`, the call `level`, and a per-call `id`. Pass a trace/span id through `meta`
  (which rides along across language boundaries — see
  [Metadata](interop-data-types.html#metadata)) and stitch the spans together in your backend.
- **Instrument at the application layer.** Wrap actions in a [`Middleware`](middlewares.html) that
  starts and stops spans with an external tracer (e.g. an OpenTelemetry or Micrometer-Tracing SDK), or
  rely on your APM agent's bytecode instrumentation. The `requestID`/`parentID`/`level` fields give you
  the parent-child links to build a trace.

> In a hybrid cluster, only the **metadata** travels between languages, not a trace context object —
> agree on a `meta` key (e.g. `traceId`) on both the Java and Node.js sides if you correlate across the
> boundary.
