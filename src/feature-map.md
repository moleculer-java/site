# Node.js → Java feature map

You know Node.js Moleculer; this page maps what you already do to its Java equivalent — including the
honest **"there is no equivalent"** entries, so you stop searching for features that were intentionally
left out. Each row links to the page with the details.

> The wire protocol, addressing (`service.action`), transporters, serializers, cachers and balancing
> strategies are the **same** on both sides — that is what lets a Java and a Node.js node share one
> cluster. The differences below are all on the **programming-model** side, inside a single node.

## Defining a service

| Node.js | Java | Notes |
|---|---|---|
| `module.exports = { name: "math", actions: {...} }` | `@Name("math") public class MathService extends Service { ... }` | A class, not a schema object. [Services](services.html) |
| `actions: { add(ctx) { ... } }` | `public Action add = ctx -> { ... };` | An action is a **`public` instance field** (a lambda), never `static`. [Services](services.html) |
| `methods: { helper() {} }` | a plain Java method on the class | No special `methods` block. |
| `settings: { ... }` / `this.settings` | plain fields on the class; broker-wide options via `ServiceBrokerConfig` | No `settings` object. [Broker](broker.html#configuration-options) |
| `metadata: { ... }` | annotations on the class/action (read as a `Tree` in middleware) | [Middlewares](middlewares.html) |
| **mixins** (e.g. the gateway is a mixin) | ✗ none — use normal **inheritance** or shared helper classes | Composition is plain Java. |
| `created()` / `merged()` | ✗ none — use the **constructor** | [Lifecycle](lifecycle.html) |
| `started()` / `stopped()` | `started(ServiceBroker broker)` / `stopped()` | Call `super.started(broker)`. [Lifecycle](lifecycle.html#service-lifecycle) |
| action `hooks` (before/after/error) | a **`Middleware`** that wraps the `Action` | One mechanism for all three. [Middlewares](middlewares.html) |
| action `visibility: "published"/"public"/"protected"/"private"` | field visibility: **`public` = published** to the cluster; private → `protected` (local-only) | [Services](services.html) |
| declarative `params` validation (`fastest-validator`) | ✗ none — validate `ctx.params` manually or in a `Middleware` | [Validating parameters](actions.html#validating-parameters) |

## Data & async

| Node.js | Java | Notes |
|---|---|---|
| a JavaScript object (`ctx.params`, payloads) | an **`io.datatree.Tree`** | The one data type. [Tree quick reference](tree.html) |
| `ctx.params.a` | `ctx.params.get("a", default)` | Typed getter with a default. [Tree](tree.html) |
| `ctx.meta` | `ctx.params.getMeta()` (also `ctx.meta`) | [Metadata](interop-data-types.html#metadata) |
| `Promise` / `.then()` / `.catch()` | `io.datatree.Promise` / `.then()` / **`.catchError()`** | ES6-style, **not** `java.util.concurrent`. [Concepts](concepts.html#non-blocking-json-processing) |
| `async` / `await` | `.then(...)` chaining, or `.waitFor(ms)` to block | `waitFor` is the blocking form of `await`. |
| share a variable across `.then()` blocks | write into a `final` container (`Tree`, `AtomicReference`, 1-element array) | A correctness rule. [Concepts](concepts.html#non-blocking-json-processing) |
| `Promise.all([...])` | `Promise.all(...)` | Same idea. |
| streams | `PacketStream` (`broker.createStream()`) | [Streaming](actions.html#streaming) |

## Calling actions & events

| Node.js | Java | Notes |
|---|---|---|
| `broker.call("svc.action", { a: 1 })` | `broker.call("svc.action", params)` **or** `broker.call("svc.action", "a", 1)` | Object **or** key–value varargs. [Calling actions](actions.html#calling-actions) |
| call options `{ timeout, retries, fallbackResponse }` | `CallOptions.timeout(long).retryCount(int)` | `timeout`+`retryCount` only — **no `fallbackResponse`**. [Call options](actions.html#call-options) |
| `mcall([...])` | `Promise.all(call1, call2, ...)` | No `mcall`; combine promises. |
| `ctx.emit` / `ctx.broadcast` | `ctx.emit` / `ctx.broadcast`; `broker.emit/broadcast/broadcastLocal` | [Events](events.html) |
| `$node.list/services/actions/events/health` | same names | [Internal services](internal-services.html) |
| `$node.metrics` / `$node.options` (actions) | ✗ none | No `$node.metrics` *action* — but metrics **do** exist (Micrometer); see Tooling & runtime below. |

## Fault tolerance

| Node.js | Java | Notes |
|---|---|---|
| Circuit Breaker | ✓ | [Fault tolerance](fault-tolerance.html) |
| Retry | ✓ `CallOptions.retryCount(int)` | |
| Timeout | ✓ `CallOptions.timeout(long)` | milliseconds |
| **Bulkhead** | ✗ none — limit concurrency yourself | [Fault tolerance](fault-tolerance.html#fault-tolerance-features-and-what-differs-from-node-js) |
| **Fallback** (`fallbackResponse`) | ✗ none — handle it with `.catchError(...)` on the caller | |

## Tooling & runtime

| Node.js | Java | Notes |
|---|---|---|
| `broker.logger` | **SLF4J** (a facade + a binding you pick) | [Logging](logging.html) |
| `moleculer-runner` (config-driven loader, `--hot`) | the Java **"Runner"** is a different thing — a Spring app start/stop/install helper | ⚠️ Not the same. [Runner](runner.html) |
| `broker.loadServices("./services")` | ✗ none — register with `broker.createService(...)` | |
| `--hot` hot reload | ✗ none — restart the broker | |
| cachers, transporters, serializers, strategies | the same set, Node-compatible | [Caching](caching.html) · [Transporters](transporters.html) · [Serializers](serializers.html) |
| **Metrics** (`metrics: { enabled }`) | ✓ **Micrometer**-based — off until `metricsEnabled(true)` | [Metrics & tracing](metrics.html) |
| built-in **tracing** (`tracing`, Jaeger/Zipkin) | ✗ none — propagate via `meta`, or use an external APM | [Metrics & tracing](metrics.html#tracing) |
| **`moleculer-db`** / **`moleculer-io`** (ecosystem) | ✗ no general port — `moleculer-java-mongo` (DB), Web WebSocket (io) | [MongoDB](mongo-client.html) · [WebSocket](web-websocket.html) |

---

New here? The shortest path from this map to a running node is the
**[Minimal Java service for Node.js developers](minimal-service.html)** — one class, one action, NATS,
called from your existing Node.js system.
