::: warning For Node.js developers: this is **not** `moleculer-runner`
Despite the name, the Java **Runner** is *not* the Node.js `moleculer-runner`. It does **not** load
services from a folder by configuration and has **no hot reload**. It is a small launcher that
starts / stops / installs a **Spring** Moleculer application reliably (UDP-triggered shutdown, running
as a Windows service). If you only want to add a Java service to a Node.js system you do not need it —
see [A minimal Java service](minimal-service.html); register services with `broker.createService(...)`.
:::

## Types of Moleculer Runners

Moleculer Runner is a helper object that helps you start and stop
[Spring-based](https://spring.io/) Moleculer applications.
The Spring-based application can be a "classic"
[XML-based](https://docs.spring.io/spring/docs/4.2.x/spring-framework-reference/html/xsd-configuration.html)
Spring application or an XML-less
[Spring Boot](https://spring.io/projects/spring-boot) application.
There are two sub-types of Moleculer Runner:

- Standalone runtime, with (optional) Netty Server (it's the `services.moleculer.config.MoleculerRunner`)
- Servlet-based Jakarta EE runtime (implemented in `services.moleculer.web.servlet.MoleculerServlet`)

## Standalone runtime

XML-based Spring application example (starter command / BAT file):

```{4}
java.exe -classpath <all JARS>
         -Dlogging.config=/cfg/logging-production.properties
         services.moleculer.config.MoleculerRunner // Moleculer Runner class
         path/to/application.xml                   // File-or classpath to XML config
         6786                                      // UDP port for stop command (optional)
         secret123                                 // Stop password (optional)
```

Spring Boot application example (starter command / BAT file):  
[Source of a complete BAT file to start service](https://github.com/moleculer-java/moleculer-spring-boot-demo/blob/master/installer/bin/development-start.bat)

```{5}
java.exe -classpath <all JARS>
         -Dlogging.config=/cfg/logging-development.properties
         -Dspring.profiles.active=development      // Spring Profile
         services.moleculer.config.MoleculerRunner // Moleculer Runner class
         my.application.MoleculerApplication       // Your Spring Boot Application class
         6786                                      // UDP port for stop command (optional)
         secret123                                 // Stop password (optional)
```

Regular shutdown of a running Moleculer process (the first program parameter is "stop"):  
[Source of a complete BAT file to stop service](https://github.com/moleculer-java/moleculer-spring-boot-demo/blob/master/installer/bin/development-stop.bat)

```{4}
java.exe -classpath <all JARS>
         -Dlogging.config=/cfg/logging-production.properties
         services.moleculer.config.MoleculerRunner // Moleculer Runner class
         stop                                      // Always "stop"
         6786                                      // UDP port for stop command (optional)
         secret123                                 // Stop password (optional)
```

> **Why UDP?** The stop command is a tiny, fire-and-forget **UDP** datagram on the local machine
> (default port `6786`, guarded by the optional password) — a dependency-free way for an installer,
> service wrapper or BAT file to ask the JVM to shut down **gracefully**, without opening a JMX or HTTP
> management endpoint.

With "tomcat7.exe" and "tomcat7w.exe", MoleculerRunner can run as a **Windows Service**.
The easiest way to do this is to copy the
[Inno Setup script](https://github.com/moleculer-java/moleculer-spring-boot-demo/blob/master/installer/moleculer.config.iss)
that creates the installer from
[this directory](https://github.com/moleculer-java/moleculer-spring-boot-demo/tree/master/installer)
and modify the required properties (eg. the "ProgramName", "CompanyName" and replace all occurences of "MoleculerJava"
with your own short program ID, for example "BackendApp01" (without spaces).

::: warning Legacy approach
The `tomcat7.exe` / `tomcat7w.exe` (Apache Commons Daemon **procrun**) + Inno Setup installer is the
**legacy** way to run as a Windows service, kept for existing deployments. For new deployments prefer a
container or a process supervisor — **Docker**, a **systemd** unit on Linux, or
[**WinSW**](https://github.com/winsw/winsw) on Windows — wrapping the plain
`services.moleculer.config.MoleculerRunner` start/stop commands shown above.
:::

See the
[previous section](logging.html#logging-in-standalone-runtime-mode)
for more information about logger configuration in standalone mode.

## Servlet-based runtime

The Moleculer Servlet can also load an XML-based or Spring Boot-based application.
It's built on the standard Jakarta Servlet 6.0 API (Jakarta EE 10).
This Servlet is compatible with the following Servlet Containers / Jakarta EE Servers:

- Apache Tomcat V10.1 and V11
- Eclipse Jetty V12
- Red Hat JBoss EAP V8 / WildFly V31+
- GlassFish Server Open Source Edition V7
- Payara Server V6
- IBM WebSphere Liberty / Open Liberty

Adding the
[Moleculer Web API Gateway](moleculer-web.html#about-api-gateway)
module to the dependency list requires Servlet-based deployment.

**XML-based** Spring application example (web.xml):

```xml{13,14}
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee" ...>
    <listener>
        <listener-class>services.moleculer.web.servlet.websocket.EndpointDeployer</listener-class>
    </listener>
    <servlet>
        <servlet-name>Moleculer Servlet</servlet-name>
        <servlet-class>services.moleculer.web.servlet.MoleculerServlet</servlet-class>

        <!-- YOUR SPRING BOOT APPLICATION CLASS -->
        
        <init-param>
            <param-name>moleculer.config</param-name>
            <param-value>/WEB-INF/application.xml</param-value>
        </init-param>

        <!-- ... -->
                
        <async-supported>true</async-supported>        
    </servlet>
    <servlet-mapping>
        <servlet-name>Moleculer Servlet</servlet-name>
        <url-pattern>/*</url-pattern>
    </servlet-mapping>
</web-app>
```

**Spring Boot** application example (web.xml):

```xml{13,14}
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee" ...>
    <listener>
        <listener-class>services.moleculer.web.servlet.websocket.EndpointDeployer</listener-class>
    </listener>
    <servlet>
        <servlet-name>Moleculer Servlet</servlet-name>
        <servlet-class>services.moleculer.web.servlet.MoleculerServlet</servlet-class>

        <!-- YOUR SPRING BOOT APPLICATION CLASS -->
        
        <init-param>
            <param-name>moleculer.application</param-name>
            <param-value>my.application.MoleculerApplication</param-value>
        </init-param>

        <!-- ... -->
                
        <async-supported>true</async-supported>        
    </servlet>
    <servlet-mapping>
        <servlet-name>Moleculer Servlet</servlet-name>
        <url-pattern>/*</url-pattern>
    </servlet-mapping>
</web-app>
```

[Example of complete web.xml](https://github.com/moleculer-java/moleculer-spring-boot-demo/blob/master/src/main/webapp/WEB-INF/web.xml)