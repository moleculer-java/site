## About task scheduling

Most applications need background processes to perform various scheduled tasks.
Such tasks include checking various timeouts, scheduled maintenance tasks,
scheduled notifications, reporting, optimizations, and more.
There are three ways to perform scheduled tasks:

- Using the common scheduler - for fast and non-blocking (or blocking momentarily) tasks
- Using a service-specific `ExecutorService` - for slower and/or blocking tasks
- Using a Spring-based scheduler - [you can read more about it here](https://docs.spring.io/spring/docs/3.2.x/spring-framework-reference/html/scheduling.html)

### Using the common scheduler

Each `ServiceBroker` instance has its own instance of `ScheduledExecutorService`.
This `ExecutorService` is available via the "broker.getConfig().getScheduler()" function of the `ServiceBroker`.
In the example code below, the `Service` starts a timer in the "started" method (at system startup)
and stops it in the "stopped" method (when the system is shut down).
The timer calls the "taks" method every 5 seconds:

```java{14-16,26}
@Controller // This annotation is only needed if you are using Spring
public class TaskService extends Service {

    // --- CANCELABLE TASK ---

    private ScheduledFuture<?> timer;

    // --- START SERVICE ---

    public void started(ServiceBroker broker) throws Exception {
        super.started(broker);
        
        // Start task (call the "task()" method every 5 seconds)
        timer = broker.getConfig()
                      .getScheduler()
                      .scheduleWithFixedDelay(this::task, 5, 5, TimeUnit.SECONDS);
    }

    // --- STOP SERVICE ---

    public void stopped() {
        super.stopped();
        
        // Stop task (in case it has already started)
        if (timer != null) {
            timer.cancel(false);
        }
    }

    // --- SCHEDULED METHOD ---

    private void task() {
        logger.info("Method invoked...");
    }
}
```

::: warning
Do not block the ServiceBroker's common `ScheduledExecutorService` for a long time,
as this may negatively affect the overall application.
The common scheduler runs on only a few `Threads`.
If all `Threads` are busy, no further tasks can be completed.
Use this `ExecutorService` only for fast, short-term operations.
:::

### Using a blockable Executor

You can create your own `Thread` within the `Service` to perform slower, blocking tasks.
The following example puts incoming requests into a queue.
Queued data is processed by a separate `Thread`:

```java{19,20,31}
@Controller // This annotation is only needed if you are using Spring
public class TaskService extends Service {

    // --- QUEUE OF ENQUEUED PACKETS ---

    private BlockingQueue<Tree> queue = new LinkedBlockingDeque<>();

    // --- EXECUTOR OF QUEUE ---

    private ExecutorService executor;

    // --- START SERVICE ---

    @Override
    public void started(ServiceBroker broker) throws Exception {
        super.started(broker);

        // Create new executor
        executor = Executors.newSingleThreadExecutor();
        executor.execute(this::task);
    }

    // --- STOP SERVICE ---

    @Override
    public void stopped() {
        super.stopped();

        // Stop executor (in case it has already started)
        if (executor != null) {
            executor.shutdownNow();
        }
    }

    // --- ACTION THAT OTHER SERVICES MAY CALL ---

    public Action enqueue = ctx -> {
        
        // Add incoming packet to queue, and release its thread
        queue.put(ctx.params);
        
        // Return something (for example, the number of pending packets)
        return queue.size();
    };

    // --- SCHEDULED METHOD ---

    private void task() {
        try {
            
            // Loop of the packet processor Thread
            while (true) {
                Tree data = queue.take();
                System.out.println("Processing packet: " + data);
            }
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

You can call the above `Service` via the
[Developer Console](moleculer-repl.html#about-the-developer-console)
by typing the "call taskService.enqueue" command:

```{1}
mol $ call taskService.enqueue key value

>> Call "taskService.enqueue" with params: {"key":"value"}

Processing packet: {
  "key" : "value"
}

Response:
1
```

**Send an asynchronous response from a separate Thread**

We can modify the previous code so that the processing `Thread` responds
to the calling `Service` when it has completed processing the request.
The code is almost the same,
the biggest difference being that the "enqueue" function returns an incompleted `Promise`.
Then put this `Promise` - along with the request - in the queue.
We created a `RequestResponsePair` class to store the two objects.
When the separate thread completes the task, it closes the `Promise` with the "complete" method:

```java{39-47,65}
@Controller // This annotation is only needed if you are using Spring
public class TaskService extends Service {

    // --- QUEUE OF REQUESTS/RESPONSES ---

    private BlockingQueue<RequestResponsePair> queue = new LinkedBlockingDeque<>();

    // --- EXECUTOR OF QUEUE ---

    private ExecutorService executor;

    // --- START SERVICE ---

    @Override
    public void started(ServiceBroker broker) throws Exception {
        super.started(broker);

        // Create new executor
        executor = Executors.newSingleThreadExecutor();
        executor.execute(this::task);
    }

    // --- STOP SERVICE ---

    @Override
    public void stopped() {
        super.stopped();

        // Stop executor (in case it has already started)
        if (executor != null) {
            executor.shutdownNow();
        }
    }

    // --- ACTION THAT OTHER SERVICES MAY CALL ---

    public Action enqueue = ctx -> {

        // Create incompleted Promise
        Promise response = new Promise();

        // Add request and response to the queue,
        // and complete the Promise later
        queue.put(new RequestResponsePair(ctx.params, response));

        // Return the incompleted Promise
        return response;
    };

    // --- SCHEDULED METHOD ---

    private void task() {
        try {
            
            // Loop of the packet processor Thread
            while (true) {

                // Get request and response Promise
                RequestResponsePair pair = queue.take();
                Tree request = pair.request();
                Promise response = pair.response();

                // Complete the Promise
                System.out.println("Processing packet: " + request);                
                response.complete(123); // Send back response to caller
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    // --- REQUEST / RESPONSE CONTAINER (a Java record) ---

    private record RequestResponsePair(Tree request, Promise response) {}
}
```

If we call the "enqueue" `Action` from the
[Developer Console](moleculer-repl.html#about-the-developer-console)
, we see that the answer (the "123") came from another `Thread`.

```{10}
mol $ call taskService.enqueue key value

>> Call "taskService.enqueue" with params: {"key":"value"}

Processing packet: {
  "key" : "value"
}

Response:
123
```