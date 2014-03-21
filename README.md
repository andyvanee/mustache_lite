A small templating library. A hybrid between mustache and riot.js(render)

See test/test.js for example usage.

A custom escaping function (or pass-through) can be used for extremely fast rendering:

```
MustacheLite#no-escape x 1,218,350 ops/sec ¬±0.99% (90 runs sampled)
Resig                  x 267,121 ops/sec ¬±0.76% (93 runs sampled)
Handlebars#precompiled x 112,767 ops/sec ¬±0.71% (88 runs sampled)
MustacheLite           x 96,037 ops/sec ¬±0.81% (96 runs sampled)
Handlebars             x 1,828 ops/sec ¬±1.08% (92 runs sampled)
```
