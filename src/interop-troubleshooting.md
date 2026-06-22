# Interop troubleshooting — common problems

When a Java node and a Node.js node won't talk, it is almost always one of a handful of alignment
mistakes. These are the concrete interop failure modes (not generic Java tips), each with the symptom,
the cause, and the fix. For the settings themselves see **[Setup — one cluster](interop-setup.html)**.

## The Java node never appears in `$node.list` — first steps

This is the umbrella symptom. From the Node.js side run `await broker.call("$node.list")` (or the
`nodes` REPL command); from Java call `broker.call("$node.list")`. If the other language's node is
missing, walk these in order — they are listed most-common-first:

1. **Is the message bus actually up and reachable from *both* processes?** Start NATS
   (`docker run -p 4222:4222 nats`) and confirm both nodes use the *same* URL. A broker that can't reach
   its transporter logs a connection error but keeps running locally.
2. **Did you set a transporter at all on the Java side?** With none, the node is local-only (see below).
3. **Do the `namespace`, protocol version and serializer match?** A mismatch on any of these makes the
   packets invisible or undecodable — the node looks "up" to itself but is silent to the cluster.
4. **Are the `nodeID`s unique?** Two nodes with the same id corrupt discovery.

The four sections below expand each of these.

## No transporter set → the Java node runs local-only

**Symptom:** the Java process starts cleanly, its own actions work, but no Node.js node ever sees it
and it never shows up in `$node.list`.

**Cause:** if you never call `cfg.setTransporter(...)`, the broker's transporter is `null` by default
and the node starts in **local-only mode**. There is **no error and no warning** — it simply serves
only its in-process services. This is the single most common "why doesn't it work".

**Fix:** attach a transporter before `start()`:

```java
NatsTransporter nats = new NatsTransporter("nats://localhost:4222");
cfg.setTransporter(nats);   // without this line the node never joins the cluster
```

(The same applies in Node.js: a broker created with no `transporter` is isolated.)

## NATS (or other broker) not running / wrong URL

**Symptom:** one or both nodes log a connection/refused error on start, or reconnect loops; nothing
ever discovers anything.

**Cause:** the transporter can't reach the message bus — it isn't started, the port is wrong, or a
firewall/container boundary is in the way.

**Fix:** start the broker and use an identical URL on both sides:

```bash
docker run -p 4222:4222 nats
```

Both nodes must point at the same reachable address (`nats://localhost:4222` in these docs). Order does
not matter — each side can wait for the other's services with `waitForServices(...)`.

## Namespace mismatch

**Symptom:** both nodes are up, the bus is healthy, no errors anywhere — but the two nodes still don't
see each other.

**Cause:** the `namespace` is baked into the transporter's channel names (the channel prefix becomes
`MOL-<namespace>`). Nodes in different namespaces subscribe to different channels, so their packets
never reach one another. The default namespace is the empty string `""`.

**Fix:** give both nodes the **same** namespace (or leave both at the default):

```java
cfg.setNamespace("prod");   // must match the Node.js side: namespace: "prod"
```

## Protocol version mismatch (v4 vs v5) — silently dropped packets

**Symptom:** nodes seem connected (heartbeats, discovery) but requests/events are quietly ignored, or
discovery itself never completes.

**Cause:** a node **silently drops** packets whose `ver` field doesn't match its own protocol version.
moleculer-java 2.0.0 and Moleculer JS 0.15 both default to **v5**, so out of the box they match — but a
**legacy Moleculer JS 0.14** node speaks **v4**.

**Fix:** only when talking to a legacy 0.14 node, set the Java side to v4 (v4 and v5 are wire-compatible
for the JSON serializer):

```java
cfg.setProtocolVersion("4");   // ONLY for legacy Moleculer JS 0.14; otherwise leave the v5 default
```

## Serializer mismatch (cross-language only JSON / MessagePack)

**Symptom:** nodes discover each other, but calls fail to decode, return garbage, or throw
deserialization errors.

**Cause:** both nodes must use the **same** serializer, and across languages only **`JsonSerializer`**
(the default) and **`MsgPackSerializer`** are understood by the Node.js implementation. Choosing a
Java-only binary format (CBOR, BSON, Ion, Smile) for performance **silently** breaks interop.

**Fix:** use JSON (or MessagePack) on both sides. See
[Serializers](serializers.html#about-data-serialization).

## nodeID collision

**Symptom:** flaky discovery, nodes appearing/disappearing, calls routed to the wrong process.

**Cause:** every node in a cluster needs a unique `nodeID`; two processes sharing one id corrupt the
registry.

**Fix:** give each process its own id (`cfg.setNodeID("java-node")` vs `nodeID: "node-node"`).

## See also

- **[Setup — one cluster](interop-setup.html)** — the five things that must line up.
- **[Quick start](quickstart.html)** — a known-good runnable baseline to compare against.
- **[Serializers](serializers.html)** · **[Transporters](transporters.html)** — the cross-language
  compatibility details.
