## About data serialization

[Transporter](transporters.html#types-of-transporters)
needs a `Serializer` Module which serializes & deserializes the transferable data.
The default `Serializer` is the `JsonSerializer` but there are several built-in `Serializers`
can convert messages into MessagePack, BSON, CBOR, SMILE, Amazon ION or other binary formats.

::: warning Cross-language clusters: only JSON and MessagePack interoperate
A Java node and a **Node.js** node can understand each other only with the **`JsonSerializer`**
(the default) or the **`MsgPackSerializer`** — these are the only two formats the Node.js
implementation also speaks. Every binary serializer below (**BSON, CBOR, Amazon ION, SMILE** and the
Java-object serializer) is **Java-only**. Both nodes in a cluster must use the **same** serializer, so
if you pick one of the Java-only formats for performance, a Node.js node will **silently** fail to
decode every packet — there is no error, the two nodes simply never see each other. The cross-language
common denominator is **JSON** (or MessagePack).
:::

## JSON Serializer

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
This is the built-in default `Serializer`.
It serializes the packets to JSON string and deserializes the received JSON bytes to
[Tree](https://berkesa.github.io/datatree/introduction.html) objects.
The performance of JSON `Serializers` in Java and JavaScript is very good,
JSON serialization is usually faster than most binary `Serializers`.
This `Serializer` is compatible with the JavaScript/Node.js version of Moleculer.

```java
NatsTransporter transporter = new NatsTransporter("nats://nats.server:4222");

// Do not have to set it because this is the default
transporter.setSerializer(new JsonSerializer());

ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .readers("jackson,gson")
                                    .writers("jackson,gson")
                                    .build();
```

The "readers" and "writers" parameters are used to specify the JSON API
to be used by Moleculer for deserialization / serialization.
This is important if you have multiple JSON implementations on the classpath.
Several implementations can be specified in order of importance, separated by commas.
If not specified, `ServiceBroker` will automatically try to choose the fastest JSON API.
The values of the "readers" and "writers" parameters are listed below:

| Reader/writer ID | JSON API and Dependency |
| ---------------- | ----------------------- |
| "bson"    | [BSON (MongoDB)](https://mvnrepository.com/artifact/org.mongodb/bson) |
| "dsl"     | [DSLJson](https://mvnrepository.com/artifact/com.dslplatform/dsl-json) |
| "genson"  | [Genson](https://mvnrepository.com/artifact/com.owlike/genson) |
| "gson"    | [Google Gson](https://mvnrepository.com/artifact/com.google.code.gson/gson) |
| "jackson" | [Jackson JSON](https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind) |
| "jodd"    | [Jodd Json](https://mvnrepository.com/artifact/org.jodd/jodd-json) |
| "johnzon" | [Apache Johnzon](https://mvnrepository.com/artifact/org.apache.johnzon/johnzon-mapper) |
| "jsonio"  | [JsonIO](https://mvnrepository.com/artifact/com.cedarsoftware/json-io) |
| "nano"    | [NanoJson](https://mvnrepository.com/artifact/com.grack/nanojson) |
| "smart"   | [Json-smart](https://mvnrepository.com/artifact/net.minidev/json-smart) |
| "ion"     | [Amazon Ion](https://mvnrepository.com/artifact/com.amazon.ion/ion-java) |
| "builtin" | Built-in JSON parser (no dependencies) |

So, for example, if you want to use a "Gson" implementation,
put the implementation reference in the "dependencies" block of the (build.gradle or pom.xml) build script,
then set "readers" and "writers" to "gson". To verify, type "info" command into the REPL console.
The "info" command will display the current Moleculer configuration, including the the JSON API which is in use.

## MessagePack Serializer

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
Built-in [MsgPack](https://msgpack.org) `Serializer`.
MessagePack is an efficient binary serialization format. It lets you exchange
data among multiple languages like JSON. But it's smaller. Small
integers are encoded into a single byte, and typical short strings require
only one extra byte in addition to the strings themselves. This `Serializer` is
compatible with the JavaScript version of Moleculer.
 
```java
transporter.setSerializer(new MsgPackSerializer());
```

::: warning MessagePack dependencies
To use MessagePack `Serializer`, add the following dependency to the build script:  
[group: 'org.msgpack', name: 'jackson-dataformat-msgpack', version: '0.9.12'](https://mvnrepository.com/artifact/org.msgpack/jackson-dataformat-msgpack)  
:::

## BSON Serializer

> **Java-only** — not compatible with the Node.js implementation; use it only in a Java-to-Java cluster.

Built-in [BSON](http://bsonspec.org/) `Serializer`.
BSON, short for Binary JSON, is a binary-encoded serialization of JSON-like documents.
Like JSON, BSON supports the embedding of documents and arrays within other documents and arrays. 
 
```java
transporter.setSerializer(new BsonSerializer());
```

::: warning BSON dependencies
To use BSON `Serializer`, add the following dependency to the build script:  
[group: 'de.undercouch', name: 'bson4jackson', version: '2.18.0'](https://mvnrepository.com/artifact/de.undercouch/bson4jackson)
:::

## CBOR Serializer

> **Java-only** — not compatible with the Node.js implementation; use it only in a Java-to-Java cluster.

Built-in [CBOR](https://cbor.io/) `Serializer`.
CBOR is based on the wildly successful JSON data model: numbers, strings,
arrays, maps (called objects in JSON), and a few values such as false, true,
and null.
 
```java
transporter.setSerializer(new CborSerializer());
```

::: warning CBOR dependencies
To use CBOR `Serializer`, add the following dependency to the build script:  
[group: 'com.fasterxml.jackson.dataformat', name: 'jackson-dataformat-cbor', version: '2.22.2'](https://mvnrepository.com/artifact/com.fasterxml.jackson.dataformat/jackson-dataformat-cbor)
:::

## Amazon ION Serializer

> **Java-only** — not compatible with the Node.js implementation; use it only in a Java-to-Java cluster.

Built-in [ION](http://amzn.github.io/ion-docs/) `Serializer`.
Amazon Ion is a richly-typed, self-describing, hierarchical data
serialization format offering interchangeable binary and text
representations. The binary representation is efficient to store, transmit,
and skip-scan parse.
 
```java
transporter.setSerializer(new IonSerializer());
```

::: warning Amazon ION dependencies
To use ION `Serializer`, add the following dependency to the build script:  
[group: 'com.amazon.ion', name: 'ion-java', version: '1.12.0'](https://mvnrepository.com/artifact/com.amazon.ion/ion-java)
:::

## SMILE Serializer

> **Java-only** — not compatible with the Node.js implementation; use it only in a Java-to-Java cluster.

Built-in [SMILE](https://en.wikipedia.org/wiki/Smile_(data_interchange_format)) `Serializer`.
SMILE is a computer data interchange format based on JSON. It can also be
considered as a binary serialization of generic JSON data model, which means
that tools that operate on JSON may be used with SMILE as well, as long as
proper encoder/decoder exists for tool to use. Compared to JSON, SMILE is
both more compact and more efficient to process.
 
```java
transporter.setSerializer(new SmileSerializer());
```

::: warning SMILE dependencies
To use SMILE `Serializer`, add the following dependency to the build script:  
[group: 'com.fasterxml.jackson.dataformat', name: 'jackson-dataformat-smile', version: '2.22.2'](https://mvnrepository.com/artifact/com.fasterxml.jackson.dataformat/jackson-dataformat-smile)
:::

## Custom Serializer

Custom `Serializer` module can be created.
To make your own `Serializer`, you need to derive it from the services.moleculer.serializer.`Serializer`
superclass, and implement the "write" and "read" methods.

**Create custom Serializer**

```java
public class CustomSerializer extends Serializer {

    // --- SERIALIZE TREE TO BYTE ARRAY ---

    public byte[] write(Tree value) throws Exception {
        Object content = value.asObject();
        // Write Java Object into byte array...
        // The "content" is "java.util.Map" or "java.util.List".
    }

    // --- DESERIALIZE BYTE ARRAY TO TREE ---

    public Tree read(byte[] source) throws Exception {
        Object content = // Read Java Object from "source"...
        return new CheckedTree(content);
    }

}
```

**Use custom Serializer**

```java
transporter.setSerializer(new CustomSerializer());
```

## Message-level encryption

The `BlockCipherSerializer` is capable of encrypting data packets using the specified algorithm.
You can give it a "parent" `Serializer`,
if not specified it uses JSON serialization before encryption.

```java{4-6}
BlockCipherSerializer serializer = new BlockCipherSerializer();

// Same as "aes-256-cbc" in Node.js
serializer.setAlgorithm("AES/CBC/PKCS5Padding"); // Algorithm
serializer.setPassword("12345678901234567890123456789012"); // 32 bytes of password
serializer.setIv("1234567890123456"); // 16 bytes of IV block - required for AES/CBC

// Create Transporter and Service Broker
Transporter transporter = new NatsTransporter("localhost");
transporter.setSerializer(serializer);
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("node1")
                                    .transporter(transporter)
                                    .build();
```

In Node.js-based Moleculer, code with similar functionality looks like this:

```js{5-7}
// JavaScript code
const broker = new ServiceBroker({
    transporter: "NATS",
    middlewares: [
        Middlewares.Transmit.Encryption("12345678901234567890123456789012", // Password
                                        "aes-256-cbc", // Algorithm
                                        "1234567890123456") // 16 bytes of IV block
    ]
});
```

::: tip 256-bit keys work out of the box on Java 17
Unlimited-strength cryptography has been enabled by default since Java 8u161 / Java 9, so on the
Java 17 baseline no JCE policy files are needed for AES-256. (On long-obsolete JREs you had to install
the *Unlimited Strength Jurisdiction Policy Files* by hand — that step is no longer required.)
:::

## Compressing messages

The `DeflaterSerializer` can compress messages larger than the specified size.
It can also have a "parent" `Serializer`,
if not specified it uses JSON serialization before compression.
 
```java{2}
Transporter transporter = new NatsTransporter("localhost");
transporter.setSerializer(new DeflaterSerializer(512));

// Create Service Broker
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("node1")
                                    .transporter(transporter)
                                    .build();
```

In Node.js-based Moleculer, code with similar functionality looks like this:

```js{4-5}
const broker = new ServiceBroker({
    transporter: "NATS",
    middlewares: [
        Middlewares.Transmit.Compression({ method: "deflateRaw",
                                           threshold: "512b" }),
    ]
});
```

::: warning
Using compression reduces performance, so use it only on slow networks.
:::

## Chaining Serializers

By chaining `Serializers`, you can combine multiple `Serializers`.
In the example below, the data is first serialized using the MessagePack algorithm.
Deflater then compresses large data packets (larger than 1024 bytes)
and then encrypts the compressed packet using the AES algorithm:

```java{4-6}
Transporter natsTransporter = new NatsTransporter("localhost");

// Create Serializer-chain
MsgPackSerializer msgPack = new MsgPackSerializer();
DeflaterSerializer deflater = new DeflaterSerializer(msgPack);
BlockCipherSerializer cipher = new BlockCipherSerializer(deflater, "1234567890123456");

// Set Serializer-chain to Transporter
natsTransporter.setSerializer(cipher);

// Create Service Broker
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("node1")
                                    .transporter(natsTransporter)
                                    .build();
```

**Double encryption**

Chaining allows multiple encryption methods to be applied to a data packet.
In the example below,
the data is first encrypted using the "ARCFOUR" and then the "Blowfish" algorithm:

```java{4-11}
// Create JSON Serializer
JsonSerializer jsonSerializer = new JsonSerializer();
        
// First cipher
BlockCipherSerializer first = new BlockCipherSerializer(jsonSerializer,
                                                        "password1",
                                                        "ARCFOUR");
// Second cipher
BlockCipherSerializer second = new BlockCipherSerializer(first,
                                                         "password2",
                                                         "Blowfish");

// Set Serializer-chain to Transporter
transporter.setSerializer(second);

// Create Service Broker
ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("node1")
                                    .transporter(transporter)
                                    .build();
```