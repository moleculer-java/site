(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{208:function(t,a,s){"use strict";s.r(a);var e=s(0),n=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("Moleculer has several built-in load Balancing Strategies.\nIf services have multiple running instances,\nServiceRegistry uses these Strategies to select a node from all available nodes.\nThe default (pre-set) invocation mode is the Round-Robin Strategy.")]),t._v(" "),s("h2",{attrs:{id:"built-in-strategies"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#built-in-strategies"}},[t._v("#")]),t._v(" Built-in Strategies")]),t._v(" "),s("p",[t._v("To configure Strategy, set "),s("code",[t._v("strategy()")]),t._v(" builder option when creating the ServiceBroker.\nAlternatively, set up the Strategy of the ServiceBrokerConfig using the "),s("code",[t._v("setStrategyFactory()")]),t._v(" method.")]),t._v(" "),s("p",[s("strong",[t._v("Configure a balancing Strategy")])]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// Create a "StrategyFactory"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("StrategyFactory")]),t._v(" strategy "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("XorShiftRandomStrategyFactory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Method #1: Setup using ServiceBrokerConfig")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBrokerConfig")]),t._v(" config "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBrokerConfig")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nconfig"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setStrategyFactory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("strategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),t._v(" broker "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("config"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Method #2: Setup using ServiceBroker.builder()")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),t._v(" broker "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("builder")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                                    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("strategy")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("strategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                                    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("build")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("h3",{attrs:{id:"round-robin-strategy"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#round-robin-strategy"}},[t._v("#")]),t._v(" Round-Robin Strategy")]),t._v(" "),s("p",[t._v("This Strategy selects a node based on "),s("a",{attrs:{href:"https://en.wikipedia.org/wiki/Round-robin_DNS",target:"_blank",rel:"noopener noreferrer"}},[t._v("round-robin"),s("OutboundLink")],1),t._v(" algorithm.\nThis is the default invocation Strategy.\nYou can use the "),s("code",[t._v("setPreferLocal")]),t._v(' function to configure ServiceRegistry\nto invoke locally available services whenever they are available in the JVM.\nIf set to "true", ServiceBroker will always use internal action calls, if possible.\nSuch a function exists for each StrategyFactory.')]),t._v(" "),s("p",[s("strong",[t._v("Usage")])]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RoundRobinStrategyFactory")]),t._v(" strategy "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RoundRobinStrategyFactory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nstrategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setPreferLocal")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),t._v(" broker "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("builder")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("strategy")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("strategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("build")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("h3",{attrs:{id:"random-strategies"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#random-strategies"}},[t._v("#")]),t._v(" Random Strategies")]),t._v(" "),s("p",[t._v("These Strategies randomly select the node.\nThe load on each node (as in round-robin) will be roughly the same.")]),t._v(" "),s("p",[s("strong",[t._v("Usage")])]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Faster random")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("XorShiftRandomStrategyFactory")]),t._v(" strategy "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("XorShiftRandomStrategyFactory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Slower random")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SecureRandomStrategyFactory")]),t._v(" strategy "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SecureRandomStrategyFactory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("h3",{attrs:{id:"cpu-usage-based-strategy"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#cpu-usage-based-strategy"}},[t._v("#")]),t._v(" CPU usage-based Strategy")]),t._v(" "),s("p",[t._v("This Strategy selects a node which has the lowest CPU usage.\nDue to the node list can be very long,\nit gets samples and selects the node with the lowest CPU usage from only samples instead of the whole node list.\nCPU-based load balancing works even when the application is heterogeneous (consisting of Java and Node.js modules).")]),t._v(" "),s("p",[s("strong",[t._v("Usage")])]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Create CPU monitor")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SigarMonitor")]),t._v(" cpuMonitor "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SigarMonitor")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        \n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Create CPU-based strategy")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CpuUsageStrategyFactory")]),t._v(" invocationStrategy "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CpuUsageStrategyFactory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\ninvocationStrategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setLowCpuUsage")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\ninvocationStrategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setMaxTries")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        \n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Create service broker")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),t._v(" broker "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("builder")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                                    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("strategy")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("invocationStrategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                                    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("monitor")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cpuMonitor"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                                    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("build")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("        \n")])])]),s("p",[t._v("To determine CPU usage, ServiceBroker needs a Monitor instance that can query the current CPU usage.\nSuch Monitor is the SigarMonitor based on the "),s("a",{attrs:{href:"https://github.com/hyperic/sigar",target:"_blank",rel:"noopener noreferrer"}},[t._v("Sigar API"),s("OutboundLink")],1),t._v(".\nIt requires the presence of "),s("a",{attrs:{href:"https://mvnrepository.com/artifact/org.hyperic/sigar/1.6.4",target:"_blank",rel:"noopener noreferrer"}},[t._v("JAR files for the Sigar API"),s("OutboundLink")],1),t._v(" in the Java classpath.\nIt is also necessary to copy the "),s("a",{attrs:{href:"https://github.com/hyperic/sigar/wiki/binaries",target:"_blank",rel:"noopener noreferrer"}},[t._v("native Sigar binaries"),s("OutboundLink")],1),t._v(' into the "java.library.path" directory.\nUsing the Sigar API is optional; if it not found on the classpath, ServiceBroker will automatically use the JMX-based CPU monitor.')]),t._v(" "),s("p",[s("strong",[t._v("Strategy options")])]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("Name")]),t._v(" "),s("th",[t._v("Type")]),t._v(" "),s("th",[t._v("Default")]),t._v(" "),s("th",[t._v("Description")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[s("code",[t._v("sampleCount")])]),t._v(" "),s("td",[s("code",[t._v("int")])]),t._v(" "),s("td",[s("code",[t._v("3")])]),t._v(" "),s("td",[t._v('The number of samples. The minimum value is "1" (you can\'t turn off sampling).')])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("lowCpuUsage")])]),t._v(" "),s("td",[s("code",[t._v("int")])]),t._v(" "),s("td",[s("code",[t._v("10")])]),t._v(" "),s("td",[t._v("The low CPU usage percent (%). The node which has lower CPU usage than this value is selected immediately.")])])])]),t._v(" "),s("h3",{attrs:{id:"latency-based-strategy"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#latency-based-strategy"}},[t._v("#")]),t._v(" Latency-based Strategy")]),t._v(" "),s("p",[t._v("This Strategy selects a node which has the lowest latency, measured by periodic ping commands.\nStrategy will ping each node one by one.\nDue to slow sampling, it may take a few minutes for the Services to select optimal Nodes.")]),t._v(" "),s("p",[s("strong",[t._v("Usage")])]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Create latency-based strategy")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("NetworkLatencyStrategyFactory")]),t._v(" strategy "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("NetworkLatencyStrategyFactory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nstrategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setSampleCount")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nstrategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setCollectCount")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("10")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nstrategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setPingInterval")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("10")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nstrategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setPingTimeout")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("5000")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        \n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Create service broker")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),t._v(" broker "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("builder")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("strategy")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("strategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("build")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[s("strong",[t._v("Strategy options")])]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("Name")]),t._v(" "),s("th",[t._v("Type")]),t._v(" "),s("th",[t._v("Default")]),t._v(" "),s("th",[t._v("Description")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[s("code",[t._v("sampleCount")])]),t._v(" "),s("td",[s("code",[t._v("int")])]),t._v(" "),s("td",[s("code",[t._v("5")])]),t._v(" "),s("td",[t._v("The number of samples. If you have a lot of hosts/nodes, it's recommended to "),s("em",[t._v("increase")]),t._v(' the value. Minimum value is "1".')])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("collectCount")])]),t._v(" "),s("td",[s("code",[t._v("int")])]),t._v(" "),s("td",[s("code",[t._v("5")])]),t._v(" "),s("td",[t._v("The number of measured latency per host to keep in order to calculate the average latency.")])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("pingInterval")])]),t._v(" "),s("td",[s("code",[t._v("int")])]),t._v(" "),s("td",[s("code",[t._v("10")])]),t._v(" "),s("td",[t._v("Ping interval in SECONDS. If you have a lot of host/nodes, it's recommended to "),s("em",[t._v("increase")]),t._v(" the value.")])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("pingTimeout")])]),t._v(" "),s("td",[s("code",[t._v("long")])]),t._v(" "),s("td",[s("code",[t._v("5000")])]),t._v(" "),s("td",[t._v("Ping timeout time, in MILLISECONDS.")])])])]),t._v(" "),s("h3",{attrs:{id:"sharding-strategy"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#sharding-strategy"}},[t._v("#")]),t._v(" Sharding Strategy")]),t._v(" "),s("p",[t._v("Shard invocation Strategy is based on "),s("a",{attrs:{href:"https://www.toptal.com/big-data/consistent-hashing",target:"_blank",rel:"noopener noreferrer"}},[t._v("consistent-hashing"),s("OutboundLink")],1),t._v(" algorithm.\nIt uses a key value from context "),s("code",[t._v("params")]),t._v(" or "),s("code",[t._v("meta")]),t._v(" to route the request to nodes.\nIt means that requests with same key value will be routed to the same node.")]),t._v(" "),s("p",[s("strong",[t._v("Usage")])]),t._v(" "),s("p",[t._v("Shard key is "),s("code",[t._v("name")]),t._v(" in context "),s("code",[t._v("params")]),t._v(":")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Create sharding strategy")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ShardStrategyFactory")]),t._v(" strategy "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ShardStrategyFactory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nstrategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setShardKey")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"name"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        \n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Create service broker")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),t._v(" broker "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("builder")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("strategy")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("strategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("build")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("Shard key is "),s("code",[t._v("user.id")]),t._v(" in context "),s("code",[t._v("meta")]),t._v(":")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ShardStrategyFactory")]),t._v(" strategy "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ShardStrategyFactory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nstrategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setShardKey")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"#user.id"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),t._v(" broker "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("builder")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("strategy")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("strategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("build")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),s("p",[t._v("If shard key is in context's "),s("code",[t._v("meta")]),t._v(" it must be declared with a "),s("code",[t._v("#")]),t._v(" at the beginning.\nThe actual "),s("code",[t._v("#")]),t._v(" is ignored.")])]),t._v(" "),s("p",[s("strong",[t._v("Strategy options")])]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("Name")]),t._v(" "),s("th",[t._v("Type")]),t._v(" "),s("th",[t._v("Default")]),t._v(" "),s("th",[t._v("Description")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[s("code",[t._v("shardKey")])]),t._v(" "),s("td",[s("code",[t._v("String")])]),t._v(" "),s("td",[s("code",[t._v("null")])]),t._v(" "),s("td",[t._v("Shard key")])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("vnodes")])]),t._v(" "),s("td",[s("code",[t._v("int")])]),t._v(" "),s("td",[s("code",[t._v("10")])]),t._v(" "),s("td",[t._v("Number of virtual nodes")])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("ringSize")])]),t._v(" "),s("td",[s("code",[t._v("Integer")])]),t._v(" "),s("td",[t._v("null")]),t._v(" "),s("td",[t._v("Size of the ring")])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("cacheSize")])]),t._v(" "),s("td",[s("code",[t._v("int")])]),t._v(" "),s("td",[s("code",[t._v("1024")])]),t._v(" "),s("td",[t._v("Size of the cache")])])])]),t._v(" "),s("h2",{attrs:{id:"custom-strategy"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#custom-strategy"}},[t._v("#")]),t._v(" Custom Strategy")]),t._v(" "),s("p",[t._v("Custom Strategy can be created by implementing StrategyFactory and Strategy interfaces.\nWe recommend to copy the source of "),s("a",{attrs:{href:"https://github.com/moleculer-java/moleculer-java/blob/master/src/main/java/services/moleculer/strategy/SecureRandomStrategyFactory.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("SecureRandomStrategyFactory"),s("OutboundLink")],1),t._v("\nand "),s("a",{attrs:{href:"https://github.com/moleculer-java/moleculer-java/blob/master/src/main/java/services/moleculer/strategy/SecureRandomStrategy.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("SecureRandomStrategy"),s("OutboundLink")],1),t._v("\nclasses, and modify the "),s("code",[t._v("next()")]),t._v(" method in the SecureRandomStrategy.java.")]),t._v(" "),s("p",[s("strong",[t._v("Usage")])]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("MyCustomStrategyFactory")]),t._v(" strategy "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("MyCustomStrategyFactory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),t._v(" broker "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServiceBroker")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("builder")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("strategy")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("strategy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("build")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])])}),[],!1,null,null,null);a.default=n.exports}}]);