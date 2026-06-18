## Handling errors

`ServiceBroker` protects against circular function calls.
It also manages call-level timeout and has a retry logic handler.
In addition, Moleculer has a built-in
[Circuit Breaker](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern) feature.
A Circuit Breaker does the `Action` calls and it monitors the service health. Once it gets some issue,
it trips and all further calls goto another node and finally restores automatically once the `Service` came back.

## Default Service Invoker

This is the default call logic when you create a `ServiceBroker` instance.

```java
// Create a Default Service Invoker
DefaultServiceInvoker invoker = new DefaultServiceInvoker();

// Max call level to avoid circular calls
invoker.setMaxCallLevel(100);

// Write errors to log file
invoker.setWriteErrorsToLog(true);

// Create Service Broker
ServiceBroker broker = ServiceBroker.builder().invoker(invoker).build();
```

### Settings

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| maxCallLevel | int | 100 | Max call level to avoid circular calls |
| writeErrorsToLog | boolean | true | Write errors to log file |

### Call-level retry and timeout

The Default Service Invoker handles retry and timeout parameters for function calls.

```java
// Create JSON request:
// {
//   "key": "value",
//   "array": [1, 2, 3]
// }
Tree req = new Tree();
req.put("key", "value");
req.putList("array").add(1).add(2).add(3);

// Invoke service with retry and timeout parameters
broker.call("service.action",
            req,
            CallOptions
              .retryCount(3)
              .timeout(5000)).then(rsp -> {

              // Process JSON response

            }).catchError(err -> {

              // Error handler

            });
```

### Distributed timeouts

Moleculer uses [distributed timeouts](https://www.datawire.io/guide/traffic/deadlines-distributed-timeouts-microservices/).
In case of nested calls, the timeout value is decremented with the elapsed time.
If the timeout value is less or equal than 0, the next nested calls will be skipped (`RequestSkippedError`)
because the first call has already been rejected with a `RequestTimeoutError` error.

## Circuit Breaker

Moleculer has a built-in Circuit Breaker solution.
It uses a time window to check the number of the failed requests.
Once the error limit is reached, it trips the Circuit Breaker.
The Circuit Breaker is a descendant of Default Service Invoker.

::: tip What is the Circuit Breaker?
The Circuit Breaker can prevent an application from repeatedly trying to execute an operation that's likely to fail.
Allowing it to continue without waiting for the fault to be fixed or wasting CPU cycles while it determines that the fault is long lasting.
The Circuit Breaker pattern also enables an application to detect whether the fault has been resolved.
If the problem appears to have been fixed, the application can try to invoke the operation.

Read more about circuit breaker on [Martin Fowler blog](https://martinfowler.com/bliki/CircuitBreaker.html)
or on [Microsoft Azure Docs](https://docs.microsoft.com/azure/architecture/patterns/circuit-breaker).
:::

If you enable it, all service calls will be protected by this built-in Circuit Breaker.

```java
// Create Circuit Breaker
CircuitBreaker invoker = new CircuitBreaker();

// Max call level to avoid circular calls
invoker.setMaxCallLevel(100);

// Length of time-window in MILLISECONDS
invoker.setWindowLength(5000);

// Maximum number of errors in time-window
invoker.setMaxErrors(20);

// Half-open timeout in MILLISECONDS
invoker.setLockTimeout(10000);

// Create Service Broker
ServiceBroker broker = ServiceBroker.builder().invoker(invoker).build();
```

### Settings

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| windowLength | long | 5000 | Length of time-window in milliseconds |
| maxErrors | int | 3 | Maximum number of errors in time-window |
| lockTimeout | long | 10000 | Number of milliseconds to switch from open to half-open state |
| ignoredTypes | Throwable[] | null | Ignorable Error/Exception types |
| maxCallLevel | int | 100 | Max call level to avoid circular calls |
| writeErrorsToLog | boolean | true | Write errors to log file |
