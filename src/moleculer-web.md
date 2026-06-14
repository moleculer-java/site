## About API Gateway

Moleculer API Gateway is a `Service` that makes other Moleculer `Services` available through REST.
It allows to create high-performance, non-blocking, distributed web applications.
Web request processing can be fine tuned using server-independent middlewares.
Moleculer API Gateway provides full support for high-load **React**, **Angular** or **VueJS** applications.

### Features

- Same code can run as a Jakarta EE Servlet or as a high-performance Netty application without changing a single program line
- WebSocket support (same API for Netty Server and Jakarta EE Servers)
- Supports server-side template engines (FreeMarker, Pebble, Thymeleaf, Mustache, Handlebars, Velocity)
- Many built-in middlewares (ServeStatic, CORS headers, custom error messages, etc.)

**The Moleculer API Gateway is compatible with the following Servlet Containers / Jakarta EE Servers:**

- Apache Tomcat V10.1 and V11
- Eclipse Jetty V12
- Red Hat JBoss EAP V8 / WildFly V31+
- GlassFish Server Open Source Edition V7
- Payara Server V6
- IBM WebSphere Liberty / Open Liberty

API Gateway may work with other servers, too (it's built on the standard Jakarta Servlet 6.0 API). 

<div align="center">
    <img src="web-runtimes.svg" alt="Runtimes" class="zoom" />
</div>

It is also possible to implement a design where only the *API Gateway* and *NettyServer* services are present in the Moleculer nodes.
Within Moleculer nodes, HTTP requests can be distributed through a *HTTP Load Balancer*.
These Moleculer nodes perform static HTTP servicing and, if necessary, HTML transforms.
REST requests are transmitted through a Message Broker (or directly via TCP Transporter) to multiple nodes running in the background.
The number of servers (Moleculer nodes) can vary depending on the load.

<div align="center">
    <img src="web-cluster.svg" alt="Clustered runtime" class="zoom" />
</div>

### Download

**Maven**

```xml
<dependencies>
    <dependency>
        <groupId>com.github.berkesa</groupId>
        <artifactId>moleculer-java-web</artifactId>
        <version>2.0.0</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

**Gradle**

```gradle
dependencies {
    implementation group: 'com.github.berkesa', name: 'moleculer-java-web', version: '2.0.0' 
}
```

### Short Example

The simplest way to create a REST service using Moleculer is the following:

```java
new ServiceBroker()
    .createService(new NettyServer())
    .createService(new ApiGateway("**"))
    .createService(new Service("math") {
       Action add = ctx -> {
         return ctx.params.get("a", 0) +
                ctx.params.get("b", 0);
         };
       }).start();
```
After starting the program, enter the following URL into your browser:  
`http://localhost:3000/math/add?a=3&b=6`

The response will be "9". The above service can also be invoked using a POST method.  
To do this, submit the {"a":3,"b":5} JSON (as POST body) to this URL:  
`http://localhost:300/math/add`

You can access all services, including [internal "$node" Service](internal-services.html).

**Example URLs**    

- Call test.hello action: `http://localhost:3000/test/hello`
- Get health info of node:  `http://localhost:3000/~node/health`
- List of nodes in cluster: `http://localhost:3000/~node/list`
- List of Event listeners:  `http://localhost:3000/~node/events`
- List of Services: `http://localhost:3000/~node/services`
- List of Actions:  `http://localhost:3000/~node/actions`

### Detailed Example

[This demo project](https://moleculer-java.github.io/moleculer-spring-boot-demo/)
demonstrating some of the capabilities of APIGateway.  
The project can be imported into the Eclipse IDE or IntelliJ IDEA.
The brief examples illustrate the following:

- Integration of Moleculer API into the Spring Boot Framework
- Configuring HTTP `Routes` and `Middlewares`
- Creating non-blocking Moleculer `Services`
- Publishing and invoking Moleculer `Services` as REST `Services`
- Generating HTML pages in multiple languages using Template Engines
- Using WebSockets (sending real-time server-side events to browsers)
- Using file upload and download
- Video streaming and server-side image generation
- Creating a WAR from the finished project (Servlet-based runtime)
- Run code without any changes in "standalone mode" (Netty-based runtime) 

## Routes

Like [Express.js](https://expressjs.com/en/guide/routing.html),
Moleculer Moleculer groups request processors ([Middlewares](moleculer-web.html#http-middlewares)) into different `Routes`.
Each `Route` can have one or more `Middlewares`, which are executed when the `Route` is matched.
`Routes` are matched **in the order they are added to the API Gateway**.
When a request arrives the API Gateway will step through each `Route`,
and examines whether the `Route` handles the request.
If the `Route` handles the request, the API Gateway does not call the next `Route`.
The following code is an example of a basic `Route`:

```java
// Create then add a Route to API Gateway
Route route = new Route();
gateway.addRoute(route);

// ...or in short:
Route route = gateway.addRoute(new Route());
```

### Mapping policy

`Routes` have a "mappingPolicy" property to handle `Routes` without Aliases.

**Available options**

- RESTRICT - enable to request only the `Routes` with Aliases (default)
- ALL - enable to request all `Routes` with or without Aliases

```java
Route route = gateway.addRoute(new Route(MappingPolicy.RESTRICT));
route.addAlias("POST", "add", "math.add");
```

In this case, `Action` can only be called on the "/add" path using the "POST" method.
This `Action` is not available with another URL or method.

## Whitelist

If you don't want to publish all `Actions`, you can filter them with whitelist option.
Use match strings or regexp in list. _To enable all actions, use "**"._

```java
ServiceBroker broker = new ServiceBroker();
ApiGateway gateway = new ApiGateway();
Route route = gateway.addRoute(new Route("/api"));

/**
 * Access any actions in "posts" Service, eg:
 * http://localhost:3000/api/posts/action
 */
route.addToWhiteList("posts/*");

/**
 * Allow access to "users/list" Action, eg:
 * http://localhost:3000/api/users/list
 */
route.addToWhiteList("users/list");

/**
 * Access any actions in "math" service using regex, eg:
 * http://localhost:3000/api/math/add?a=1&b2
 */
route.addToWhiteList("^/math/\\S+$");

//  Install Netty web server and ApiGateway  
broker.createService(new NettyServer());
broker.createService(gateway)
broker.start();
```

## Aliases

You can use Alias names instead of `Action` names.
You can also specify the method. Otherwise it will handle every method types. 
Using named parameters in aliases is possible.
Named parameters are defined by prefixing a colon to the parameter name (":name").

```java
ServiceBroker broker = new ServiceBroker();
ApiGateway gateway = new ApiGateway();
Route route = gateway.addRoute(new Route());

// Call "auth.login" action with "GET /login" or "POST /login"
route.addAlias("login", "auth.login");

// Restrict the request method
route.addAlias("POST", "users", "users.create");

// The "name" comes from the URL, eg:
// http://localhost:3000/greeter/Jessica
route.addAlias("GET", "greeter/:name", "test.greeter");

// Cover "view.render" Action with a "virtual" HTML page:
// http://localhost:3000/pages/table.html
route.addAlias("GET", "pages/table.html", "view.render");

//  Install Netty web server and ApiGateway  
broker.createService(new NettyServer()).createService(gateway).start();
```

You can also create RESTful APIs:

```java
route.addAlias("GET", "users", "users.list");
route.addAlias("GET", "users/:id", "users.get");
route.addAlias("POST", "users", "users.create");
route.addAlias("PUT", "users/:id", "users.update");
route.addAlias("DELETE", "users/:id", "users.remove");
```

For REST routes you can also use this simple shorthand alias:

```java
route.addAlias("REST", "users", "users");
```

::: warning
To use this shorthand alias, create a `Service` which has "list", "get", "create", "update" and "remove" actions.
:::

## HTTP Middlewares

HTTP `Middleware` is used to intercept the client request and do some pre-processing.
It can also intercept the response and do post-processing before sending to the client in web application.
Some common tasks that we can do with HTTP `Middlewares` are:

- Formatting of request body or header before sending it to `Action`.
- Authentication and autherization of request for resources.
- Logging request parameters.
- Alter response by adding some cookies or header information.
- End the request-response cycle.

You can extend the `HttpMiddleware` abstract class to create an HTTP `Middleware`.
HTTP `Middlewares` can be added globally or at Route-level to the `ApiGateway`.
Bind `Middleware` to an instance of the API Gateway object by using the "gateway.use(middleware)" function.
Route-level `Middleware` works in the same way as global `Middleware`,
except it is bound to an instance of `Route`.

`Middlewares` is executed in **reverse order** as they are added to `Routes` (or to the `ApiGateway`):

```java
route.use(new LastMiddleware()); // Executed LAST
route.use(new ThirdMiddleware());
route.use(new SecondMiddleware());
route.use(new FirstMiddleware()); // Executed FIRST
```

<div align="center">
    <img src="middlewares.svg" alt="Calling flow" class="zoom" />
</div>

Moleculer's HTTP `Middlewares` use very similar logic to
[Middlewares of Express.js](https://expressjs.com/en/guide/using-middleware.html).
The following example implements an "empty" `Middleware` that passes the request without modification:

```java
public class MyMiddleware extends HttpMiddleware {

    public RequestProcessor install(RequestProcessor next, Tree config) {

        // Create new "RequestProcessor" or return "null", this is
        // decided by the "config" which contains the Action parameters.
        // If you return "null", you won't install Middleware for the Action.

        return new AbstractRequestProcessor(next) {
            public void service(WebRequest req, WebResponse rsp) throws Exception {

                // --- FUNCTIONS BEFORE CALLING THE ACTION ---

                // Do nothig, just invoke next Middleware or Action
                next.service(req, rsp);

                // --- FUNCTIONS AFTER CALLING THE ACTION ---
            }
        };    
    }
}
```

The chain of the `Route` can be terminated if you do not call "next.service" but fill in "rsp" with the answer
(for example, sending a regular "403 Forbidden" HTTP error message). The
[GitHub page](https://github.com/moleculer-java/moleculer-java-web/tree/master/src/main/java/services/moleculer/web/middleware)
of the API Gateway project has many examples of HTTP `Middlewares`.

There is another kind of middleware in the Moleculer Framework; the `Middleware`.
The `Middleware` is similar to `HttpMiddleware`, but it processes internal `Action` calls instead of HTTP requests.  
[Read more about Middlewares](middlewares.html#about-middlewares)

## Multiple Routes

Complex web applications require multiple `Routes`.
Usually one Route is required for REST services and one for static content
(HTML pages, CSS files, images, etc.).
The policy for REST `Route` "RESTRICT" (this is the default policy)
because only the REST services that are configured can be called.
The policy for static `Route` is "ALL" because it accepts all requests
and returns a "404 Not Found" message if the requested file is not exists:

```java
// Create Route for REST services:
Route restRoute = gateway.addRoute(new Route());
restRoute.use(new CorsHeaders());
restRoute.setCallOptions(CallOptions.retryCount(3));
restRoute.addAlias("GET", // Allowed HTTP method
                   "api/hello/:name", // Path alias
                   "greeter.hello");  // Action

// Create Route for static files:
Route staticRoute = gateway.addRoute(new Route());
staticRoute.setMappingPolicy(MappingPolicy.ALL);
staticRoute.use(new NotFound());
staticRoute.use(new ServeStatic("/", "/www"));
staticRoute.use(new Favicon("/www/img/favicon.ico"));
staticRoute.use(new Redirector("/", "index.html", 307));
```

<div align="center">
    <img src="web-routes.svg" alt="Web routes" class="zoom" />
</div>

## Route hooks

API Gateway has before & after call hooks.
The "setBeforeCall" and "setAfterCall" functions provide
low-level access to the HTTP request or response:

```java
gateway.setBeforeCall((currentRoute, req, rsp, data) -> {
    if (req.getPath().startsWith("/api/upload")) {

        // Copy remote address into the "meta" block,
        // so this value will be visible to the Action
        Tree meta = data.getMeta();
        meta.put("address", req.getAddress());
    }
});            
```

The "getInternalObject" function can be used to access the actual `HttpServletRequest`,
`HttpServletResponse` or Netty's `ChannelHandlerContext` object:

```java
gateway.setBeforeCall((currentRoute, req, rsp, data) -> {
    Object internal = req.getInternalObject();
    if (internal instanceof ChannelHandlerContext) {

        // Moleculer is running under Netty
        ChannelHandlerContext nettyRequest =
                        (ChannelHandlerContext) internal;
    } else {

        // Moleculer is running under Jakarta EE Server
        HttpServletRequest servletRequest =
                        (HttpServletRequest) internal;
    }
});
```

## Response type & status code

When the response is received from an `Action`,
the API Gateway checks the "meta" block to see if it contains certain special fields.
With these meta fields, you can change the "Content-Type" header,
the status code of the response and add any HTTP header to the response.

**Special meta fields**

* ctx.meta.$statusCode - Status code (eg. 200, 404) of the HTTP response message
* ctx.meta.$responseType - Content-Type header's value of the HTTP response message
* ctx.meta.$responseHeaders - Set of response headers (it's a Map, not a single value)
* ctx.meta.$location - Location in header for redirects (relative URL)
* ctx.meta.$template - Name of the HTML template (eg. "test" means "test.html")
* ctx.meta.$locale - Locale (~= language) of the generated HTML page (eg. "de", "fr", "en_uk")
* ctx.meta.$session - Variables of the current [HTTP-session](moleculer-web.html#sessioncookie-middleware)

**Example: Invoke Template Engine**

```java
 Action list = ctx -> {

    // Create response "JSON"
    Tree rsp = new Tree();
    rsp.put("name", "value")

    // Get the hidden meta block of the response
    Tree meta = rsp.getMeta();

    // Set status code and Content-Type
    meta.put("$statusCode", 200);
    meta.put("$responseType", "text/html");
    
    // Add extra HTTP headers
    Tree headers = meta.putMap("$responseHeaders");
    headers.put("X-Header-Name1", "Header-Value1");
    headers.put("X-Header-Name2", "Header-Value2");
    headers.put("X-Header-Name3", "Header-Value3");

    // Convert response by using
    // server-side Template Engine
    meta.put("$template", "test"); // test.html
    meta.put("$locale", "en_us");  // Locale (optional)
    
    // Return response
    return rsp;
};
```

**Example: Send image file to browser**

The "Content-Type" value, status code and other HTTP headers
can be changed even if the answer is a **Moleculer Stream**.
Since `PacketStream` has no "meta", it needs to be wrapped in a
[Tree](https://berkesa.github.io/datatree/introduction.html) object:

```java
 Action list = ctx -> {

    // Open Stream
    PacketStream stream = ctx.createStream();
 
    // Trasfer data from file
    stream.transferFrom(new File("/image.png"));
 
    // Stream is wrapped in a Tree object,
    // it's just for the meta (Stream has no meta)
    Tree rsp =  new CheckedTree(stream);

    // Get the meta block
    Tree meta = rsp.getMeta();

    // Set the Content-Type of the response
    meta.put("$responseType", "image/png");

    // Return response (and the Stream in it)
    return rsp;
};
```

**Example: Dynamic content generation**

The following `Action` will be available at:
http://localhost:3000/dynamic.txt  
This was set by the "@HttpAlias" Annotation.
The same could be done by adding a similar Alias to `Route`.

```java
@HttpAlias(method = "GET", path = "/dynamic.txt")
Action img = ctx -> {

    // Response text
    String text = "Server time: " + new Date();

    // Send text as PacketStream
    PacketStream stream = ctx.createStream();        
    byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
    stream.sendData(bytes);
    stream.sendClose();

    // Set HTML headers of the response
    Tree rsp = new CheckedTree(stream);
    Tree headers = rsp.getMeta().putMap("$responseHeaders");        
    headers.put("Content-Length", bytes.length);
    
    // Same as "$responseType" just set it here as header
    headers.put("Content-Type", "text/plain; charset=utf-8");

    return rsp;
};
```

Typing the URL ".../dynamic.txt" into your browser
will display content similar to the following:  
`Server time: Tue Jan 21 16:09:22 CET 2020`

## Built-in Middlewares

Moleculer API Gateway contains many pre-built HTTP `Middlewares`.
These Middleware's can be integrated into web applications to speed up application development.

### ServeStatic Middleware

`Middleware` to serve files from a specified root directory. If the file is not
found, it sends a 404 response. `ServeStatic` supports content compression,
automatic "Content-Type" detection, and ETAGs.
The specified directory (the "/www" in the example below)
can be in the file system or on the classpath.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/ServeStatic.java)]

```java
// Simple usage
ServeStatic staticHandler = new ServeStatic("/", "/www");
staticHandler.setEnableReloading(true) // Turn off in production mode
route.use(staticHandler);

// Middlewares of a typical web server (in the correct order)
route.use(new NotFound()); // To be executed last (404 Not Found)
route.use(new ServeStatic("/", "/www")); // Static files (html, css, etc.)
route.use(new Favicon("/www/img/favicon.ico")); // Favicon (file or classpath)
route.use(new Redirector("/", "index.html", 307)); // Jump to default page
```

### Redirector Middleware

Redirects requests from a specified location to an another location.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/Redirector.java)]

```java
// Any requests to the root path "/"
// will cause the "index.html" page to be served.
route.use(new Redirector("/", "index.html", 307));

// Jump from multiple path to default page
route.use(new Redirector("/", "index.html"));
route.use(new Redirector("/index.htm", "index.html"));
route.use(new Redirector("/default.html", "index.html"));
```

### NotFound Middleware

Refuses all HTTP requests with "Error 400 Not Found" message.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/NotFound.java)]

```java
// Usage with "ServeStatic" and "Favicon" middlewares:
route.use(new NotFound()); // Executed last
route.use(new ServeStatic("/", "/www")); // Executed second
route.use(new Favicon("/www/images/custom.ico")); // Executed first
```

### Favicon Middleware

Handles "/favicon.ico" HTTP requests.
Favicons can be specified using a path to the filesystem,
or by default this `Middleware` will look for a file on the classpath with the name "favicon.ico".
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/Favicon.java)]

```java
route.use(new Favicon("custom.ico"));
```

### BasicAuthenticator Middleware

Simple middleware that provides HTTP BASIC Authentication support.
When the BasicAuthenticator `Middleware` receives this information,
it calls the configured `BasicAuthProvider` with the username and password to authenticate the user.
If the authentication is successful the handler attempts to authorise the user.
If that is successful then the routing of the request is allowed to continue to the application handlers,
otherwise a 403 response is returned to signify that access is denied.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/BasicAuthenticator.java)]

```java
// Allow only one user
route.use(new BasicAuthenticator("user", "password"));

// Allow multiple users
BasicAuthenticator    authenticator = new BasicAuthenticator();
authenticator.addUser("user1", "password1");
authenticator.addUser("user2", "password2");
route.use(authenticator);

// Use custom authenticator
BasicAuthenticator    authenticator = new BasicAuthenticator();
authenticator.setProvider((broker, username, password) -> {

    // Allow usernames starting with "xyz"
    return username.startsWith("xyz");
});
route.use(authenticator);
```

### CorsHeaders Middleware

Implements server side [CORS](https://www.w3.org/wiki/CORS) support for Moleculer.
Cross Origin Resource Sharing is a mechanism for allowing resources to be requested from one host and served from another.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/CorsHeaders.java)]

```java
// Allow all
route.use(new CorsHeaders());

// With custom CORS parameters
CorsHeaders cors = new CorsHeaders();
cors.setOrigin("*");
cors.setMethods("GET");
cors.setMaxAge(60);
route.use(cors);
```

### ErrorPage Middleware

Custom error page (Error 404, 500, etc.) handler.
Error templates can contain the following variables:
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/ErrorPage.java)]

| Variable  | Content          |
|-----------|------------------|
| {status}  | HTTP status code |
| {message} | Error message    |
| {stack}   | Stack trace      |

**Sample error template**

```html
<html>
    <body>
        <h1>{message}</h1>
        <p>{status}</p>
        <pre>{stack}</pre>
    </body>
</html>
```

**Defining status-specific error templates**

```java
// Default error template
ErrorPage errorPages = new ErrorPage("error-default.html");

// Status-specific templates
errorPages.setTemplate(404, "error-404.html");
errorPages.setTemplate(500, "error-500.html");
route.use(errorPages);
```

### HostNameFilter Middleware

The `HostNameFilter` adds the ability to allow or block requests based on the host name of the client.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/HostNameFilter.java)]

```java
HostNameFilter filter = new HostNameFilter();
filter.allow("domain.server**"); // Allow all with this prefix
filter.deny("domain.server22"); // Except this
route.use(filter);
```

### IpFilter Middleware

The `IpFilter` `Middleware` adds the ability to allow or block requests based on the IP address of the client.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/IpFilter.java)]

```java
IpFilter filter = new IpFilter();
filter.allow("150.10.**", "255.12.34.*"); // Let's enable them
filter.deny("150.10.0.0"); // Except this
route.use(filter);
```

### RateLimiter Middleware

Rate Limiter limits concurrent constant requests to the HTTP calls in the application.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/RateLimiter.java)]

```java
// Allow up to 50 requests / second (default)
route.use(new RateLimiter());

// Allow up to 100 requests / 2 minutes
RateLimiter limiter = new RateLimiter();
limiter.setRateLimit(100);
limiter.setWindow(2);
limiter.setUnit(TimeUnit.MINUTES);
route.use(limiter);
```

**Annotation-driven rate limiting**

```java
// Restrict to annotated Actions only
route.use(new RateLimiter(false));

// ...and in the Service
@RateLimit(value = 100, window = 2, unit = "MINUTES")
Action render = ctx -> {
    return null;
};
```

### RequestLogger Middleware

Writes request headers and response headers + response body into the log.
Request body not logged in this version. WARNING: Using this middleware
reduces the performance (nevertheless, it may be useful during development).
Be sure to turn it off in production mode.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/RequestLogger.java)]

```java
route.use(new RequestLogger());
```

### ResponseDeflater Middleware

Compresses body of REST responses. Do not use it with `ServeStatic` `Middleware`;
`ServeStatic` also compresses the data. Use it to compress the response of REST
services.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/ResponseDeflater.java)]

```java
route.use(new ResponseDeflater(Deflater.BEST_SPEED));
```

::: warning
Using compression reduces performance, so use it only on slow networks.
:::

### ResponseHeaders Middleware

This `Middleware` unconditionally adds the specified headers to any HTTP response within the Route.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/ResponseHeaders.java)]

```java
// Add single header to HTTP responses
route.use(new ResponseHeaders("X-Robots-Tag", "noindex"));

// Add multiple headers to HTTP responses
ResponseHeaders securityHeaders = new ResponseHeaders();
securityHeaders.set("X-Download-Options", "noopen");
securityHeaders.set("X-Content-Type-Options", "nosniff");
securityHeaders.set("X-XSS-Protection", "1; mode=block");
securityHeaders.set("X-FRAME-OPTIONS", "DENY");
securityHeaders.set("Strict-Transport-Security", "max-age=12345000");
route.use(securityHeaders);
```

### ResponseTime Middleware

Adds "X-Response-Time" header to the response,
containing the time taken in MILLISECONDS to process the request.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/ResponseTime.java)]

```java
// With "X-Response-Time" header
route.use(new ResponseTime());

// With custom header name
route.use(new ResponseTime("X-Custom"));
```

### ResponseTimeout Middleware

`Middleware` that will timeout requests if the response has not been written
after the specified time. HTTP response code will be "408".
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/ResponseTimeout.java)]

```java
route.use(new ResponseTimeout(1000L * 30));
```

### SessionCookie Middleware

Generates Session Cookies, and sets the cookie header.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/session/SessionCookie.java)]

```java
// With "JSESSIONID" cookie
route.use(new SessionCookie());

// With custom cookie name
route.use(new SessionCookie("SID"));
```

The services.moleculer.web.middleware.session.`SessionHandler` object uses
"beforeCall" and "afterCall" hooks to store the "$session" structure of the request meta block.
By default, `SessionHandler` keeps the contents of the "$session" blocks in memory for a specified time.
`SessionHandler` looks for "$session" block based on the Session Cookie
and copies it to all HTTP requests for the Session. This feature requires SessionCookie `Middleware`
if the application is running on a Netty server (Jakarta EE servers have their own cookie manager).

```java
SessionHandler sessionHandler = new SessionHandler(broker);
gateway.setBeforeCall(sessionHandler.beforeCall());
gateway.setAfterCall(sessionHandler.afterCall());
```

If you need to perform other functions in the "beforeCall" or "afterCall" block,
you can call the `SessionHandler` as follows:

```java
SessionHandler sessionHandler = new SessionHandler(broker);
CallProcessor  loadSession    = sessionHandler.beforeCall();
gateway.setBeforeCall((currentRoute, req, rsp, data) -> {
    loadSession.onCall(currentRoute, req, rsp, data);
    // Other beforeCall" functions...
});

CallProcessor saveSession = sessionHandler.afterCall();
gateway.setBeforeCall((currentRoute, req, rsp, data) -> {
    saveSession.onCall(currentRoute, req, rsp, data);
    // Other "afterCall" functions...
});            
```

`Actions` access the persistent "$session" block as follows:

```java
Action action = ctx -> {

    // Get the persistent "$session" block
    Tree meta = ctx.params.getMeta();
    Tree session = meta.get("$session");

    // Read/write session data
    String userID = session.get("userID", "anon");
    session.put("now", new Date());

    return null;
};
```

### TopLevelCache Middleware

URL-based content cache. It is good for caching the responses of
non-authenticated REST services with large responses. For example, if the
service generates blog/wiki content using a HTML Template Egine. It is not
advisable to cache POST requests and/or requests that depend not only on the
URL but also on the content of the request. `TopLevelCache` speeds up querying
of various reports (tables, charts) and dynamically generated images.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/TopLevelCache.java)]

```java
// User default cacher of MessageBroker
Cacher cacher = broker.getConfig().getCacher();
route.use(new TopLevelCache(cacher, "/blog/posts/**"));

// User custom Cacher
Cacher cacher = new MemoryCacher();
route.use(new TopLevelCache(cacher, "/blog/posts/**"));
```

### XSRFToken Middleware

This middleware adds "X-XSRF-TOKEN" header to responses.
[[source](https://github.com/moleculer-java/moleculer-java-web/blob/master/src/main/java/services/moleculer/web/middleware/XSRFToken.java)]

```java
route.use(new XSRFToken());
```

## Template Engines

Moleculer ApiGateway includes dynamic page generation capabilities by
including out of the box support for several popular template engines.
`Actions` basically return data in JSON format.
To convert the JSON data structure to HTML,
you must specify the template name in the **"$template" meta property**.
If there is a "$template" meta property in the `Action's` response,
`ApiGateway` calls the Template Engine and converts the response to HTML.
Example code that puts three values ("a", "b", and "c") in the response JSON,
then creates a table and then converts this data with "test.html" template:

```java
Action html = ctx -> {

    // Add some value to "raw" JSON data,
    // then create table (10 rows, 3 columns):
    // {
    //     "a": 1,
    //     "b": true,
    //     "c": "xyz",
    //     "table": [
    //         { "first": "some text", "second": false, "third": 0 },
    //         { "first": "some text", "second": false, "third": 1 },
    //         { "first": "some text", "second": false, "third": 2 },
    //         ...
    //     ]
    // }
    Tree data = new Tree();
    data.put("a", 1);
    data.put("b", true);
    data.put("c", "xyz");

    Tree table = data.putList("table");
    for (int i = 0; i < 10; i++) {
        Tree row = table.addMap();
        row.put("first", "some text");
        row.put("second", false);
        row.put("third", i);
    }
    
    // Put template name ("test.html") into the "meta"
    Tree meta = rsp.getMeta();
    meta.put("$template", "test");
    
    // Return data (and the "meta" in it)
    return data;
};
```

The Template Engine used by `ApiGateway` can be specified by the "setTemplateEngine" function of `ApiGateway`.
The following chapters describe how to configure the built-in Template Engines.

### Mustache Template Engine

Server-side template engine based on [Mustache API](https://github.com/spullara/mustache.java).
Mustache is described as a "logic-less" system because it lacks any explicit control flow statements,
like if and else conditionals or for loops; however,
both looping and conditional evaluation can be achieved using section tags processing lists and lambdas.

::: warning Mustache dependencies
To use Mustache Template Engine, add the following dependency to the build script:  
[group: 'com.github.spullara.mustache.java', name: 'compiler', version: '0.9.14'](https://mvnrepository.com/artifact/com.github.spullara.mustache.java/compiler)
:::

**Simple example**

```java
MustacheEngine templateEngine = new MustacheEngine();
templateEngine.setTemplatePath("/www"); // Root path of templates
gateway.setTemplateEngine(templateEngine);
```

The "setTemplatePath" function defines the root directory of the templates.
This can be in the file system or on the classpath.

**Advanced example**

```java
// Development or production mode?
boolean developmentMode = true;

// Create Mustache Template Engine
MustacheEngine templateEngine = new MustacheEngine();

// Set basic properties
templateEngine.setTemplatePath("/www"); // File or classpath to templates
templateEngine.setReloadable(developmentMode); // Autoreload on/off
templateEngine.setDefaultExtension("html"); // Default extension

// Set Mustache-specific properties
DefaultMustacheFactory factory = templateEngine.getFactory();
factory.setRecursionLimit(10);

// Enable multilingualism, and language file reloading in development
// mode (language files can be in YAML or Java Properties format)
templateEngine.setMessageLoader(new DefaultMessageLoader(
                                "languages/messages", // Path and message file prefix
                                "yml", // Use YAML format (or use "properties" format)
                                developmentMode); // Autoreload on/off

// Set the Template Engine of ApiGateway
gateway.setTemplateEngine(templateEngine);
```

**Sample template syntax**

The "header" inserts a page snippet named "header.html" into the HTML page.
This "header" block will be included in every template example.  
[The following template can be called with this code.](moleculer-web.html#template-engines)

```html
<html>
    <body>
        {{> header}}
        <p>A: {{a}}</p>
        <p>B: {{b}}</p>
        <p>C: {{c}}</p>
        <table>
        {{#table}}
            <tr>
                <td>{{first}}</td>
                <td>{{second}}</td>
                <td>{{third}}</td>
            </tr>
        {{/table}}
        </table>
    </body>
</html>
```

### Handlebars Template Engine

Server-side template engine based on [Handlebars API](https://github.com/jknack/handlebars.java).
Handlebars is largely compatible with Mustache templates.
In most cases it is possible to swap out Mustache with Handlebars and continue using your current templates. 

::: warning Handlebars dependencies
To use Handlebars Template Engine, add the following dependency to the build script:  
[group: 'com.github.jknack', name: 'handlebars', version: '4.5.1'](https://mvnrepository.com/artifact/com.github.jknack/handlebars)
:::

**Simple example**

```java
HandlebarsEngine templateEngine = new HandlebarsEngine();
templateEngine.setTemplatePath("/www"); // Root path of templates
gateway.setTemplateEngine(templateEngine);
```

**Advanced example**

```java
// Development or production mode?
boolean developmentMode = true;

// Create Handlebars Template Engine
HandlebarsEngine templateEngine = new HandlebarsEngine();

// Set basic properties
templateEngine.setTemplatePath("/www"); // File or classpath to templates
templateEngine.setReloadable(developmentMode); // Autoreload on/off
templateEngine.setDefaultExtension("html"); // Default extension

// Set Handlebars-specific properties
Handlebars engine = templateEngine.getEngine();
engine.setInfiniteLoops(false);
engine.setParentScopeResolution(true);

// Enable multilingualism, and language file reloading in development
// mode (language files can be in YAML or Java Properties format)
templateEngine.setMessageLoader(new DefaultMessageLoader(
                                "languages/messages", // Path and message file prefix
                                "yml", // Use YAML format (or use "properties" format)
                                developmentMode); // Autoreload on/off

// Set the Template Engine of ApiGateway
gateway.setTemplateEngine(templateEngine);
```

**Sample template syntax**

The templates have the same syntax as the Mustache syntax.  
[The following template can be called with this code.](moleculer-web.html#template-engines)

```html
<html>
    <body>
        {{> header}}
        <p>A: {{a}}</p>
        <p>B: {{b}}</p>
        <p>C: {{c}}</p>
        <table>
        {{#table}}
            <tr>
                <td>{{first}}</td>
                <td>{{second}}</td>
                <td>{{third}}</td>
            </tr>
        {{/table}}
        </table>
    </body>
</html>
```

### DataTree Template Engine

Server-side template engine based on DataTreeTemplates API.
Small and fast template engine capable of producing html, xml, and plain text files.
The template engine works with hierarchical collection structures - similar to the Mustache Engine but with expandable features.

::: warning DataTreeTemplates dependencies
To use DataTree Template Engine, add the following dependency to the build script:  
[group: 'com.github.berkesa', name: 'datatree-templates', version: '2.0.0'](https://mvnrepository.com/artifact/com.github.berkesa/datatree-templates)
:::

**Simple example**

```java
DataTreeEngine templateEngine = new DataTreeEngine();
templateEngine.setTemplatePath("/www"); // Root path of templates
gateway.setTemplateEngine(templateEngine);
```

**Advanced example**

```java
// Development or production mode?
boolean developmentMode = true;

// Create DataTree Template Engine
DataTreeEngine templateEngine = new DataTreeEngine();

// Set basic properties
templateEngine.setTemplatePath("/www"); // File or classpath to templates
templateEngine.setReloadable(developmentMode); // Autoreload on/off
templateEngine.setDefaultExtension("html"); // Default extension

// Set DataTree-specific properties
TemplateEngine engine = templateEngine.getEngine();
engine.setTemplatePreProcessor(new SimpleHtmlMinifier());
        
// Enable multilingualism, and language file reloading in development
// mode (language files can be in YAML or Java Properties format)
templateEngine.setMessageLoader(new DefaultMessageLoader(
                                "languages/messages", // Path and message file prefix
                                "yml", // Use YAML format (or use "properties" format)
                                developmentMode); // Autoreload on/off

// Set the Template Engine of ApiGateway
gateway.setTemplateEngine(templateEngine);
```

**Sample template syntax**

Learn more about DataTreeTemplates syntax.  
[The following template can be called with this code.](moleculer-web.html#template-engines)

```html
<html>
    <body>
        #{include header}
        <p>A: #{a}</p>
        <p>B: #{b}</p>
        <p>C: #{c}</p>
        <table>
            #{for row : table}
            <tr>
                <td>#{row.first}</td>
                <td>#{row.second}</td>
                <td>#{row.third}</td>
            </tr>        
            #{end}
        </table>
    </body>
</html>
```

### FreeMarker Template Engine

Server-side template engine based on [FreeMarker API](https://freemarker.apache.org/).
Apache FreeMarker is a template engine:
a Java library to generate text output (HTML web pages, e-mails, configuration files, source code, etc.)
based on templates and changing data.
Templates are written in the FreeMarker Template Language (FTL), which is a simple, specialized language.

::: warning FreeMarker dependencies
To use FreeMarker Template Engine, add the following dependency to the build script:  
[group: 'org.freemarker', name: 'freemarker', version: '2.3.34'](https://mvnrepository.com/artifact/org.freemarker/freemarker)
:::

**Simple example**

```java
FreeMarkerEngine templateEngine = new FreeMarkerEngine();
templateEngine.setTemplatePath("/www"); // Root path of templates
gateway.setTemplateEngine(templateEngine);
```

**Advanced example**

```java
// Development or production mode?
boolean developmentMode = true;

// Create FreeMarker Template Engine
FreeMarkerEngine templateEngine = new FreeMarkerEngine();

// Set basic properties
templateEngine.setTemplatePath("/www"); // File or classpath to templates
templateEngine.setReloadable(developmentMode); // Autoreload on/off
templateEngine.setDefaultExtension("html"); // Default extension

// Set FreeMarker-specific properties
Configuration config = templateEngine.getConfiguration();
config.setAutoFlush(true);
config.setLogTemplateExceptions(true);
        
// Enable multilingualism, and language file reloading in development
// mode (language files can be in YAML or Java Properties format)
templateEngine.setMessageLoader(new DefaultMessageLoader(
                                "languages/messages", // Path and message file prefix
                                "yml", // Use YAML format (or use "properties" format)
                                developmentMode); // Autoreload on/off

// Set the Template Engine of ApiGateway
gateway.setTemplateEngine(templateEngine);
```

**Sample template syntax**

[The following template can be called with this code.](moleculer-web.html#template-engines)

```html
<html>
    <body>
        <#include "header">
        <p>A: ${a}</p>
        <p>B: ${b?string('true', 'false')}</p>
        <p>C: ${c}</p>
        <table>
            <#list table as row>
            <tr>
                <td>${row.first}</td>
                <td>${row.second?string('true', 'false')}</td>
                <td>${row.third}</td>
            </tr>        
            </#list>
        </table>
    </body>
</html>
```

### Pebble Template Engine

Server-side template engine based on [Pebble API](https://github.com/PebbleTemplates/pebble).
Pebble is a Java templating engine inspired by Twig and similar to the Python Jinja Template Engine syntax.
It features templates inheritance and easy-to-read syntax, ships with built-in autoescaping for security.

::: warning Pebble dependencies
To use Pebble Template Engine, add the following dependency to the build script:  
[group: 'io.pebbletemplates', name: 'pebble', version: '3.2.4'](https://mvnrepository.com/artifact/io.pebbletemplates/pebble)
:::

**Simple example**

```java
PebbleEngine templateEngine = new PebbleEngine();
templateEngine.setTemplatePath("/www"); // Root path of templates
gateway.setTemplateEngine(templateEngine);
```

**Advanced example**

```java
// Development or production mode?
boolean developmentMode = true;

// Create Pebble Template Engine
PebbleEngine templateEngine = new PebbleEngine();

// Set basic properties
templateEngine.setTemplatePath("/www"); // File or classpath to templates
templateEngine.setReloadable(developmentMode); // Autoreload on/off
templateEngine.setDefaultExtension("html"); // Default extension

// Enable multilingualism, and language file reloading in development
// mode (language files can be in YAML or Java Properties format)
templateEngine.setMessageLoader(new DefaultMessageLoader(
                                "languages/messages", // Path and message file prefix
                                "yml", // Use YAML format (or use "properties" format)
                                developmentMode); // Autoreload on/off

// Set the Template Engine of ApiGateway
gateway.setTemplateEngine(templateEngine);
```

**Sample template syntax**

[The following template can be called with this code.](moleculer-web.html#template-engines)

```html
<html>
    <body>
        {% include "header" %}
        <p>A: {{a}}</p>
        <p>B: {{b}}</p>
        <p>C: {{c}}</p>
        <table>
        {% for row in table %}
            <tr>
                <td>{{row.first}}</td>
                <td>{{row.second}}</td>
                <td>{{row.third}}</td>
            </tr>
        {% endfor %}
        </table>
    </body>
</html>
```

### Thymeleaf Template Engine

Server-side template engine based on [Thymeleaf API](https://www.thymeleaf.org/).
Thymeleaf's main goal is to bring elegant *natural templates* to your development workflow —
HTML that can be correctly displayed in browsers and also work as static prototypes,
allowing for stronger collaboration in development teams.

::: warning Thymeleaf dependencies
To use Thymeleaf Template Engine, add the following dependency to the build script:  
[group: 'org.thymeleaf', name: 'thymeleaf', version: '3.1.5.RELEASE'](https://mvnrepository.com/artifact/org.thymeleaf/thymeleaf)
:::

**Simple example**

```java
ThymeleafEngine templateEngine = new ThymeleafEngine();
templateEngine.setTemplatePath("/www"); // Root path of templates
gateway.setTemplateEngine(templateEngine);
```

**Advanced example**

```java
// Development or production mode?
boolean developmentMode = true;

// Create Thymeleaf Template Engine
ThymeleafEngine templateEngine = new ThymeleafEngine();

// Set basic properties
templateEngine.setTemplatePath("/www"); // File or classpath to templates
templateEngine.setReloadable(developmentMode); // Autoreload on/off
templateEngine.setDefaultExtension("html"); // Default extension

// Set Thymeleaf-specific properties
TemplateEngine engine = templateEngine.getEngine();
engine.setLinkBuilder(...);

// Enable multilingualism, and language file reloading in development
// mode (language files can be in YAML or Java Properties format)
templateEngine.setMessageLoader(new DefaultMessageLoader(
                                "languages/messages", // Path and message file prefix
                                "yml", // Use YAML format (or use "properties" format)
                                developmentMode); // Autoreload on/off

// Set the Template Engine of ApiGateway
gateway.setTemplateEngine(templateEngine);
```

**Sample template syntax**

[The following template can be called with this code.](moleculer-web.html#template-engines)

```html
<html>
    <body>
        <div th:replace="header"></div>
        <p th:text="${a}">-</p>
        <p th:text="${b}">-</p>
        <p th:text="${c}">-</p>
        <table>
            <tr th:each="row : ${table}">
                <td th:text="${row.first}">-</td>
                <td th:text="${row.second}">-</td>
                <td th:text="${row.third}">-</td>
            </tr>
        </table>
    </body>
</html>
```

## Internationalization (i18n) 

All template engines that can be used with Moleculer support multilingual interfaces.
This requires passing an object called `MessageLoader` to `TemplateEngine`.
You can write your own `MessageLoader` or use the `DefaultMessageLoader` class:

```java
templateEngine.setMessageLoader(new DefaultMessageLoader(
                                "languages/messages", // Path and message file prefix
                                "yml", // Use YAML format (or use "properties" format)
                                enableReload); // Reloadable (turn off in "production" stage)
```

In the code snippet above, the `DefaultMessageLoader` loads the message files from the "languages" directory.
The `DefaultMessageLoader` can load this directory from the classpath or from the file system.
Each file starts with the "messages" prefix,
then comes the optional language code (eg. "-en", "-en-uk", "-en-us", etc.) and then the extension (".yml").
The message file for the default language is "messages.yml".
The language files are in YAML format, with key-value pairs under the "msg" block:

```
msg:
  title: Server-side rendering
  first: First
  previous: Previous
  back: Back to main menu
```

For example the German language file is named "messages-de.yml",
located in the same directory as the default language file, and looks like this:

```
msg:
  title: Serverseitige rendering
  first: Erst
  previous: Vorherigen
  back: Zurück zum Hauptmenü
```

Similarly, the structure of the Korean language file ("messages-ko.yml") is as follows:

```
msg:
  title: 서버 측 렌더링
  first: 먼저
  previous: 이전
  back: 메인 메뉴로 돌아 가기
```

The final (used for generating) language file consists of **multiple layers**:

If the language of template is French Canadian ("fr-ca")
the language file loader will load the default language file ("messages.yml") first.
If it exists, it loads the French language file ("messages-fr.yml").
Then, if it exists, it loads the French Canadian language file ("messages-fr-ca.yml").
Then use the union of the three files (or as many as exist) to generate the template.

Therefore, it is not necessary to copy all message entries in the language files,
only those that have changed compared to the "higher level" language file.  
[There are some sample language files in this directory.](https://github.com/moleculer-java/moleculer-spring-boot-demo/tree/master/src/main/resources/languages)

Templates should refer to language constants as a common variable whose name begins with "msg.":

```html
<html>
    <body>
        ...
        <input type="submit" name="reload" value="#{msg.first}">
        ...
    </body>
</html>
```

The insertion of variables for each template works according to their own syntax:

- Pebble, Mustache and Handlebars syntax: { {msg.first} }
- DataTree syntax: #{msg.first}
- Thymeleaf and FreeMarker syntax: ${msg.first}

Language files can contain not only name-value pairs but also
[hierarchical structures](https://github.com/moleculer-java/moleculer-spring-boot-demo/blob/master/src/main/resources/languages/messages.yml#L18)
(such as the contents of drop-down lists).
For the language dependent HTML conversion add the "$template" and "$location" values to the "meta" block of the returned `Tree` structure:

```java{10,11}
Action html = ctx -> {

    // Create response JSON object
    Tree rsp = new Tree();
    // ... fill the "rsp" with data ...
    
    // The template is "/pages/index.html",
    // and the language is Canadian French:
    Tree meta = rsp.getMeta();
    meta.put("$template", "pages/index");
    meta.put("$locale",   "ca-fr");
    return rsp;
};
```

## WebSocket handling

WebSocket is a HTTP-based protocol, providing realtime communication between the server and browser.
The Moleculer API Gateway WebSocket implementation **works the same** on all Jakarta EE servers (Servlet containers) and Netty (in "standalone" run mode).
The WebSocket communication implemented by Moleculer is **not duplex**,
it can only send a message from the server to the browser (or other WebSocket client API).
Reverse (client-to-server) communication is possible **with REST** requests.
Both ways of communication can pass through HTTP firewalls.

You can send WebSocket messages from anywhere in the application using Moleculer events.
It is mandatory to insert a "path" and a "data" block in the event.
The "path" is the URL to which the WebSocket client is connected,
and "data" is the data block sent to the client.
The "data" block may contain any structure.
For example, the following structure is sent to clients that are connected to the URL "http://host:port/ws/chat":

```json{2}
{
    "path": "ws/chat",
    "data": {
        "type": "command1",
        "sample": "foo"
    }
}
```

The above WebSocket message can be sent by broadcasting it as a "websocket.send" event:

```java{4}
Tree packet = new Tree();
packet.put("path", "ws/chat");
packet.putMap("data").put("type", "command").put("sample", "foo");
broker.broadcast("websocket.send", packet);
```

The "websocket.send" event is monitored by the API Gateway and, when such an event occurs,
it forwards its content to the appropriate WebSocket clients.
In the case of a browser, the WebSocket client is
[this JavaScript module](https://github.com/moleculer-java/moleculer-spring-boot-demo/blob/master/src/main/resources/www/js/websocket.js)
.

The HTML page must include the WebSocket API ("websocket.js")
and the "app.js" application that processes incoming messages:

```html
<html>
	<head>	
		<script src="websocket.js"></script>
		<script src="app.js"></script>
	</head>
	<body>
		<div id="outDiv">WebSocket Sample</div>
	</body>
</html>
```

The structure of "app.js" that processes messages is similar to the following:

```js{6,10}
// Netty or Jakarta EE WebSocket connection
var ws;

// Handle connect
window.addEventListener("load", function(event) {
	ws = MoleculerWebsocket("ws/chat", function(msg) {
		
		// Message received from server;
		var data = JSON.parse(msg);
		if (data.type === "command") {
			var outDiv = document.getElementById("outDiv");
            outDiv.innerHTML = data.sample;
		}
		
	}, {
				
		// Set the WebSocket connection parameters
		heartbeatInterval: 60 * 1000,
		heartbeatTimeout:  10 * 1000,
		debug: true
		
	});
	ws.connect();
});

// Handle disconnect
window.addEventListener("unload", function(event) {
	if (ws) {
		ws.disconnect();
		ws = null;
	}
});
```

The first parameter of "MoleculerWebsocket" is the URL that WebSocket will connected to ("ws/chat").
The use of the "type" parameter is optional,
but can facilitate the processing of messages.
For each type of data packet,
we place different "type" parameter on the server side (eg. "command1", "command2", "command3").
And in the browser, we can decide what to do by the value of the "type".

The
[HTTP Client API](http-client.html#receiving-websocket-messages)
allows a Java Program to connect to the server via WebSocket.
As with browser communication, this connection works over an HTTP firewall.