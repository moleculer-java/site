title: Data Serializers
---

Transporter needs a Serializer Module which serializes & deserializes the transferable data.
The default Serializer is the `JsonSerializer` but there are several built-in Serializers
can convert messages into MessagePack, BSON, CBOR, SMILE, Amazon ION or other binary formats.

## JSON Serializer

This is the built-in default Serializer.
It serializes the packets to JSON string and deserializes the received JSON bytes to `Tree` objects.
The performance of JSON Serializers in Java and JavaScript is very good,
JSON serialization is usually faster than most binary Serializers.
This Serializer is compatible with the JavaScript/Go version of Moleculer.

```java
NatsTransporter transporter = new NatsTransporter("nats://nats.server:4222");

// Do not have to set it because this is the default
transporter.setSerializer(new JsonSerializer());

ServiceBroker broker = ServiceBroker.builder()
                                    .nodeID("server-1")
                                    .transporter(transporter)
                                    .readers("jackson,boon")
                                    .writers("jackson,fast")
                                    .build();
```

The `readers` and `writers` parameters are used to specify the JSON API
to be used by Moleculer for deserialization / serialization.
This is important if you have multiple JSON implementations on the classpath.
Several implementations can be specified in order of importance, separated by commas.
If not specified, ServiceBroker will automatically try to choose the fastest JSON API.
The values of the `readers` and `writers` parameters are listed below:

| Reader/writer ID | JSON API and Dependency |
| ---------------- | ----------------------- |
| "boon"    | [Boon JSON API](https://mvnrepository.com/artifact/io.fastjson/boon) |
| "bson"    | [BSON (MongoDB)](https://mvnrepository.com/artifact/org.mongodb/bson) |
| "dsl"     | [DSLJson](https://mvnrepository.com/artifact/com.dslplatform/dsl-json) |
| "fast"    | [FastJson](https://mvnrepository.com/artifact/com.alibaba/fastjson) |
| "flex"    | [Flexjson](https://mvnrepository.com/artifact/net.sf.flexjson/flexjson) |
| "genson"  | [Genson](https://mvnrepository.com/artifact/com.owlike/genson) |
| "gson"    | [Google Gson](https://mvnrepository.com/artifact/com.google.code.gson/gson) |
| "jackson" | [Jackson JSON](https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind) |
| "jodd"    | [Jodd Json](https://mvnrepository.com/artifact/org.jodd/jodd-json) |
| "johnzon" | [Apache Johnzon](https://mvnrepository.com/artifact/org.apache.johnzon/johnzon-normalMapper) |
| "jsonio"  | [JsonIO](https://mvnrepository.com/artifact/com.cedarsoftware/json-io) |
| "nano"    | [NanoJson](https://mvnrepository.com/artifact/com.grack/nanojson) |
| "simple"  | [JSON.simple](https://mvnrepository.com/artifact/com.googlecode.json-simple/json-simple) |
| "smart"   | [Json-smart](https://mvnrepository.com/artifact/net.minidev/json-smart) |
| "sojo"    | [SOJO](https://mvnrepository.com/artifact/net.sf.sojo/sojo) |
| "util"    | [JsonUtil](https://mvnrepository.com/artifact/org.kopitubruk.util/JSONUtil) |
| "ion"     | [Amazon Ion](https://mvnrepository.com/artifact/software.amazon.ion/ion-java) |
| "builtin" | Built-in JSON parser (no dependencies) |

So, for example, if you want to use a "FastJSON" implementation,
put the implementation reference in the "dependencies" block of the (build.gradle or pom.xml) build script,
then set `readers` and `writers` to "fast". To verify, type "info" command into the REPL console.
The "info" command will display the current Moleculer configuration, including the the JSON API which is in use.

## MessagePack Serializer

Built-in [MsgPack](https://msgpack.org) Serializer.
MessagePack is an efficient binary serialization format. It lets you exchange
data among multiple languages like JSON. But it's smaller. Small
integers are encoded into a single byte, and typical short strings require
only one extra byte in addition to the strings themselves. This Serializer is
compatible with the JavaScript version of Moleculer.
 
```java
transporter.setSerializer(new MsgPackSerializer());
```

{% note info Dependencies %}
To use MessagePack Serializer, add the following dependency to the build script:  
group: 'org.msgpack', name: 'msgpack', version: '0.6.12'
{% endnote %}

## BSON Serializer

Built-in [BSON](http://bsonspec.org/) Serializer.
BSON, short for Binary JSON, is a binary-encoded serialization of JSON-like documents.
Like JSON, BSON supports the embedding of documents and arrays within other documents and arrays. 
 
```java
transporter.setSerializer(new BsonSerializer());
```

{% note info Dependencies %}
To use BSON Serializer, add the following dependency to the build script:  
group: 'de.undercouch', name: 'bson4jackson', version: '2.9.2'
{% endnote %}

## CBOR Serializer

Built-in [CBOR](https://cbor.io/) Serializer.
CBOR is based on the wildly successful JSON data model: numbers, strings,
arrays, maps (called objects in JSON), and a few values such as false, true,
and null.
 
```java
transporter.setSerializer(new CborSerializer());
```

{% note info Dependencies %}
To use CBOR Serializer, add the following dependency to the build script:  
group: 'com.fasterxml.jackson.dataformat', name: 'jackson-dataformat-cbor', version: '2.10.0'
{% endnote %}

## Amazon ION Serializer

Built-in [ION](http://amzn.github.io/ion-docs/) Serializer.
Amazon Ion is a richly-typed, self-describing, hierarchical data
serialization format offering interchangeable binary and text
representations. The binary representation is efficient to store, transmit,
and skip-scan parse.
 
```java
transporter.setSerializer(new IonSerializer());
```

{% note info Dependencies %}
To use ION Serializer, add the following dependency to the build script:  
group: 'software.amazon.ion', name: 'ion-java', version: '1.5.1'
{% endnote %}

## SMILE Serializer

Built-in [SMILE](https://en.wikipedia.org/wiki/Smile_(data_interchange_format)) Serializer.
SMILE is a computer data interchange format based on JSON. It can also be
considered as a binary serialization of generic JSON data model, which means
that tools that operate on JSON may be used with SMILE as well, as long as
proper encoder/decoder exists for tool to use. Compared to JSON, SMILE is
both more compact and more efficient to process.
 
```java
transporter.setSerializer(new SmileSerializer());
```

{% note info Dependencies %}
To use SMILE Serializer, add the following dependency to the build script:  
group: 'com.fasterxml.jackson.dataformat', name: 'jackson-dataformat-smile', version: '2.10.0'
{% endnote %}

## Custom Serializer

Custom Serializer module can be created.
To make your own Serializer, you need to derive it from the `services.moleculer.serializer.Serializer`
superclass, and implement the `write` and `read` methods.

Create custom Serializer:

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

Use custom Serializer:

```java
transporter.setSerializer(new CustomSerializer());
```