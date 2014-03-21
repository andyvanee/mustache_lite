var MustacheLite = require('../lib/mustache_lite.js');
require('./bdd.js');

var $ = {
  render: MustacheLite.render
};

describe('Renderer', function(){
  // Assume that template data is coming from untrusted sources
  // Broken API's, stubborn users, malicious hackers, cats, ...

  it('replaces similar to {{mustache}}', function(){
    var template = 'x = {{x}}'
    ,   data = {x: 'example'}
    ;
    assert.equal($.render(template, data), 'x = example');
  });

  it('escapes html by default', function(){
    var template = 'x = {{x}}'
    ,   data = {x: '<script>nasty</script>'}
    ;
    assert.equal($.render('{{x}}', data), '&lt;script&gt;nasty&lt;/script&gt;');
  });

  it('can be passed an empty replace function', function(){
    var template = '{{x}}'
    ,   data = {x: '<script>nasty</script>'}
    ,   escape_fn = function(text){ return text; }
    ;
    assert.equal($.render(template, data, escape_fn), '<script>nasty</script>');
  });

  it('can be passed a custom escape function', function(){
    var template = '{{x}}'
    ,   data = {x: 'custom-replace-function'}
    ,   escape_fn = function(text){ return text.replace(/-/g, '!')}
    ;
    assert.equal($.render('{{x}}', data, escape_fn), 'custom!replace!function');
  });

  it('can nest attributes', function(){
    var template = '{{x.y}}'
    ,   data = {x: {y: 'example'}}
    ;
    assert.equal($.render(template, data), 'example');
  });

  it('can handle undefined attributes', function(){
    var data = {};
    assert.equal($.render('{{x}}', data), '');
    assert.equal($.render('{{x.y.z}}', data), '');
  });

  it('handles null, undefined and zero values', function(){
    var template = '{{x}}-{{y}}-{{z}}'
    ,   data = {x: false, y: null, z: 0}
    ;
    assert.equal($.render(template, data), '--0');
  });
});

describe('Template', function(){
  // Assume that developers are writing templates. Templates are code.
  // They only need the bare minimum sanitization and error checking

  it('throws an error on mismatched braces', function(){
    var data = {x: 'example'}
    ,   error
    ;
    try { $.render('{{x}', data) } catch (e) { error = e }
    assert.equal(error.name, 'SyntaxError');
    error = null;

    try { $.render(' }} example {{ ') } catch (e) { error = e; }
    assert.equal(error.name, 'SyntaxError');
  });

  it('misbehaves if the template looks weird', function(){
    var template1 = 'hello {{x}}}'
    ,   template2 = 'hello {{{x}}'
    ,   data = {x: 'example'}
    ,   error;

    assert.equal($.render(template1, data), 'hello example}');

    try {
      $.render(template2, data);
    } catch (e) {
      error = e;
    }
    assert.equal(error.name, 'SyntaxError');
  });

  it('passes through nearby braces', function(){
    var template = '{ {{ x }} }'
    ,   data = {x: 'example'}
    ;
    assert.equal($.render(template, data), '{ example }');
  });

  it('handles the common string characters', function(){
    var data = {x: 'example'}
    ,   template = "\t<p> ' {{x}} ' </p>\n";
    assert.equal($.render(template, data), "\t<p> ' example ' </p>\n");
  });

  it("doesn't handle strange template characters", function(){
    var template = '\u2028\u2029'
    ,   error
    ;
    try { assert.equal($.render(template, {}), "") } catch(e) { error = e }
    assert.equal(error.name, 'SyntaxError');
  });
});

