# The `Tree` type — a quick reference for Node.js developers

In Node.js Moleculer every payload is a plain JavaScript object: `ctx.params`, the value a `Promise`
resolves to, the request `meta`, an event's payload. Java has no dynamic JSON object, so Moleculer
for Java uses **one** type in all of those places: **`io.datatree.Tree`**.

> **Wherever your Node.js code would see a JavaScript object, your Java code sees a `Tree`.**

This page is the cheat sheet. The [Moleculer concepts](concepts.html#datatree-api-for-javascript-objects)
chapter tells the longer story, and the [DataTree library docs](https://berkesa.github.io/datatree/introduction.html)
document the full API (cloning, merging, JSON path, type conversion, 18 JSON backends).

## Mental model

| JavaScript object | Java `Tree` |
|---|---|
| `const o = {};` | `Tree o = new Tree();` |
| `o.a = 5;` | `o.put("a", 5);` |
| `o.a` | `o.get("a", 0)` (with a default) — or `o.get("a")` (a child `Tree`, or `null`) |
| `o.user.name` | `o.get("user.name", "")` (JSON path) |
| `o.list = [1, 2, 3];` | `o.putList("list").add(1).add(2).add(3);` |
| `o.child = {};` | `Tree child = o.putMap("child");` |
| `o.arr.push({ ... })` | `o.putList("arr").addMap()` (append a new object, returns it) |
| `for (const x of o.arr)` | `for (Tree x : o.get("arr"))` |
| `Object.keys(o).length` | `o.size()` |
| `"a" in o` | `o.get("a") != null` |
| `JSON.stringify(o, null, 2)` | `o.toString()` (pretty) — `o.toString(false)` (compact) |

## Reading values — ask for the type you want

`ctx.params` is statically typed JSON, so each getter takes a **default** that is returned when the
key is missing or not convertible. This replaces the JavaScript habit of reading `ctx.params.a`
directly:

```java
String  name   = ctx.params.get("name", "anonymous");
int     age    = ctx.params.get("age", 0);
long    millis = ctx.params.get("ts", 0L);
boolean vip    = ctx.params.get("vip", false);
double  score  = ctx.params.get("score", 0d);
```

Without a default you get the child node itself — useful for presence checks and explicit conversion:

```java
Tree a = ctx.params.get("a");   // null when the key is absent
if (a == null) {
    // missing
}
int value = a.asInteger();      // also: asString(), asLong(), asBoolean(), asDouble()...
```

## Building a response

An `Action` returns a `Tree` (or a primitive, which Moleculer wraps for you):

```java
Tree out = new Tree();
out.put("ok", true);
out.putList("items").add("a").add("b");
Tree user = out.putMap("user");
user.put("name", "Alice");
return out;
// -> { "ok": true, "items": ["a", "b"], "user": { "name": "Alice" } }
```

## Metadata

The request metadata (`ctx.meta` in Node.js) travels alongside the params; reach it with `getMeta()`:

```java
Tree meta = ctx.params.getMeta();      // the "meta" block of the request
String lang = meta.get("lang", "en");
```

See [Data types & features](interop-data-types.html#metadata) for how metadata crosses the wire.

## Keep it JSON-safe

Across the language boundary, stick to JSON types — objects/maps, arrays/lists, numbers, strings,
booleans and `null` — and everything round-trips intact. `java.util.Date`, POJOs and other Java-only
types do **not** survive as themselves on the Node.js side; see
[Data types & features](interop-data-types.html) for the full compatibility reference.
