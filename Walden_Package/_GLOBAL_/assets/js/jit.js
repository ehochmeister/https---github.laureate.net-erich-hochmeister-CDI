if (!window.top.console) window.top.console = {log: function (message) {
}};

//jQuery.noConflict();
function includeQtipLibraries() {
    var dfd = jQuery.Deferred();
    jQuery('<link rel="stylesheet" href="//cdn.jsdelivr.net/qtip2/2.2.1/jquery.qtip.min.css" type="text/css" />').appendTo("head");
    //jQuery('<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/qtip2/2.2.1/jquery.qtip.min.js"></script>').appendTo("head");
    jQuery.getScript("//cdnjs.cloudflare.com/ajax/libs/qtip2/2.2.1/jquery.qtip.min.js")
        .done(function( script, textStatus ) {
            //console.log( textStatus );
            dfd.resolve(true); //done
        })
        .fail(function( jqxhr, settings, exception ) {
            dfd.reject(exception); //error
        });

    return dfd.promise();
}

jQuery(document).ready(function () {
    jQuery.fn.replaceText = function (searchRegex, dictionaryName, definition, cnt) {
        var title = escape(definition.title);
        var cssClass = definition.cssClass;
        var definitionName = definition.name;

        return this.each(function () {
            var node = this.firstChild,
                val,
                new_val,
                remove = [];
            if (node) {
                do {
                    if (node.nodeType === 3) {
                        val = node.nodeValue;
                        var name = val.match(searchRegex);
                        if (!val.match(/(\S+\.(com|net|org|edu|gov)(\/\S+)?)/)) {

                            if (name != null) {
                                if (name.length > 1) {
                                    searchRegex = new RegExp(contentName, 'i');
                                    var nameIgnoreGlobal = val.match(searchRegex);
                                    new_val = val.replace(searchRegex, '<a data-defintionname="' + definitionName
                                        + '" data-dictionaryname="' + dictionaryName
                                        + '" style="text-decoration:none;"  class="' + cssClass
                                        + ' cluetipLink" href="#tooltip" data-tooltip="' + title + '">' + nameIgnoreGlobal + '</a>');

                                } else if (name.length = 1) {
                                    new_val = val.replace(searchRegex, '<a data-defintionname="' + definitionName
                                        + '" data-dictionaryname="' + dictionaryName
                                        + '" style="text-decoration:none;"  class="' + cssClass
                                        + ' cluetipLink" href="#tooltip" data-tooltip="' + title + '">' + name + '</a>');
                                }
                                if (new_val !== val && cnt < 1) {
                                    if (/</.test(new_val)) {
                                        cnt++;
                                        jQuery(node).before(new_val);
                                        remove.push(node);
                                    } else {
                                        node.nodeValue = new_val;
                                    }
                                }
                            }
                        }
                    }
                } while (node = node.nextSibling);
            }
            remove.length && jQuery(remove).remove();
        });
    };

    function replace(dictionaryName, definition) {
        var name = "\\b" + definition.name + "\\b";
        name = name.replace(/\s\s*/i, '\\s\\s*');
        searchRegex = new RegExp(name, 'i');
        if (definition.type == "html") {
            jQuery(":not(h1,h2)").replaceText(searchRegex, dictionaryName, definition, 0);
        } else if (type == "iframe") {
            var embededsrc = "<iframe width='300' height='260' src='" + title + "' frameborder='0' allowfullscreen></iframe>";
            jQuery("*").replaceText(searchRegex, '<a class="iframe" href="#tooltip" data-iframe-src="' + embededsrc + '">' + name + '</a>');
        }
    };

    function escape(text) {
        return text.replace(/[<>\&\"\']/g, function (c) {
            return '&#' + c.charCodeAt(0) + ';';
        });
    }

    function usageRequest(dictionaryName, definitionName) {
        this.courseId = baseUsageRequest.courseId;
        this.userId = baseUsageRequest.userId;
        this.dictionaryName = dictionaryName;
        this.definitionName = definitionName;
    }

    var laur = window.top.laur;
    var baseDirectory = '.';
    var baseUsageRequest = {};
    var postAddress = "/webapps/laur-jit-editor-BBLEARN/usagetracking";

    if (laur != undefined && laur.jit != undefined) {
        if (laur.jit.config != undefined) {
            baseDirectory = laur.jit.config.baseDirectory == undefined ? baseDirectory : laur.jit.config.baseDirectory;
            postAddress = laur.jit.config.postAddress == undefined ? postAddress : laur.jit.config.postAddress;
        }
        baseUsageRequest = laur.jit.baseUsageRequest == undefined ? baseUsageRequest : laur.jit.baseUsageRequest;
    }

    var clueTipCloseText = '<img src="' + baseDirectory + '/images/cross.png" alt="close" />';  // text (or HTML) to to be clicked to close sticky clueTips


    jQuery("<style type='text/css'>.glossary-qtip .qtip-bootstrap .qtip-icon .ui-icon, .glossary-qtip .qtip-icon .ui-icon { font-size:1.2rem !important; font-weight: bold;width:13px  !important; line-height:11px  !important; float:none  !important } .glossary-qtip .qtip-close.qtip-icon {   border-radius: 15px  !important; width: 15px  !important; height:15px !important; background: #fff !important;} .cluetipLink{border-bottom:1px dashed; } .glossary-qtip.qtip { font-size: 1.2rem !important; font-family: inherit !important; line-height: inherit !important; }</style>").appendTo("head");

    includeQtipLibraries().then(function() {
        //console.log("GOT IT!!");
        jQuery.getJSON(baseDirectory + '/input.json', function (dictionaries) {
            //console.dir(dictionaries[0]);
            var dictionary = dictionaries[0];
            var definitions = dictionary.definitions;
            jQuery.each(definitions, function (index) {
                replace(dictionary.name, definitions[index]);
            });

            jQuery('.smallToolTip').qtip({
                show: {
                    event: 'click'
                },
                "style": {
                    classes: 'glossary-qtip qtip-bootstrap qtip-shadow',
                    "width": "350px",
                    "fontSize": "1.2rem"
                },
                "content": {
                    attr: 'data-tooltip',
                    button: 'Close'
                },
                hide: {
                    event: false
                },
                position: {
                    my: 'left center',
                    viewport: jQuery(window)
                }
            });

            jQuery('.mediumToolTip').qtip({
                show: {
                    event: 'click'
                },
                "style": {
                    classes: 'glossary-qtip qtip-bootstrap qtip-shadow',
                    "width": "400px",
                    "fontSize": "1.2rem"
                },
                "content": {
                    attr: 'data-tooltip',
                    button: 'Close'
                },
                hide: {
                    event: false
                },
                position: {
                    my: 'left center',
                    viewport: jQuery(window)
                }
            });


            jQuery('.largeToolTip').qtip({
                show: {
                    event: 'click'
                },
                "style": {
                    classes: 'glossary-qtip qtip-bootstrap qtip-shadow',
                    "width": "550px",
                    "height": "300px",
                    "fontSize": "1.2rem"
                },
                "content": {
                    attr: 'data-tooltip',
                    button: 'Close'
                },
                hide: {
                    event: false
                },
                position: {
                    my: 'left center',
                    viewport: jQuery(window)
                }
            });

            jQuery('.smallToolTip, .largeToolTip, .mediumToolTip').click(function(event) {
                jQuery('.smallToolTip, .largeToolTip, .mediumToolTip').each(function(i, item) {
                    var tip = jQuery(item).qtip("api");
                    tip.hide();
                });
            });

        });
    });
});









	