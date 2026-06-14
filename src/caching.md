## Caching Action calls

Moleculer has a built-in caching solution to accelerate **responses of service actions**.
There are two types of caches:

- [Local](caching.html#local-cachers) cache (eg. MemoryCacher, some JCache implementations)
- [Distributed](caching.html#distributed-cachers) cache (eg. Redis Cacher, some implementations of JCache are distributed)

Local caches store data per node locally.
These are the fastest caches, but the programmer
[must implement](caching.html#using-local-caches-in-clustered-environment)
the delete operations on multiple nodes.
Distributed caches store data on one (or more) central cache server(s).
Distributed caches are easier to use, but they are a bit slower due to network traffic.

**Cached action example**

```java{5}
@Name("users")
public class UserService extends Service {

    // Enable caching for this Action
    @Cache()
    public Action list = ctx -> {
        logger.info("Handler called!");
            
        // Response structure:
        // [
        //   { id: 1, name: "John" },
        //   { id: 2, name: "Jane" }
        // ]
        Tree root = new Tree();
        Tree list = root.putList("list");
        list.addMap().put("id", 1).put("name", "John");
        list.addMap().put("id", 2).put("name", "Jane");
        return list;
    };
}

// Invoke "users.list" action twice:
Promise.resolve()
    .then(rsp -> {
        
        // The first time the cache is empty, the Service will be invoked.
        return broker.call("users.list");
        
    }).then(rsp -> {
    
        // First result
        logger.info("Users count:" + rsp.size());
    
    }).then(rsp -> {
        
        // Returns from cache, handler won't be invoked.
        return broker.call("users.list");
        
    }).then(rsp -> {

        // Second result
        logger.info("Users count from cache:" + rsp.size());
        
    });
```

**Console messages**

```
[2017-08-18T13:04:33.845Z] INFO  Broker started.
[2017-08-18T13:04:33.848Z] INFO  Handler called!
[2017-08-18T13:04:33.849Z] INFO  Users count: 2
[2017-08-18T13:04:33.849Z] INFO  Users count from cache: 2
```

The Handler called message appears only once because the response of the second call came from the cache.

::: warning
Caching **does not work** with streamed data,
it can only store values sent or received in a single data structure.
Do not use the "@Cache" `Annotation` for `Actions` that receive or send
[Moleculer Streams](actions.html#streaming).
:::

### Cache keys

The cacher generates key from service name, action name and the params of context.
The syntax of key is:
```
<serviceName>.<actionName>:<parameters or hash of parameters>
```
So if you call the posts.list action with params { limit: 5, offset: 20 },
cacher generates cache key from "params" based on JSON serialization and/or hash algorithm.
So the next time, when you call this action with the same params,
it will find the entry in the cache by key.

**Example hashed cache key for "posts.find" action**

```
posts.find:limit|5|offset|20
```

The "params" structure may contain properties that are not relevant to the cache key.
In addition, it can cause performance problems if the key is too long.
Therefore, we recommend that you set the key properties of the "cache" note, which contains a list of basic parameter names under the "keys" property.

Therefore it is recommended to set the key properties of the "cache" annotation which
contains a list of essential parameter names:

**Strict the list of "params" & "meta" properties for key generation**

```java{6}
@Name("posts")
public class PostService extends Service {

    // Generate cache key from "limit", "offset" params and "user.id" meta
    // To use meta keys in cache "keys"" use the "#" prefix.    
    @Cache(keys = { "limit", "offset", "#user.id" })
    public Action list = ctx -> {
        logger.info("Handler called!");
        // ...
    };
}
```

If params is { limit: 10, offset: 30 } and meta is { user: { id: 123 } }, the cache key will be:
```
posts.list:10|30|123
```

::: tip Performance Tip
Using "Cache keys" can greatly speed up the application by reducing the amount of data to be serialized.  
![](https://img.shields.io/badge/performance-%2B20%25-brightgreen.svg)
:::

### Limiting cache key length

Occasionally, the key can be very long, which can cause performance issues.
To avoid it, maximize the length of concatenated params in the key with "maxParamsLength" cacher option.
When the key is longer than this configured limitvalue,
the cacher calculates a hash (SHA256) from the full key and adds it to the end of the key.

The minimum of "maxParamsLength" is 44 (SHA 256 hash length in Base64).
To disable key shortening, set "maxParamsLength" to zero.

**Generate a full key from the whole params without limit**

```java
// The params is { id: 2,
//                 title: "New post",
//                 content: "It can be very very looooooooooooooooooong content.
//                           So this key will also be too long"
//               }
cacher.getCacheKey("posts.find", params);
// Key: 'posts.find:id|2|title|New post|content|It can be very very looooooooooooooooooong content.
//       So this key will also be too long'
```

**Generate a limited-length key**

```java
RedisCacher cacher = new RedisCacher("redis://localhost/");
cacher.setMaxParamsLength(60);
ServiceBroker broker = ServiceBroker.builder().cacher(cacher).build();

// The params is { id: 2,
//                 title: "New post",
//                 content: "It can be very very looooooooooooooooooong content.
//                           So this key will also be too long"
//               }
cacher.getCacheKey("posts.find", params);
// Key: 'posts.find:id|2|title|New pL4ozUU24FATnNpDt1B0t1T5KP/T5/Y+JTIznKDspjT0='
```

### Time to Live

The TTL is the default time-to-live of cached entries in seconds.
TTL setting can be overriden in action definition.

```java{7}
MemoryCacher cacher = new MemoryCacher();
cacher.setTtl(10);
ServiceBroker broker = ServiceBroker.builder().cacher(cacher).build();

broker.createService(new Service("posts") {

    @Cache(keys = { "limit", "offset", "#user.id" }, ttl = 5)
    public Action list = ctx -> {
        logger.info("Handler called!");
        // ...
    };

});
```

### Manual caching

The cacher module can be used manually. Just call the "get", "set", "del" methods of the ServiceBroker's `Cacher`.

```java
// The Cacher is in the ServiceBroker's config object
Cacher cacher = broker.getConfig().getCacher();

// Create data
Tree data = new Tree();
data.putList("array").add(1).add(2).add(3);

// Save to cache
cacher.set("mykey.a", data, 60);

// Get from cache
cacher.get("mykey.a").then(rsp -> {
    logger.info("Data: " + rsp);
});

// Remove entry from cache
cacher.del("mykey.a");

// Remove all 'mykey' entries
cacher.clean("mykey.**");

// Remove all entries from all cache regions
cacher.clean();
```

Sometimes you have to clear the old cached entries
(for example, when you change the records in a database).
Example to clean the cache inside actions:

```java
// Clear all entries
cacher.clean();

// Clear all entries from the `users` cache region
this.broker.cacher.clean("users.**");

// Delete the specified entries
cacher.del("users.list");
cacher.del("users.model:5");
cacher.del("users.model:8|true|2");
```

### Using local caches in clustered environment

The best practice to clear cache entries among multiple service instances is that use broadcast events.
This solution is only required when using local caches.
It is enough to delete shared (eg. Redis) caches with one "clean" command,
because the data is stored on a central server.
When using local caches, each node store a *local copy* of the cached data.

**Example**

```java{17,32}
@Name("users")
@Controller
public class UserService extends Service {

    @Autowired
    UserDAO userDAO; // Some kind of database API

    // This Action modifies the DB (update)
    public Action update = ctx -> {

        // Update user entity, so
        // cached content will be obsolete
        Promise res = userDAO.updateUser(ctx.params);

        // Broadcast the event, so ALL Service instances
        // receive it (including this instance).
        ctx.broadcast("cache.clean.users");

        // Return a response
        return res;
    };

    // This Action is cached (it's just a query)
    @Cache(keys = { "userID" })
    public Action find = ctx -> {
        String userID = ctx.params.get("userID", "");
        return userDAO.findUserByID(userID);
    };
    
    // This section monitors whether
    // any of the nodes have changed the user DB
    @Subscribe("cache.clean.users")
    public Listener userListener = payload -> {
    
        // Remove all local entries from the "users" cache region,
        // the next "find" Action will NOT be cached
        broker.getConfig().getCacher().clean("users.**");
    };
    
}
```

The above code could be optimized to not delete the entire cache region but just one record
(by the "userID" - because "userID" is the Cache Key at the "find" `Action`).

## Local cachers

<div align="center">
    <img src="local-cacher.svg" alt="Local Cachers" class="zoom" />
</div>

### Memory cacher

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
The `MemoryCacher` works with each node having its own local heap-based cache.
This is **the fastest** cache, but the programmer has to take care of emptying the cache with event broadcasting.
Memory cache is not a distributed cache, it works like a local Map in the VM's memory.
But the number of queries can be millions per second,
because repetitive queries do not generate network traffic.
Supports global and entry-level TTL.
`ServiceBroker` uses `MemoryCacher` by default.

**Configure memory cacher**

```java{1}
MemoryCacher cacher = new MemoryCacher();
cacher.setAccessOrder(true); // true = LRU cache
cacher.setTtl(60);           // default TTL
cacher.setCleanup(10);       // period time of cleanup process
cacher.setCapacity(2048);    // max cached entries per region
ServiceBroker broker = ServiceBroker.builder()
                                    .cacher(cacher)
                                    .build();
```

**Options**

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| ttl | int | 0 | Default time-to-live in SECONDS (0 = no TTL) |
| capacity | int | 2048 | Maximum number of entries per cache region |
| useCloning | boolean | true | Make clone from the returned values |
| cleanup | int | 5 | Cleanup period time in SECONDS |
| accessOrder | boolean | true | The ordering mode - true for access-order (LRU cache), false for insertion-order |

## Distributed cachers

<div align="center">
    <img src="distributed-cacher.svg" alt="Local Cachers" class="zoom" />
</div>

### Redis cacher

![](https://img.shields.io/badge/Node.js-Compatible-brightgreen.svg)  
Redis-based distributed cache.
Supports SSL, clustering and password authentication.
It's the one of the fastest distributed cache for Moleculer.
`RedisCacher` is implemented for both Java and Node.js based Moleculer frameworks.
Supports global and entry-level TTL configuration.

::: warning Redis dependencies
To use Redis Cacher, add the following dependency to the build script:  
[group: 'io.lettuce', name: 'lettuce-core', version: '6.7.1.RELEASE'](https://mvnrepository.com/artifact/io.lettuce/lettuce-core)
:::

**Configure Redis cacher**

```java{1}
RedisCacher cacher = new RedisCacher();
cacher.setUrls("localhost");
cacher.setTtl(60);
ServiceBroker broker = ServiceBroker.builder()
                                    .cacher(cacher)
                                    .build();
```

**With MessagePack serializer**

```java{2}
RedisCacher cacher = new RedisCacher();
cacher.setSerializer(new MsgPackSerializer())
cacher.setUrls("redis://host1:6380", "redis://host2:6381");
ServiceBroker broker = ServiceBroker.builder()
                                    .cacher(cacher)
                                    .build();
```

**Options**

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| urls | String[] | localhost | Array of URLs of the Redis servers |
| ttl | int | 0 | Time-to-live in SECONDS (0 = disabled) |
| maxParamsLength | int | 0 | Maximum length of params in generated keys |
| serializer | Serializer | JsonSerializer | Implementation of the serializer/deserializer |
| password | String | null | Configures authentication (URI may contain the password) |
| secure | boolean | false | Sets SSL connection on/off (URI may contain the SSL info) |

**Redis URI syntax**

Redis Standalone:

_redis_ : // [*:* _password_@] _host_ [*:* _port_] [*/* _database_][*?* [_timeout=timeout_[_d|h|m|s|ms|us|ns_]] [&_database=database_]]

Redis Standalone with SSL:

_rediss_ : // [*:* _password_@] _host_ [*:* _port_] [*/* _database_][*?* [_timeout=timeout_[_d|h|m|s|ms|us|ns_]] [&_database=database_]]

Redis Standalone with Unix Domain Sockets:

_redis-socket_ : // [*:* _password_@]_path_ [*?*[_timeout=timeout_[_d|h|m|s|ms|us|ns_]][&_database=database_]]

Redis Sentinel:

_redis-sentinel_ : // [*:* _password_@] _host1_[*:* _port1_] [, _host2_[*:* _port2_]] [, _hostN_[*:* _portN_]] [*/* _database_][*?*[_timeout=timeout_[_d|h|m|s|ms|us|ns_]] [&_sentinelMasterId=sentinelMasterId_] [&_database=database_]]

### JCache cacher

JSR-107 `JCache` is a standardized caching API.
Core `JCache` API does NOT support entry-level TTL parameter.
If you need this feature use `RedisCacher` or `MemoryCacher`.
`JCache` is implemented by various caching solutions:

- Apache Ignite
- Hazelcast
- Oracle Coherence
- Terracotta Ehcache
- Infinispan
- Blazing Cache
- Cache2k
- Caffeine
- etc.

The performance and operation of `JCache` implementations can be very different.

::: warning JCache dependencies
To use JCache Cacher, add the following dependency to the build script:  
[group: 'javax.cache', name: 'cache-api', version: '1.1.1'](https://mvnrepository.com/artifact/javax.cache/cache-api)  
and it is also necessary to put the dependencies of the JCache implementation in the classpath.
:::

**Configure JCache cacher**

Using the JVM's default `JCache` implementation:

```java{2}
ServiceBroker broker = ServiceBroker.builder()
                                    .cacher(new JCacheCacher())
                                    .build();
```

Create `Cacher` using the specified `CacheProvider` implementation:

```java{5}
// "RICachingProvider" is part of a JCache implementation,
// but it can be arbitrary (eg. Hazelcast or EHcache based)
CachingProvider provider = new RICachingProvider();
CacheManager manager = provider.getCacheManager();
JCacheCacher cacher = new JCacheCacher(manager);

ServiceBroker broker = ServiceBroker.builder()
                                    .cacher(cacher)
                                    .build();
```

**Options**

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| maxParamsLength | int | 0 | Maximum length of params in generated keys |
| closeEmptyPartitions | boolean | true | Close and dispose empty caches |

## Custom cacher

When you create your own `Cacher`, the new `Cacher` class must be inherited from `services.moleculer.cacher.Cacher`.
The get(), set(), del(), clean() functions must be implemented.
You can get ideas for implementation from the contents of the "services.moleculer.cacher" package,
which contains the `Cachers` already made.
The easiest way to build your own `Cacher` implementation is to inherit your own from an existing cacher class.
To overwrite the built-in cache key generator,
override the "getCacheKey" function with your implementation.
The implementations of the cachers can be found in the "services.moleculer.cacher" package.

```java{1}
Cacher cacher = new MyCustomCacher();
ServiceBroker broker = ServiceBroker.builder()
                                    .cacher(cacher)
                                    .build();
```