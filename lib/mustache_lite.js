(function($){
  // Precompiled templates (JavaScript functions)
  var FN = {};

  $.render = function(tmpl, data, e) {
    var e = e ? e : escape_fn;

    return (FN[tmpl] = FN[tmpl] || Function("_", "e", "return '" +
      tmpl
        .split("\n").join("\\n")
        .split("\r").join("\\r")
        .split("'").join("\\'")
        .split("{{").join("'+(function(){try{return e(_.")
        .split("}}").join(")}catch(e){return ''}})()+'")
      + "'"
    ))(data, e);
  };

  escape_fn = function(data) {
    return data || data === 0 ? (data+'').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'): '';
  };

})(typeof top == "object" ? window.MustacheLite || (window.MustacheLite = {}) : exports);
