function loadRaphaelAnimationWithName(name) {
    var path = "/math/wp-content/themes/editor/js/compiled/" + name + "_compiled.js";
    jQuery.ajax({
      url: path,
      dataType: "script",
      success: function(script) {
          console.log("Got script for animation [" + name + "]");
          require([name]);
      }
    }).fail(function( jqxhr, settings, exception ) {
        console.log("Failed to load animation [" + name + "]. See details below");
        console.log(jqxhr, settings, exception);
    });
}