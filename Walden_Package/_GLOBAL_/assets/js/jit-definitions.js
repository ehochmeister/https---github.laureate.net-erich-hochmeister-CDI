if (!window.top.console) window.top.console = {log: function (message) {
}};

//jQuery.noConflict();
function includeHoganLibrary() {
    var dfd = jQuery.Deferred();
    jQuery.getScript("//cdnjs.cloudflare.com/ajax/libs/hogan.js/3.0.2/hogan.min.js")
        .done(function( script, textStatus ) {
            dfd.resolve(true); //done
        })
        .fail(function( jqxhr, settings, exception ) {
            dfd.reject(exception); //error
        });

    return dfd.promise();
}

jQuery(document).ready(function () {
    var baseDirectory = '.';
    includeHoganLibrary().then(function() {
        jQuery.getJSON(baseDirectory + '/input.json', function (dictionaries) {
            var dictionary = dictionaries[0];
            var definitions = dictionary.definitions;
            jQuery.get("../../_GLOBAL_/assets/js/row.hogan", function(hoganTemplate) {
                var compiled = Hogan.compile(hoganTemplate);
                console.log("compiled:");
                console.dir(compiled);
                console.dir(definitions);
                jQuery.each(definitions, function (index, item) {
                    var renderedTemplate = compiled.render(item);
                    jQuery("#jit-definitions .main-table tbody").append(renderedTemplate);
                });


            });

        });
    });
});









	