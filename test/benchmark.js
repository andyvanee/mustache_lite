var Benchmark = require('benchmark')
,   suite = new Benchmark.Suite
,   sample = require("./sample.js")
,   MustacheLite = require('../lib/mustache_lite.js')
,   resig = require('./others.js').tmpl
,   Handlebars = require('./others.js').Handlebars
,   handlebars_compiled = Handlebars.compile(sample.handlebars)
,   no_escape_func = function(text){ return text }
;

var output = "";

suite
.add('MustacheLite          ', function(){
  output = MustacheLite.render(sample.handlebars, sample.data);
})
.add('MustacheLite#no-escape', function(){
  output = MustacheLite.render(sample.handlebars, sample.data, no_escape_func);
})
.add('Resig                 ', function() {
  output = resig(sample.resig, sample.data);
})
.add('Handlebars            ', function() {
  output = Handlebars.compile(sample.handlebars)(sample.data);
})
.add('Handlebars#precompiled', function() {
  output = handlebars_compiled(sample.data);
})
.on('cycle', function(event) {
  console.log(String(event.target));
  if(output !== sample.expected){ console.log("!!! Output did not match expected") };
  output = "";
})
.on('complete', function() {
  console.log('\n--- Sorted Results ---\n');
  this.sort(function(a, b){
    return (a.hz > b.hz) ? -1 : 1;
  }).map(function(bench){
    console.log(bench.toString())
  });
})
.run({ 'async': true });

