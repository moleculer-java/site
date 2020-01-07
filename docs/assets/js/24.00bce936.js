(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{213:function(t,a,e){"use strict";e.r(a);var s=e(0),n=Object(s.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("p",[t._v("Transporter needs a Serializer Module which serializes & deserializes the transferable data.\nThe default Serializer is the "),e("code",[t._v("JsonSerializer")]),t._v(" but there are several built-in Serializers\ncan convert messages into MessagePack, BSON, CBOR, SMILE, Amazon ION or other binary formats.")]),t._v(" "),e("h2",{attrs:{id:"json-serializer"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#json-serializer"}},[t._v("#")]),t._v(" JSON Serializer")]),t._v(" "),e("p",[t._v("This is the built-in default Serializer.\nIt serializes the packets to JSON string and deserializes the received JSON bytes to "),e("code",[t._v("Tree")]),t._v(" objects.\nThe performance of JSON Serializers in Java and JavaScript is very good,\nJSON serialization is usually faster than most binary Serializers.\nThis Serializer is compatible with the JavaScript/Go version of Moleculer.")]),t._v(" "),e("div",{staticClass:"language-java extra-class"},[e("pre",{pre:!0,attrs:{class:"language-java"}},[e("code",[e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("NatsTransporter")]),t._v(" transporter "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("NatsTransporter")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"nats://nats.server:4222"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Do not have to set it because this is the default")]),t._v("\ntransporter"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("setSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("JsonSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),t._v(" broker "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("builder")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                                    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("nodeID")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"server-1"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                                    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("transporter")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("transporter"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                                    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("readers")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"jackson,boon"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                                    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("writers")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"jackson,fast"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                                    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("build")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("The "),e("code",[t._v("readers")]),t._v(" and "),e("code",[t._v("writers")]),t._v(" parameters are used to specify the JSON API\nto be used by Moleculer for deserialization / serialization.\nThis is important if you have multiple JSON implementations on the classpath.\nSeveral implementations can be specified in order of importance, separated by commas.\nIf not specified, ServiceBroker will automatically try to choose the fastest JSON API.\nThe values of the "),e("code",[t._v("readers")]),t._v(" and "),e("code",[t._v("writers")]),t._v(" parameters are listed below:")]),t._v(" "),e("table",[e("thead",[e("tr",[e("th",[t._v("Reader/writer ID")]),t._v(" "),e("th",[t._v("JSON API and Dependency")])])]),t._v(" "),e("tbody",[e("tr",[e("td",[t._v('"boon"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/io.fastjson/boon",target:"_blank",rel:"noopener noreferrer"}},[t._v("Boon JSON API"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"bson"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/org.mongodb/bson",target:"_blank",rel:"noopener noreferrer"}},[t._v("BSON (MongoDB)"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"dsl"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/com.dslplatform/dsl-json",target:"_blank",rel:"noopener noreferrer"}},[t._v("DSLJson"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"fast"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/com.alibaba/fastjson",target:"_blank",rel:"noopener noreferrer"}},[t._v("FastJson"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"flex"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/net.sf.flexjson/flexjson",target:"_blank",rel:"noopener noreferrer"}},[t._v("Flexjson"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"genson"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/com.owlike/genson",target:"_blank",rel:"noopener noreferrer"}},[t._v("Genson"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"gson"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/com.google.code.gson/gson",target:"_blank",rel:"noopener noreferrer"}},[t._v("Google Gson"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"jackson"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind",target:"_blank",rel:"noopener noreferrer"}},[t._v("Jackson JSON"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"jodd"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/org.jodd/jodd-json",target:"_blank",rel:"noopener noreferrer"}},[t._v("Jodd Json"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"johnzon"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/org.apache.johnzon/johnzon-normalMapper",target:"_blank",rel:"noopener noreferrer"}},[t._v("Apache Johnzon"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"jsonio"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/com.cedarsoftware/json-io",target:"_blank",rel:"noopener noreferrer"}},[t._v("JsonIO"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"nano"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/com.grack/nanojson",target:"_blank",rel:"noopener noreferrer"}},[t._v("NanoJson"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"simple"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/com.googlecode.json-simple/json-simple",target:"_blank",rel:"noopener noreferrer"}},[t._v("JSON.simple"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"smart"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/net.minidev/json-smart",target:"_blank",rel:"noopener noreferrer"}},[t._v("Json-smart"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"sojo"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/net.sf.sojo/sojo",target:"_blank",rel:"noopener noreferrer"}},[t._v("SOJO"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"util"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/org.kopitubruk.util/JSONUtil",target:"_blank",rel:"noopener noreferrer"}},[t._v("JsonUtil"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"ion"')]),t._v(" "),e("td",[e("a",{attrs:{href:"https://mvnrepository.com/artifact/software.amazon.ion/ion-java",target:"_blank",rel:"noopener noreferrer"}},[t._v("Amazon Ion"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v('"builtin"')]),t._v(" "),e("td",[t._v("Built-in JSON parser (no dependencies)")])])])]),t._v(" "),e("p",[t._v('So, for example, if you want to use a "FastJSON" implementation,\nput the implementation reference in the "dependencies" block of the (build.gradle or pom.xml) build script,\nthen set '),e("code",[t._v("readers")]),t._v(" and "),e("code",[t._v("writers")]),t._v(' to "fast". To verify, type "info" command into the REPL console.\nThe "info" command will display the current Moleculer configuration, including the the JSON API which is in use.')]),t._v(" "),e("h2",{attrs:{id:"messagepack-serializer"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#messagepack-serializer"}},[t._v("#")]),t._v(" MessagePack Serializer")]),t._v(" "),e("p",[t._v("Built-in "),e("a",{attrs:{href:"https://msgpack.org",target:"_blank",rel:"noopener noreferrer"}},[t._v("MsgPack"),e("OutboundLink")],1),t._v(" Serializer.\nMessagePack is an efficient binary serialization format. It lets you exchange\ndata among multiple languages like JSON. But it's smaller. Small\nintegers are encoded into a single byte, and typical short strings require\nonly one extra byte in addition to the strings themselves. This Serializer is\ncompatible with the JavaScript version of Moleculer.")]),t._v(" "),e("div",{staticClass:"language-java extra-class"},[e("pre",{pre:!0,attrs:{class:"language-java"}},[e("code",[t._v("transporter"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("setSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("MsgPackSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("::: details Dependencies\nTo use MessagePack Serializer, add the following dependency to the build script:"),e("br"),t._v("\ngroup: 'org.msgpack', name: 'msgpack', version: '0.6.12'\n:::")]),t._v(" "),e("h2",{attrs:{id:"bson-serializer"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#bson-serializer"}},[t._v("#")]),t._v(" BSON Serializer")]),t._v(" "),e("p",[t._v("Built-in "),e("a",{attrs:{href:"http://bsonspec.org/",target:"_blank",rel:"noopener noreferrer"}},[t._v("BSON"),e("OutboundLink")],1),t._v(" Serializer.\nBSON, short for Binary JSON, is a binary-encoded serialization of JSON-like documents.\nLike JSON, BSON supports the embedding of documents and arrays within other documents and arrays.")]),t._v(" "),e("div",{staticClass:"language-java extra-class"},[e("pre",{pre:!0,attrs:{class:"language-java"}},[e("code",[t._v("transporter"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("setSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("BsonSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("::: details Dependencies\nTo use BSON Serializer, add the following dependency to the build script:"),e("br"),t._v("\ngroup: 'de.undercouch', name: 'bson4jackson', version: '2.9.2'\n:::")]),t._v(" "),e("h2",{attrs:{id:"cbor-serializer"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#cbor-serializer"}},[t._v("#")]),t._v(" CBOR Serializer")]),t._v(" "),e("p",[t._v("Built-in "),e("a",{attrs:{href:"https://cbor.io/",target:"_blank",rel:"noopener noreferrer"}},[t._v("CBOR"),e("OutboundLink")],1),t._v(" Serializer.\nCBOR is based on the wildly successful JSON data model: numbers, strings,\narrays, maps (called objects in JSON), and a few values such as false, true,\nand null.")]),t._v(" "),e("div",{staticClass:"language-java extra-class"},[e("pre",{pre:!0,attrs:{class:"language-java"}},[e("code",[t._v("transporter"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("setSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CborSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("::: details Dependencies\nTo use CBOR Serializer, add the following dependency to the build script:"),e("br"),t._v("\ngroup: 'com.fasterxml.jackson.dataformat', name: 'jackson-dataformat-cbor', version: '2.10.0'\n:::")]),t._v(" "),e("h2",{attrs:{id:"amazon-ion-serializer"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#amazon-ion-serializer"}},[t._v("#")]),t._v(" Amazon ION Serializer")]),t._v(" "),e("p",[t._v("Built-in "),e("a",{attrs:{href:"http://amzn.github.io/ion-docs/",target:"_blank",rel:"noopener noreferrer"}},[t._v("ION"),e("OutboundLink")],1),t._v(" Serializer.\nAmazon Ion is a richly-typed, self-describing, hierarchical data\nserialization format offering interchangeable binary and text\nrepresentations. The binary representation is efficient to store, transmit,\nand skip-scan parse.")]),t._v(" "),e("div",{staticClass:"language-java extra-class"},[e("pre",{pre:!0,attrs:{class:"language-java"}},[e("code",[t._v("transporter"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("setSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("IonSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("::: details Dependencies\nTo use ION Serializer, add the following dependency to the build script:"),e("br"),t._v("\ngroup: 'software.amazon.ion', name: 'ion-java', version: '1.5.1'\n:::")]),t._v(" "),e("h2",{attrs:{id:"smile-serializer"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#smile-serializer"}},[t._v("#")]),t._v(" SMILE Serializer")]),t._v(" "),e("p",[t._v("Built-in "),e("a",{attrs:{href:"https://en.wikipedia.org/wiki/Smile_(data_interchange_format)",target:"_blank",rel:"noopener noreferrer"}},[t._v("SMILE"),e("OutboundLink")],1),t._v(" Serializer.\nSMILE is a computer data interchange format based on JSON. It can also be\nconsidered as a binary serialization of generic JSON data model, which means\nthat tools that operate on JSON may be used with SMILE as well, as long as\nproper encoder/decoder exists for tool to use. Compared to JSON, SMILE is\nboth more compact and more efficient to process.")]),t._v(" "),e("div",{staticClass:"language-java extra-class"},[e("pre",{pre:!0,attrs:{class:"language-java"}},[e("code",[t._v("transporter"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("setSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SmileSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("::: details Dependencies\nTo use SMILE Serializer, add the following dependency to the build script:"),e("br"),t._v("\ngroup: 'com.fasterxml.jackson.dataformat', name: 'jackson-dataformat-smile', version: '2.10.0'\n:::")]),t._v(" "),e("h2",{attrs:{id:"custom-serializer"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#custom-serializer"}},[t._v("#")]),t._v(" Custom Serializer")]),t._v(" "),e("p",[t._v("Custom Serializer module can be created.\nTo make your own Serializer, you need to derive it from the "),e("code",[t._v("services.moleculer.serializer.Serializer")]),t._v("\nsuperclass, and implement the "),e("code",[t._v("write")]),t._v(" and "),e("code",[t._v("read")]),t._v(" methods.")]),t._v(" "),e("p",[t._v("Create custom Serializer:")]),t._v(" "),e("div",{staticClass:"language-java extra-class"},[e("pre",{pre:!0,attrs:{class:"language-java"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CustomSerializer")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("extends")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Serializer")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n    "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// --- SERIALIZE TREE TO BYTE ARRAY ---")]),t._v("\n\n    "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("byte")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("write")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Tree")]),t._v(" value"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("throws")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Exception")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Object")]),t._v(" content "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" value"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("asObject")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Write Java Object into byte array...")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// The "content" is "java.util.Map" or "java.util.List".')]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// --- DESERIALIZE BYTE ARRAY TO TREE ---")]),t._v("\n\n    "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Tree")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("read")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("byte")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" source"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("throws")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Exception")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Object")]),t._v(" content "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// Read Java Object from "source"...')]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CheckedTree")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("content"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("p",[t._v("Use custom Serializer:")]),t._v(" "),e("div",{staticClass:"language-java extra-class"},[e("pre",{pre:!0,attrs:{class:"language-java"}},[e("code",[t._v("transporter"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("setSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CustomSerializer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])])}),[],!1,null,null,null);a.default=n.exports}}]);