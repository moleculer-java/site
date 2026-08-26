## About Internal Services

The `ServiceBroker` contains some internal `Services` to check the node health or get some registry information.
These services can be disabled by setting "internalServices" parameter to "false" in
[ServiceBrokerConfig](broker.html#create-a-service-broker):

```java{2}
ServiceBrokerConfig cfg = new ServiceBrokerConfig();
cfg.setInternalServices(false); // Disable Internal Services
ServiceBroker broker = new ServiceBroker(cfg);
```

::: tip For Node.js developers
The Java broker exposes exactly these internal `Actions`: `$node.list`, `$node.services`,
`$node.actions`, `$node.events` and `$node.health` (all described below). There is **no
`$node.metrics` and no `$node.options`** internal service as in Node.js — registry and health data
are available through the actions above.
:::

## List of nodes

The "$node.list" `Action` lists all known nodes (including local node).

```java{1}
broker.call("$node.list").then(rsp -> {

    // Print JSON response
    logger.info(rsp);

    // Example processing of the response (print IPs of nodes):
    for (Tree nodeInfo: rsp) {
        logger.info("Node ID: " + nodeInfo.get("id", ""));
        for (Tree ip: nodeInfo.get("ipList")) {
            logger.info(" IP address: " + ip.asString());
        }
    }
});
```

**Sample response**

```text
[
  {
    "id":"node1",
    "available":true,
    "lastHeartbeatTime":1579023883101,
    "cpu":8,
    "port":0,
    "hostname":"tsmith-pc",
    "ipList":[
      "192.168.12.13",
      "fe80:0:0:0:0:6efe:c0a8:3348%net4",
      ...
    ],
    "client":{
      "type":"java",
      "version":"2.1.0",
      "langVersion":"21.0.4"
    }
  }
]

Node ID: node1
 IP address: 192.168.12.13
 IP address: fe80:0:0:0:0:6efe:c0a8:3348%net4
 IP address: fe80:0:0:0:0:110:7f:fffe%net5
 IP address: fe80:0:0:0:4514:d05f:4195:80d8%eth5
 IP address: fe80:0:0:0:9802:43e:ce67:4c25%eth6
```

**Parameters**

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| withServices | Boolean | false | List with services. |

## List of Services

The "$node.services" `Action` lists all registered `Services` (local & remote).

```java{1}
broker.call("$node.services").then(rsp -> {

    // Print JSON response
    logger.info(rsp);

    // Example processing of the response (print nodeIDs of Services):
    for (Tree serviceInfo: rsp) {
        logger.info("Service: " + serviceInfo.get("name", ""));
        for (Tree nodeID: serviceInfo.get("nodes")) {
            logger.info("  Node ID: " + nodeID.asString());
        }
    }
});
```

**Sample response**

```text
[
  {
    "name":"api-gw",
    "nodes":[
      "tsmith-pc-7700"
    ],
    "settings":null,
    "metadata":null
  },
  {
    "name":"chatService",
    "nodes":[
      "tsmith-pc-7700"
    ],
    "settings":null,
    "metadata":null
  },
  {
    "name":"upload",
    "nodes":[
      "tsmith-pc-7700"
    ],
    "settings":null,
    "metadata":null
  }
]

Service: api-gw
  Node ID: tsmith-pc-7700
Service: chatService
  Node ID: tsmith-pc-7700
Service: upload
  Node ID: tsmith-pc-7700
```

**Parameters**

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| onlyLocal | Boolean | false | List only local services. |
| skipInternal | Boolean | false | Skip the internal services ("$node"). |
| withActions | Boolean | false | List with actions. |

## List of Actions

The "$node.actions" `Action` lists all registered `Actions` (local & remote).

```java{1}
broker.call("$node.actions").then(rsp -> {

    // Print JSON response
    logger.info(rsp);
    
    // Example processing of the response (print Actions and some attributes):
    for (Tree actionInfo: rsp) {
        logger.info("Action: " + actionInfo.get("name", "") +
                    ", local: "  + actionInfo.get("hasLocal", false) +
                    ", count: "  + actionInfo.get("count", 0));
    }    
});
```

**Sample response**

```text
[
  {
    "name":"$node.actions",
    "count":1,
    "hasLocal":true,
    "available":true,
    "action":{
      "name":"$node.actions"
    }
  },
  {
    "name":"blog.clear",
    "count":1,
    "hasLocal":true,
    "available":true,
    "action":{
      "name":"blog.clear"
    }
  },
  {
    "name":"jmx.findObjects",
    "count":1,
    "hasLocal":true,
    "available":true,
    "action":{
      "name":"jmx.findObjects"
    }
  }
]

Action: $node.actions, local: true, count: 1
Action: blog.clear, local: true, count: 1
Action: jmx.findObjects, local: true, count: 1
```

**Options**

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| onlyLocal | Boolean | false | List only local actions. |
| skipInternal | Boolean | false | Skip the internal actions ("$node"). |
| withEndpoints | Boolean | false | List with endpoints _(nodes)_. |

## List of event subscriptions

The "$node.events" `Action` lists all event subscriptions.

```java{1}
broker.call("$node.events").then(rsp -> {

    // Print JSON response
    logger.info(rsp);
    
    // Example processing of the response (print Events and some attributes):
    for (Tree eventInfo: rsp) {
        String subscription = eventInfo.get("name", "");
        logger.info("Subscription: " + subscription);
        for (Tree event: eventInfo.get("event")) {
            logger.info(" " + event.getName() + " = " + event.asString());
        }
    }
});
```

**Sample response**

```text
[
  {
    "name":"$services.changed",
    "group":"nettyServer",
    "count":1,
    "hasLocal":true,
    "available":true,
    "event":{
      "name":"$services.changed",
      "group":"nettyServer"
    }
  },
  {
    "name":"websocket.send",
    "group":"api-gw",
    "count":1,
    "hasLocal":true,
    "available":true,
    "event":{
      "name":"websocket.send",
      "group":"api-gw"
    }
  }
]

Subscription: $services.changed
 name = $services.changed
 group = nettyServer
Subscription: websocket.send
 name = websocket.send
 group = api-gw
```

**Options**

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| onlyLocal | Boolean | false | List only local subscriptions. |
| skipInternal | Boolean | false | Skip the internal event subscriptions "$". |
| withEndpoints | Boolean | false | List with endpoints _(nodes)_. |

## Health of node

The "$node.health" `Action` returns the health info of local node (including process & OS information).

```java{1}
broker.call("$node.health").then(rsp -> {

    // Print JSON response
    logger.info(rsp);

    // Example processing of the response (print IPs and some attributes):
    logger.info("IP Addresses:");
    for (Tree ip: rsp.get("net.ip")) {
        logger.info(" " + ip.asString());
    }

    logger.info("CPU cores: " + rsp.get("cpu.cores", 0));
    logger.info("OS type: "   + rsp.get("os.type", ""));
    logger.info("Homedir: "   + rsp.get("os.user.homedir", ""));
});
```

**Sample response**

```text
{
  "cpu":{
    "cores":8,
    "utilization":16
  },
  "os":{
    "type":"Windows 10",
    "release":"1.2",
    "hostname":"tsmith-pc",
    "arch":"amd64",
    "user":{
      "username":"Tom Smith",
      "homedir":"C:\\Users\\TSmith",
      "shell":""
    }
  },
  "process":{
    "pid":7700,
    "memory":{
      "heapTotal":189792256,
      "heapUsed":57524232
    },
    "uptime":6021
  },
  "client":{
    "type":"java",
    "version":"2.1.0",
    "langVersion":"21.0.4"
  },
  "net":{
    "ip":[
      "192.168.12.13"
    ]
  },
  "time":{
    "now":1579023307986,
    "iso":"2020-01-14T17:35:07.986Z",
    "utc":"Tue, 14 Jan 2020 17:35:07 GMT"
  }
}

IP Addresses:
 192.168.12.13
CPU cores: 8
OS type: Windows 10
Homedir: C:\Users\TSmith
```