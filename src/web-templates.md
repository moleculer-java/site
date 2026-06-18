# Template engines (server-side HTML)

> Part of the [Web API Gateway](moleculer-web.html). The gateway can render an `Action`'s JSON
> response to HTML with a server-side template engine — six engines are supported out of the box.

## How it works

`Actions` return data in JSON format (a [`Tree`](tree.html)). To convert that JSON to HTML, put the
template name in the **`$template` meta property** of the response. If the gateway sees a `$template`
in the response meta, it runs the configured template engine over the data and returns HTML.

This example puts three values (`a`, `b`, `c`) plus a 10-row table into the response, and renders it
with the `test.html` template:

```java
Action html = ctx -> {

    // Add some values to the "raw" JSON data, then build a table (10 rows, 3 columns):
    // {
    //     "a": 1, "b": true, "c": "xyz",
    //     "table": [ { "first": "some text", "second": false, "third": 0 }, ... ]
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

    // Put the template name ("test.html") into the response meta
    data.getMeta().put("$template", "test");

    return data;
};
```

You attach an engine to the gateway with `gateway.setTemplateEngine(...)`.

## A worked example: Mustache

[Mustache](https://github.com/spullara/mustache.java) is a "logic-less" engine — a good default.

::: warning Mustache dependency
`com.github.spullara.mustache.java:compiler:0.9.14`
:::

**Simple setup**

```java
MustacheEngine templateEngine = new MustacheEngine();
templateEngine.setTemplatePath("/www"); // root path of templates (file system or classpath)
gateway.setTemplateEngine(templateEngine);
```

**Advanced setup**

```java
boolean developmentMode = true;

MustacheEngine templateEngine = new MustacheEngine();
templateEngine.setTemplatePath("/www");          // file or classpath to templates
templateEngine.setReloadable(developmentMode);   // auto-reload on change
templateEngine.setDefaultExtension("html");      // default extension

// Engine-specific tuning (each engine exposes its native factory/config):
DefaultMustacheFactory factory = templateEngine.getFactory();
factory.setRecursionLimit(10);

// Optional i18n (see below)
templateEngine.setMessageLoader(new DefaultMessageLoader(
        "languages/messages", "yml", developmentMode));

gateway.setTemplateEngine(templateEngine);
```

**Template (`test.html`)** — the partial tag includes a shared `header.html` snippet:

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

## Choosing an engine

All six built-in engines share the **same Java API** (`setTemplatePath`, `setReloadable`,
`setDefaultExtension`, `setMessageLoader`, and `gateway.setTemplateEngine(...)`) and the same advanced
setup as Mustache above. Only the **engine class**, its **dependency** and the **template syntax**
differ — to switch, swap `new MustacheEngine()` for the class in the table and add its dependency.

| Engine | Engine class | Maven dependency |
|---|---|---|
| [Mustache](https://github.com/spullara/mustache.java) | `MustacheEngine` | `com.github.spullara.mustache.java:compiler:0.9.14` |
| [Handlebars](https://github.com/jknack/handlebars.java) | `HandlebarsEngine` | `com.github.jknack:handlebars:4.5.1` |
| [DataTree](https://berkesa.github.io/datatree-templates/) | `DataTreeEngine` | `com.github.berkesa:datatree-templates:2.0.0` |
| [FreeMarker](https://freemarker.apache.org/) | `FreeMarkerEngine` | `org.freemarker:freemarker:2.3.34` |
| [Pebble](https://github.com/PebbleTemplates/pebble) | `PebbleEngine` | `io.pebbletemplates:pebble:3.2.4` |
| [Thymeleaf](https://www.thymeleaf.org/) | `ThymeleafEngine` | `org.thymeleaf:thymeleaf:3.1.5.RELEASE` |

The value and loop syntax for the same `a` value and `table` list, per engine:

```html
Mustache / Handlebars   {{a}}            {{#table}} … {{/table}}
Pebble                  {{a}}            {% for row in table %} … {% endfor %}
DataTree                #{a}             #{for row : table} … #{end}
FreeMarker              ${a}             <#list table as row> … </#list>
Thymeleaf               th:text="${a}"   th:each="row : ${table}"
```

## Internationalization (i18n)

All of the engines above support multilingual interfaces. Pass a `MessageLoader` to the engine —
write your own or use `DefaultMessageLoader`:

```java
templateEngine.setMessageLoader(new DefaultMessageLoader(
        "languages/messages", // path and message-file prefix
        "yml",                 // YAML format (or "properties")
        enableReload));        // reloadable (turn off in production)
```

`DefaultMessageLoader` loads message files from the `languages` directory (classpath or file system).
Each file starts with the `messages` prefix, then an optional language code (`-en`, `-en-uk`,
`-de`, …) and the extension. The default-language file is `messages.yml`; entries live under a `msg`
block:

```
msg:
  title: Server-side rendering
  first: First
  previous: Previous
  back: Back to main menu
```

The final language file is built from **multiple layers**: for French Canadian (`fr-ca`) the loader
merges `messages.yml`, then `messages-fr.yml`, then `messages-fr-ca.yml` (whichever exist), so each
language file only needs the entries that differ from the level above.

Templates reference language constants via a `msg.`-prefixed variable, in each engine's own syntax:

```html
Mustache / Handlebars / Pebble   {{msg.first}}
DataTree                         #{msg.first}
FreeMarker / Thymeleaf           ${msg.first}
```

To render in a given language, add `$template` and `$locale` to the response meta:

```java{8,9}
Action html = ctx -> {

    Tree rsp = new Tree();
    // ... fill "rsp" with data ...

    // Template "/pages/index.html", rendered in Canadian French:
    Tree meta = rsp.getMeta();
    meta.put("$template", "pages/index");
    meta.put("$locale",   "ca-fr");
    return rsp;
};
```

Language files can also hold [hierarchical structures](https://github.com/moleculer-java/moleculer-spring-boot-demo/blob/master/src/main/resources/languages/messages.yml)
(such as the contents of drop-down lists). There are
[sample language files](https://github.com/moleculer-java/moleculer-spring-boot-demo/tree/master/src/main/resources/languages)
in the demo project.
