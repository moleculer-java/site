# Data types & features across the wire

This is the reference for **what crosses the Java ↔ Node.js boundary intact**, and how each capability
looks in both languages. Every example is trimmed from a runnable, test-verified integration demo, so
the shapes shown here are exactly what survives the round trip.

On the wire there is just JSON, so the rule is simple: **stick to JSON-safe values** and everything —
primitives, arrays, nested objects, events, cached results, metadata — round-trips identically. Binary
data travels on a separate streaming channel.

On the Java side these values are built and read through the `io.datatree.Tree` API, the equivalent of a
JavaScript object (see [the DataTree API](concepts.html#datatree-api-for-javascript-objects)).

::: warning AVOID NON-JSON TYPES
Do **not** put language-specific values — JavaScript `Date`, `Map`, `Set`, `BigInt`, `Buffer`, or Java
`Date`/`byte[]` — inside action params or responses. The native JSON serializer used on both sides
cannot represent them identically, so they would not survive the round trip. For binary data, use
[Binary streaming](#binary-streaming) instead of embedding bytes in JSON.
:::

| Capability | Crosses intact | Section |
|---|:---:|---|
| Primitives (int, large int, double, boolean, string, null) | ✓ | [Primitives](#primitives) |
| Arrays / lists (incl. nested) | ✓ | [Lists](#lists-arrays) |
| Objects / maps (nested) | ✓ | [Maps](#maps-nested-objects) |
| Deeply nested, life-like structures | ✓ | [Complex structures](#complex-nested-structures) |
| Events (`emit` and `broadcast`) | ✓ | [Events](#events) |
| Cached action results (with TTL) | ✓ | [Caching](#caching-with-ttl) |
| Request/response metadata | ✓ | [Metadata](#metadata) |
| Errors & exceptions (typed, structured) | ✓ | [Errors & exceptions](#errors-exceptions) |
| Binary data | ✓ (streaming) | [Binary streaming](#binary-streaming) |

## Primitives

Every JSON-safe primitive comes back with the same type and value. Note that large integers are safe up
to JavaScript's `Number.MAX_SAFE_INTEGER` (`9007199254740991`), and `null` is a real JSON null on both
sides.

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
getPrimitives(ctx) {
    return {
        i: 42,                 // int
        big: 9007199254740991, // large integer (Number.MAX_SAFE_INTEGER)
        d: 3.5,                // double
        b: true,               // boolean
        s: "hello",            // string
        n: null                // real JSON null
    };
}
```
:::

::: tab Java
```java
public Action getPrimitives = ctx -> {
    Tree out = new Tree();
    out.put("i", 42);                  // int
    out.put("big", 9007199254740991L); // large integer (Number.MAX_SAFE_INTEGER)
    out.put("d", 3.5);                 // double
    out.put("b", true);                // boolean
    out.put("s", "hello");             // string
    out.putObject("n", null);          // real JSON null
    return out;
};
```
:::

::::

## Lists (arrays)

A list — including lists of objects with their own nested arrays — round-trips as a JSON array. In Java
you build it with `putList(...)` / `addMap()`; a caller reads it back as an array.

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
getList(ctx) {
    return [
        { id: 1, name: "Ada", roles: ["admin", "dev"] },
        { id: 2, name: "Linus", roles: ["dev"] }
    ];
}
```
:::

::: tab Java
```java
public Action getList = ctx -> {
    Tree root = new Tree();
    Tree list = root.putList("list");

    Tree ada = list.addMap();
    ada.put("id", 1);
    ada.put("name", "Ada");
    ada.putList("roles").add("admin").add("dev");

    Tree linus = list.addMap();
    linus.put("id", 2);
    linus.put("name", "Linus");
    linus.putList("roles").add("dev");

    return list; // serialized as a JSON array
};
```
:::

::::

## Maps (nested objects)

Nested keys and values survive unchanged. `putMap(...)` on the Java side is the equivalent of a nested
JavaScript object.

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
getMap(ctx) {
    return {
        server: { lang: "node", version: process.versions.node },
        counts: { users: 2, active: 1 },
        enabled: true
    };
}
```
:::

::: tab Java
```java
public Action getMap = ctx -> {
    Tree root = new Tree();

    Tree server = root.putMap("server");
    server.put("lang", "java");
    server.put("version", System.getProperty("java.specification.version", "21"));

    Tree counts = root.putMap("counts");
    counts.put("users", 2);
    counts.put("active", 1);

    root.put("enabled", true);
    return root;
};
```
:::

::::

## Deep echo

The strongest single proof that structured data crosses intact: an `echo` action that returns its input
unchanged. A caller sends a rich nested object and gets back a deep-equal copy.

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
// The service simply returns what it received
echo(ctx) {
    return ctx.params;
}

// A caller sends a rich nested object and gets back a deep-equal copy
const sent = {
    msg: "ping", when: 123, ok: true, nada: null,
    nums: [1, 2, 3],
    items: [ { id: 1, tags: ["x", "y"] }, { id: 2, tags: [] } ],
    nested: { a: { b: { c: "deep" } } }
};
const received = await broker.call("dataJava.echo", sent);
// received deep-equals sent
```
:::

::: tab Java
```java
// The service simply returns what it received
public Action echo = ctx -> ctx.params;

// A caller sends a rich nested object and gets back a deep-equal copy
Tree received = broker.call("dataNode.echo", sent).waitFor(5000);
// received deep-equals sent
```
:::

::::

## Complex nested structures

A life-like object — a list of users, each with a nested `address` (holding a `geo` sub-object), arrays
of strings (`emails`, `roles`) and an array of objects (`phones`) — crosses with full deep equality. This
is also the clearest side-by-side of the `Tree` API and a JavaScript object (one user shown; the demo
sends two).

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
getUsers(ctx) {
    return {
        users: [
            {
                id: 1,
                name: "Ada Lovelace",
                active: true,
                address: {
                    street: "12 Analytical Ave",
                    city: "London",
                    geo: { lat: 51.5074, lng: -0.1278 }
                },
                emails: ["ada@analytical.io", "lovelace@maths.org"],
                roles: ["admin", "author"],
                phones: [
                    { type: "home", number: "+44-20-7946-0001" }
                ]
            }
        ]
    };
}
```
:::

::: tab Java
```java
public Action getUsers = ctx -> {
    Tree root = new Tree();
    Tree users = root.putList("users");

    Tree ada = users.addMap();
    ada.put("id", 1);
    ada.put("name", "Ada Lovelace");
    ada.put("active", true);

    Tree address = ada.putMap("address");   // nested object
    address.put("street", "12 Analytical Ave");
    address.put("city", "London");
    Tree geo = address.putMap("geo");        // object nested inside an object
    geo.put("lat", 51.5074);
    geo.put("lng", -0.1278);

    ada.putList("emails").add("ada@analytical.io").add("lovelace@maths.org");
    ada.putList("roles").add("admin").add("author");

    Tree phones = ada.putList("phones");     // array of objects
    phones.addMap().put("type", "home").put("number", "+44-20-7946-0001");

    return root; // { users: [ { ... } ] }
};
```
:::

::::

## Events

Events cross the language boundary too, and the two delivery modes behave the same way across languages:

- **`emit`** is load-balanced — one listener *per group* receives the event.
- **`broadcast`** is delivered to *every* listener on *every* node.

A service subscribes with an event listener; any node sends with `emit` or `broadcast`. (For listener
groups, see [Events](events.html#types-of-event-broadcasts).)

**Subscribing:**

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
events: {
    "demo.emit.fromJava"(ctx) {
        // load-balanced: one listener per group receives this
        this.lastEmit = ctx.params;
    },
    "demo.broadcast.fromJava"(ctx) {
        // every listener on every node receives this
        this.lastBroadcast = ctx.params;
    }
}
```
:::

::: tab Java
```java
@Subscribe("demo.emit.fromNode")
public Listener onEmit = ctx -> {
    // load-balanced: one listener per group receives this
    lastEmit = ctx.params;
};

@Subscribe("demo.broadcast.fromNode")
public Listener onBroadcast = ctx -> {
    // every listener on every node receives this
    lastBroadcast = ctx.params;
};
```
:::

::::

**Sending:**

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
await broker.emit("demo.emit.fromNode", { via: "emit", n: 10 });
await broker.broadcast("demo.broadcast.fromNode", { via: "broadcast", n: 11 });
```
:::

::: tab Java
```java
Tree emitPayload = new Tree();
emitPayload.put("via", "emit");
emitPayload.put("n", 10);
broker.emit("demo.emit.fromJava", emitPayload);

Tree bcastPayload = new Tree();
bcastPayload.put("via", "broadcast");
bcastPayload.put("n", 11);
broker.broadcast("demo.broadcast.fromJava", bcastPayload);
```
:::

::::

## Caching with TTL

Caching happens on the node that **owns** the action, so a remote caller in the other language benefits
from the cache too. The result is cached by the listed key(s) for `ttl` seconds: two calls with the same
key within the TTL return the cached value (the body does not run again), a different key is a different
cache entry, and after the TTL the entry is evicted and the body runs again. (See
[Caching](caching.html#caching-action-calls) for cacher options.)

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
getCachedSeq: {
    cache: { keys: ["id"], ttl: 2 },
    handler(ctx) {
        return { id: ctx.params.id, seq: ++this.cacheSeq };
    }
}
```
:::

::: tab Java
```java
@Cache(keys = { "id" }, ttl = 2)
public Action getCachedSeq = ctx -> {
    Tree out = new Tree();
    out.put("id", ctx.params.get("id", 0));
    out.put("seq", cacheSeq.incrementAndGet());
    return out;
};
```
:::

::::

## Metadata

Metadata is the one wire field with **two APIs**. It rides alongside the params and is merged back into
the caller with the response — but you reach it differently in each language:

- **Node.js:** `ctx.meta`
- **Java:** `ctx.params.getMeta()`

Both serialize to the request's top-level `meta` field, so they are fully interchangeable. Keep meta
values JSON-safe.

**Reading and answering metadata in a service:**

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
echoMeta(ctx) {
    const received = Object.assign({}, ctx.meta); // read incoming metadata
    ctx.meta.seenBy = "node";                      // merged back into the caller
    return { receivedMeta: received };
}
```
:::

::: tab Java
```java
public Action echoMeta = ctx -> {
    Tree meta = ctx.params.getMeta();              // read incoming metadata
    Tree out = new Tree();
    out.putMap("receivedMeta").copyFrom(meta);
    meta.put("seenBy", "java");                    // merged back into the caller's context
    return out;
};
```
:::

::::

**Sending metadata on a call, and reading what came back:**

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
const meta = { tenant: "acme" };
const rsp = await broker.call("dataJava.echoMeta", null, { meta });
meta.seenBy; // "java" — the response meta was merged back into your meta object
```
:::

::: tab Java
```java
Tree params = new Tree();
params.getMeta().put("tenant", "acme");
Tree rsp = broker.call("dataNode.echoMeta", params).waitFor(5000);
String seenBy = rsp.getMeta().get("seenBy", ""); // "node" — response meta merged back
```
:::

::::

The most common real use is **one-directional**: a caller passes cross-cutting context (tenant, auth
token, locale) in `meta` — never in `params` — and the remote service only *reads* it. Here a Node.js
caller scopes a Java service by tenant:

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
// cross-cutting context travels in meta, not in the params object
await broker.call("billing.createInvoice", { amount: 100 }, { meta: { tenant: "acme" } });
```
:::

::: tab Java
```java
// the Java service reads it from the call context and scopes its work
public Action createInvoice = ctx -> {
    String tenant = ctx.params.getMeta().get("tenant", (String) null);
    if (tenant == null) {
        throw new ValidationError("Missing 'tenant' in meta", "java-node", "TENANT_MISSING");
    }
    // ... use 'tenant' to choose the datasource / schema, then return a result ...
    return new Tree().put("ok", true);
};
```
:::

::::

## Errors & exceptions

An error is **not** just a string on the wire — it crosses as a structured object, so the calling side
in the other language gets a typed exception with the same fields, not a flattened message. When a Java
action throws (or a `Promise` rejects), moleculer-java serializes the error into the response packet;
the Node.js caller receives a Moleculer error with the matching properties, and vice versa.

These are the fields that travel (the Java classes live in `services.moleculer.error`):

| Wire field | Node.js (`err.…`) | Java (`MoleculerError`) | Meaning |
|---|---|---|---|
| `name` | `err.name` | `getName()` | The error **class** — the cross-language discriminator used to rebuild the right type. |
| `message` | `err.message` | `getMessage()` | Human-readable message. |
| `code` | `err.code` | `getCode()` | HTTP-like status code (e.g. `422`, `500`). |
| `type` | `err.type` | `getType()` | Machine-readable type string **you choose** (e.g. `"TENANT_MISSING"`). |
| `data` | `err.data` | `getData()` → `Tree` | Arbitrary JSON detail payload. |
| `retryable` | `err.retryable` | `isRetryable()` | Whether the caller's retry logic may retry the call. |
| `nodeID` | `err.nodeID` | originating node id | Which node produced the error. |
| `stack` | `err.stack` | `getStack()` | Stack trace, as a string. |

**Java throws → Node.js catches.** The Java side throws a typed error; the Node.js caller reads the
same fields back:

:::: tabs :options="{ useUrlFragment: false }"

::: tab Java
```java
// services.moleculer.error.ValidationError — code is fixed to 422
public Action checkout = ctx -> {
    if (ctx.params.getMeta().get("tenant", (String) null) == null) {
        // (message, nodeID, type, then key/value data pairs)
        throw new ValidationError("Missing 'tenant' in meta", "java-node", "TENANT_MISSING",
                "field", "tenant");
    }
    // ... normal result ...
    return new Tree().put("ok", true);
};
```
:::

::: tab "Node.js (JavaScript)"
```js
try {
    await broker.call("dataJava.checkout", { item: "book" });
} catch (err) {
    err.name;      // "ValidationError"
    err.message;   // "Missing 'tenant' in meta"
    err.code;      // 422
    err.type;      // "TENANT_MISSING"
    err.data;      // { field: "tenant" }
    err.retryable; // false
    err.nodeID;    // "java-node"
}
```
:::

::::

**Node.js throws → Java catches.** A built-in Node.js Moleculer error is rebuilt as the matching Java
class on arrival:

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
const { MoleculerClientError } = require("moleculer").Errors;

checkout(ctx) {
    if (!ctx.meta.tenant) {
        // (message, code, type, data)
        throw new MoleculerClientError("Missing tenant", 422, "TENANT_MISSING", { field: "tenant" });
    }
    return { ok: true };
}
```
:::

::: tab Java
```java
// services.moleculer.error.MoleculerClientError, rebuilt from the wire "name"
broker.call("dataNode.checkout", params).then(rsp -> {
    // success
    return rsp;
}).catchError(err -> {
    if (err instanceof MoleculerClientError) {
        MoleculerError e = (MoleculerError) err;
        e.getMessage();   // "Missing tenant"
        e.getCode();      // 422
        e.getType();      // "TENANT_MISSING"
        e.getData();      // { "field": "tenant" } as a Tree
        e.isRetryable();  // false
    }
    return null;
});
// The blocking form (.waitFor(...)) throws the same exception instead of returning.
```
:::

::::

A few rules that are pure protocol behavior — you cannot guess them, so rely on them:

- **`name` is the discriminator.** moleculer-java maps a known `name` back to the matching Java class
  (`MoleculerError`, `MoleculerRetryableError`, `MoleculerServerError`, `MoleculerClientError`,
  `ValidationError` (422), `ServiceNotFoundError`, `RequestTimeoutError`, …). An **unknown** `name`
  (e.g. a custom Node.js error class) arrives as a **generic `MoleculerError`** that still carries all
  the fields above. Node.js applies the same fall-back in the other direction.
- **A plain Java exception is auto-wrapped.** If something that is *not* a `MoleculerError` escapes an
  action, moleculer-java wraps it as a generic `MoleculerError` (`name` `"MoleculerError"`, `code`
  `500`, `type` `"UNKNOWN_ERROR"`, `retryable` `false`) before sending — the other side never receives a
  raw Java stack, always the structured shape.
- **`retryable` drives retries.** The caller's retry logic (see
  [Fault tolerance](fault-tolerance.html) and `CallOptions.retryCount`) only retries calls that failed
  with a `retryable = true` error; throw a `MoleculerRetryableError` (or set `retryable`) when a retry
  could succeed.

## Binary streaming

Binary data does **not** travel as JSON params — it travels on Moleculer's **streaming channel**. A
streamed request opens with **empty params**; any side-data (such as a filename) must travel in `meta`,
never in `params`, or the receiver would treat the first packet as stream content.

**Receiving a stream** (an action that consumes incoming bytes):

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
receiveStream(ctx) {
    if (!ctx.stream) {
        return { bytes: 0, sha256: crypto.createHash("sha256").digest("hex") };
    }
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash("sha256");
        let bytes = 0;
        ctx.stream.on("data", chunk => { bytes += chunk.length; hash.update(chunk); });
        ctx.stream.on("end", () => resolve({ bytes, sha256: hash.digest("hex") }));
        ctx.stream.on("error", reject);
    });
}
```
:::

::: tab Java
```java
public Action receiveStream = ctx -> {
    if (ctx.stream == null) {
        return digestResult(0L, emptySha256());
    }
    return new Promise(res -> {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        AtomicLong byteCount = new AtomicLong();
        ctx.stream.onPacket((bytes, cause, close) -> {
            if (bytes != null) {
                md.update(bytes);
                byteCount.addAndGet(bytes.length);
            }
            if (cause != null) {
                res.reject(cause);
            } else if (close) {
                res.resolve(digestResult(byteCount.get(),
                        HexFormat.of().formatHex(md.digest())));
            }
        });
    });
};
```
:::

::::

**Sending a stream** (the caller opens a stream and pushes bytes; note: stream only, no params):

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
const ack = await broker.call("dataJava.receiveStream", null, {
    stream: bufferToStream(buffer),
    timeout: streamTimeout
}); // -> { bytes, sha256 }
```
:::

::: tab Java
```java
PacketStream out = broker.createStream();
Promise ackPromise = broker.call("dataNode.receiveStream", out); // stream only, no params
out.transferFrom(new ByteArrayInputStream(bytes));               // chunked send, auto-closes
Tree ack = ackPromise.waitFor(streamTimeout);                    // { bytes, sha256 }
```
:::

::::

**Producing a stream** (an action that returns bytes for the caller to download):

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Node.js (JavaScript)"
```js
produceStream(ctx) {
    // returning a Readable makes Moleculer stream the response back chunk-by-chunk
    return bufferToStream(buf);
}
```
:::

::: tab Java
```java
public Action produceStream = ctx -> {
    PacketStream stream = ctx.createStream();
    stream.transferFrom(new ByteArrayInputStream(content));
    return stream; // returning a PacketStream streams the response back chunk-by-chunk
};
```
:::

::::

## See also

- **[Call Java from Node.js](call-java-from-node.html)** and
  **[Call Node.js from Java](call-node-from-java.html)** — the two directional guides.
- **[Moleculer concepts](concepts.html#datatree-api-for-javascript-objects)** — the `Tree` API in depth.

> Every snippet on this page is trimmed from a runnable, test-verified integration demo where a Java node
> and a Node.js node exchange exactly these shapes and assert they arrive intact in both directions.
