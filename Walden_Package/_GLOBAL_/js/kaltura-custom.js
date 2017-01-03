/**
 *  Kaltura embedding library.
 *  Tested with jQuery v1.4.4 - v1.9.1
 *
 */

var originalContainer = [];
var videoConfiguration;
var videoData = [];
var players = [];

var functionCount = 0;

var videoDataTemplate;
var LIBRARY_DOMAIN_BASE_PATH = "https://kalmedia.laureate.net/emb/";
var _kalturaPlayerLibraryInitialized = false;



function getGlobalConfigUrl(skin) {
    skin = skin.toLowerCase();
    switch(skin) {
        case "walden":
            return LIBRARY_DOMAIN_BASE_PATH + "WAL/config/globalPlayerConfig.json";
        case "sfu":
            return LIBRARY_DOMAIN_BASE_PATH + "SFU/config/globalPlayerConfig.json";
        case "nhu":
            return LIBRARY_DOMAIN_BASE_PATH + "NHU/config/globalPlayerConfig.json";
        case "jhu":
            return LIBRARY_DOMAIN_BASE_PATH + "JHU/config/globalPlayerConfig.json";
        case "lnp":
            return LIBRARY_DOMAIN_BASE_PATH + "LNP/config/globalPlayerConfig.json";
        case "lio":
            return LIBRARY_DOMAIN_BASE_PATH + "LIO/config/globalPlayerConfig.json";
        case "tua":
            return LIBRARY_DOMAIN_BASE_PATH + "TUA/config/globalPlayerConfig.json";
        case "loe":
            return LIBRARY_DOMAIN_BASE_PATH + "LOE/config/globalPlayerConfig.json";
        default:
            return LIBRARY_DOMAIN_BASE_PATH + "WAL/config/globalPlayerConfig.json";;
    }
}

function includeBootstrap () {
    jQuery('head').append('<script src="' + LIBRARY_DOMAIN_BASE_PATH + 'player/js/bootstrap.min.js"></script>');
    jQuery('head').append('<script src="' + LIBRARY_DOMAIN_BASE_PATH + 'player/js/modernizr.custom.js"></script>');
    jQuery('head').append('<link rel="stylesheet" type="text/css" href="' + LIBRARY_DOMAIN_BASE_PATH + 'player/css/bootstrap.qa.min.css">');
    //jQuery('head').append('<link rel="stylesheet" type="text/css" href="' + LIBRARY_DOMAIN_BASE_PATH + 'player/css/fontello.css">');
}

function cleanupOldVersions () {
    jQuery(".controls").remove();
    jQuery(".kal-group").append("<div class='controls'></div>");

}

function closeControlsPanel(slideButton, parentControlsPanel) {
    slideButton.removeClass("expanded");
    var r = parentControlsPanel.outerWidth(true) - slideButton.outerWidth(true) - slideButton.position().left * 2
    parentControlsPanel.stop().animate({right: -r}, 500);
    slideButton.children(".icon").addClass("icon-menu").removeClass("icon-angle-right");
}

function positionControlsPanel (controlsSelector) {
    //position controls button
    //console.info("positioning controls for video: " + controlsSelector.parents(".kal-group").data("name"));
    var slideButton = jQuery(controlsSelector).find(".kalPlayer-slideButton");
    jQuery(slideButton).each(function(i, button) {
        var parentControlsPanel = jQuery(button).parents(".controls");
        parentControlsPanel.css("width", parentControlsPanel.outerWidth(true) + 1);
        var r = parentControlsPanel.outerWidth(true) - slideButton.outerWidth(true) - slideButton.position().left * 2
        parentControlsPanel.stop().animate({"right": -r});
        parentControlsPanel.css("width", "");
        closeControlsPanel(jQuery(button), jQuery(parentControlsPanel));
    })
}


function prepareControls () {
    var playerToggler = '<button type="button" class="playerToggler btn btn-sm btn-inverse" data-toggle="button"></button>';
    jQuery(".controls").append(playerToggler);
    jQuery(".controls .playerToggler").attr("aria-label", 'Accessible player');
    jQuery(".controls .playerToggler").attr("title", 'Accessible player');
    jQuery(".controls .playerToggler").removeClass("btn-inverse").addClass("btn-primary");
    jQuery(".controls .playerToggler").html("<span class='icon glyphicon icon-wheelchair'></span><span class='sr-only' aria-label='Accessible player'>Accessible player</span>");

    jQuery(".controls .playerToggler").button();

    jQuery('.controls').on("focusin",".playerToggler, select",function(event) {
        setTimeout(function() {             // setTimeout makes sure that this runs after
            // the original problem (it had a delay)
            jQuery(event.target).parents('.kal-group').scrollLeft(0);
        }, 0);
    });

    var slideButton = "<button class='kalPlayer-slideButton btn btn-info btn-sm' title='Options' aria-label='Options'><span class='icon icon-menu'></span></button>";
    jQuery(".controls").css("right", 0);
    jQuery(".controls").prepend(slideButton);

    jQuery(".controls").on("touchstart click", '.kalPlayer-slideButton', function(event){
        var target = jQuery(event.currentTarget);
        var parentControlsPanel = target.parents(".controls");
        if(target.hasClass("expanded")) {
            closeControlsPanel(target, parentControlsPanel);
        } else {
            target.addClass("expanded");
            var newLeft = parentControlsPanel.data("expandedPos");
            parentControlsPanel.stop().animate({right:0}, 500);
            target.children(".icon").removeClass("icon-menu").addClass("icon-angle-right");
        }
    });
}

function responsiveResize (playerSelector) {
    /*var kdp = document.getElementById(jQuery(playerSelector).attr("id"));

    player.removeAttr("style");
    var w = player.parents(".kal-group").width();
    var h = player.parents(".kal-group").height();
    //console.log("kal group is: ( " + w + " x " + h + " )")
    if (typeof kdp === 'undefined' || kdp == null || !kdp.hasOwnProperty("kBind")) {
        //console.log("with css");
        player.css("width", w);
        player.css("height", h);
    } else {
        //console.log("with kdp");
        kdp.setAttribute("width", w);
        kdp.setAttribute("height", h);
        if (!jQuery(kdp).is("object")) { //is using HTML5
            //console.log("AND CSS");
            player.css("width", "100%");
            player.css("height", "100%");
            player.find("iframe").css("width", "100%")
            player.find("iframe").css("height", "100%")
        }
    }*/
    var player = jQuery(playerSelector);
    positionControlsPanel(player.parents(".kal-group").find(".controls"));
}

jQuery(document).ready(function () {
    if (!_kalturaPlayerLibraryInitialized) {
        _kalturaPlayerLibraryInitialized = true;
        addControlEventsHandling();
        includeBootstrap();
        cleanupOldVersions();
        prepareControls();

        jQuery(".kal-group .player").each(function(i, item) {
            responsiveResize(jQuery(item));
        });

        //jQuery(document).find("body").append(generateDownloadingIframe());

        //get global config
        setTimeout(function() {
            var skin = jQuery("script[data-skin-name]").attr("data-skin-name");
            jQuery.ajax(getGlobalConfigUrl(skin),
                {
                    "crossDomain": true,
                    "dataType": "jsonp",
                    "jsonpCallback": "onGotGlobalconfiguration"
                })
                .success(function (data) {
                    //console.log("success!! : " + data);
                })
                .fail(function (jqxhr, textStatus, error) {
                    var err = textStatus + ', ' + error;
                    //console.log("Request Failed: " + err);
                });
        }, 100)


    }
});

function addControlEventsHandling() {
    jQuery(".kal-group").on('touchstart click', '.playerToggler', function (event) {

        var toggleButton = jQuery(event.currentTarget);

        var videoUiConfiguration = videoConfiguration.accessiblePlayerId;
        var focusVideo = false;

        if (toggleButton.hasClass("active")) {
            jQuery(toggleButton.parents(".controls")).stop().animate({"top":0}, 300);
            jQuery(event.target).find(".icon").addClass("icon-wheelchair").removeClass("icon-ccw");
            toggleButton.button('reset');
            videoUiConfiguration = videoConfiguration.defaultPlayerId;
        } else {
            jQuery(toggleButton.parents(".controls")).stop().animate({"top":"80px"}, 300);
            jQuery(event.target).find(".icon").removeClass("icon-wheelchair").addClass("icon-ccw");
            focusVideo = true;
        }
        toggleButton.button("toggle");
        toggleButton.button("toggle");

        var group = jQuery(event.currentTarget).parents(".kal-group");
        var videoName = videoData[group.attr("data-name")].videoReferenceId;
        //console.log("videoName : " + videoName);
        var originalPlayer = originalContainer[videoName];
        var videoId = originalPlayer.attr("id");

        //console.log("videoId : " + videoId);

        kWidget.destroy(videoId);
        group.find(".videoWrapper").empty();
        group.find(".videoWrapper").prepend(originalPlayer.clone());

        var data = videoData[videoName];

        /*thumbEmbedVideo(videoConfiguration.partnerId, videoName, videoId,
         videoUiConfiguration, videoConfiguration.flashvars, data.videoServerId, data.width, data.height);*/
        embedVideo(videoConfiguration.partnerId, videoName, videoId,
            videoUiConfiguration, videoConfiguration.flashvars, data.width, data.height, focusVideo);
        jQuery("#" + videoId).focus();
    });


    jQuery(window).resize(function () {
        //console.log("resize!");
        jQuery(players).each(function(i, id) { responsiveResize(jQuery("#"+id))});
    });
}

function onGotGlobalconfiguration(data) {
    //jQuery('head').append('<link rel="stylesheet" type="text/css" href="' + data.css + '">');
    var kalturaMainLibrary = sprintf(data.kalturaBaseLibrary, data.partnerId, data.accessiblePlayerId);

    jQuery.getScript(kalturaMainLibrary, function () {
        videoConfiguration = data;
        var qsParameters = getQueryStringParams();

        videoConfiguration.flashvars.userId = qsParameters.uid;
        videoConfiguration.flashvars.applicationName = qsParameters.app;
        videoConfiguration.flashvars.playbackContext = qsParameters.c;

        videoDataTemplate = videoConfiguration.cdnBasePath + "/{0}.json?callback=onGotVideo"

        renderVideos();
    });
}

function addVideoWrapper(data) {
    var playerContainerParent = jQuery("div[data-name=" + data.videoReferenceId + "]");
    var playerWrapper = jQuery("<div></div>");
    jQuery(playerWrapper).height(data.height + "px");
    jQuery(playerWrapper).addClass("videoWrapper");

    jQuery(playerWrapper).width("100%");
    jQuery(playerWrapper).height("100%");

    var playerContainer = jQuery(playerContainerParent).find(".player");
    playerContainer.wrap(playerWrapper);
}

function onGotVideo(data) {
    videoData[data.videoReferenceId] = data;
    var playerContainerParent = jQuery("div[data-name='" + data.externalId + "']");
    var playerContainer = jQuery(playerContainerParent).find(".player");
    playerContainer.attr("id", data.videoReferenceId);
    jQuery("div[data-name='" + data.externalId + "']").attr("data-name", data.videoReferenceId);
    addVideoWrapper(data);


    originalContainer[data.videoReferenceId] = playerContainer.clone();

    var downloadableSelect = generateDownloadableSelect(data);

    if (downloadableSelect) {
        playerContainerParent.find(".controls").append(downloadableSelect);
        jQuery(downloadableSelect).change(function (event) {
            var value = jQuery(event.currentTarget).val();
            if (value != "--") {
                var win = window.open(value, "downloadWindow");
                win.title = jQuery(event.currentTarget).find(":selected").text();
                //window.location.href = value;
            }
        });

        positionControlsPanel(playerContainerParent.find(".controls"));
    }

    embedVideo(videoConfiguration.partnerId, data.videoReferenceId, playerContainer.attr("id"),
        videoConfiguration.defaultPlayerId, videoConfiguration.flashvars, data.width, data.height, false);
    /*thumbEmbedVideo(videoConfiguration.partnerId, data.id, playerContainer.attr("id"),
     videoConfiguration.defaultPlayerId, videoConfiguration.flashvars, data.videoServerId);*/
}


function renderVideos() {
    jQuery(".kal-group").each(function (i, item) {
        var playerContainer = jQuery(item).find(".player");
        var videoMetadataPath = jQuery(item).attr("data-name");

        var url = sprintf(videoDataTemplate, videoMetadataPath);

        // create a new script element
        var script = document.createElement('script');
        // set the src attribute to that url
        script.setAttribute('src', url);
        // insert the script in out page
        document.getElementsByTagName('head')[0].appendChild(script);

    });
}

function onEmbedVideo (playerId) {
    jQuery("#" + playerId).focus();
}

function isChrome() {
    return Boolean(window.chrome);
}

function onVideoReadyCallback (playerId) {
    //console.log("ready call back onvideoready !!! id:" + playerId)
    players.push(playerId);
    responsiveResize(jQuery("#" + playerId));
}

function getVideoData(partnerId, videoId, playerContainerId, videoUiConfiguration, flashvars, entryId, width, height, focusVideo) {
    var localFlashvars;
    if (flashvars != undefined) {
        localFlashvars = jQuery.extend(true, {}, flashvars);
    }

    localFlashvars.referenceId = videoId;
    var lang = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
    if (lang.indexOf("en-") == -1) { //is not english
        localFlashvars.closedCaptionsOverPlayer.defaultLanguageKey = lang;
    }

    /*if (Modernizr.video && isChrome()) {
        console.info("is crhome, going html5!")
        mw.setConfig( 'KalturaSupport.LeadWithHTML5', true );
    }*/

    var videoData = {
        "targetId": playerContainerId,
        "wid": "_" + partnerId,
        "flashvars": localFlashvars,
        "uiconf_id": videoUiConfiguration,
        "readyCallback": onVideoReadyCallback,
        "params" : {
            "seamlessTabbing":"true"
        }
    };

    if (focusVideo) {
        videoData.readyCallback = function(playerId){
            //console.log("ready call back focus!!!")
            onVideoReadyCallback(playerId);
            onEmbedVideo(playerId);
        };

    }

    /*if (width != undefined) {
     videoData.width = width;
     }
     if (height != undefined) {
     videoData.height = height;
     }*/

    /*if (entryId != null) {
     videoData.entry_id = entryId;
     }*/
    return videoData;
}

function thumbEmbedVideo(partnerId, videoId, playerContainerId, videoUiConfiguration, flashvars, entryId, width, height) {
    var videoData = getVideoData(partnerId, videoId, playerContainerId, videoUiConfiguration, flashvars, entryId);
    kWidget.thumbEmbed(videoData);
}

function embedVideo(partnerId, videoId, playerContainerId, videoUiConfiguration, flashvars, width, height, focusVideo) {
    var videoData = getVideoData(partnerId, videoId, playerContainerId, videoUiConfiguration, flashvars, null, width, height, focusVideo);
    kWidget.embed(videoData);
}


function generateDownloadableSelect(videoData) {
    var selectElement = jQuery("<select />")
    jQuery(selectElement).attr("class", "darkStyle");

    var videoOptionElement, audioOptionElement, transcriptOptionElement;

    jQuery(selectElement).append("<option value='--'>--Downloads--</option>")

    if (videoData.offlineVideo && videoData.offlineVideo != "") {
        videoOptionElement = generateOptionElement(videoData.offlineVideo, "Download Video w/CC");
        jQuery(selectElement).append(videoOptionElement);
    }
    if (videoData.audio && videoData.audio != "") {
        audioOptionElement  = generateOptionElement(videoData.audio, "Download Audio");
        jQuery(selectElement).append(audioOptionElement);
    }
    if (videoData.transcript && videoData.transcript != "") {
        transcriptOptionElement  = generateOptionElement(videoData.transcript, "Download Transcript");
        jQuery(selectElement).append(transcriptOptionElement);
    }

    return jQuery(selectElement).children().length > 1 ? selectElement : null;

}

function generateOptionElement(valueData, label) {
    var optionElement = jQuery("<option />");
    jQuery(optionElement).attr("value", valueData);
    jQuery(optionElement).html(label);

    return optionElement;
}

function generateDownloadingIframe() {
    var iframeElement = jQuery("<iframe></iframe>");
    jQuery(iframeElement).attr("id", "downloadHelper");
    return iframeElement;
}

function sprintf() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
}

function getQueryStringParams() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getFunctionName() {
    return "_" + ((functionCount++).toString(16));
}




//IE8 fix for split with regex
var split;
// Avoid running twice; that would break the `nativeSplit` reference
split = split || function (undef) {

    var nativeSplit = String.prototype.split,
        compliantExecNpcg = /()??/.exec("")[1] === undef, // NPCG: nonparticipating capturing group
        self;

    self = function (str, separator, limit) {
        // If `separator` is not a regex, use `nativeSplit`
        if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
            return nativeSplit.call(str, separator, limit);
        }
        var output = [],
            flags = (separator.ignoreCase ? "i" : "") +
                (separator.multiline  ? "m" : "") +
                (separator.extended   ? "x" : "") + // Proposed for ES6
                (separator.sticky     ? "y" : ""), // Firefox 3+
            lastLastIndex = 0,
        // Make `global` and avoid `lastIndex` issues by working with a copy
            separator = new RegExp(separator.source, flags + "g"),
            separator2, match, lastIndex, lastLength;
        str += ""; // Type-convert
        if (!compliantExecNpcg) {
            // Doesn't need flags gy, but they don't hurt
            separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
        }
        /* Values for `limit`, per the spec:
         * If undefined: 4294967295 // Math.pow(2, 32) - 1
         * If 0, Infinity, or NaN: 0
         * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
         * If negative number: 4294967296 - Math.floor(Math.abs(limit))
         * If other: Type-convert, then use the above rules
         */
        limit = limit === undef ?
            -1 >>> 0 : // Math.pow(2, 32) - 1
            limit >>> 0; // ToUint32(limit)
        while (match = separator.exec(str)) {
            // `separator.lastIndex` is not reliable cross-browser
            lastIndex = match.index + match[0].length;
            if (lastIndex > lastLastIndex) {
                output.push(str.slice(lastLastIndex, match.index));
                // Fix browsers whose `exec` methods don't consistently return `undefined` for
                // nonparticipating capturing groups
                if (!compliantExecNpcg && match.length > 1) {
                    match[0].replace(separator2, function () {
                        for (var i = 1; i < arguments.length - 2; i++) {
                            if (arguments[i] === undef) {
                                match[i] = undef;
                            }
                        }
                    });
                }
                if (match.length > 1 && match.index < str.length) {
                    Array.prototype.push.apply(output, match.slice(1));
                }
                lastLength = match[0].length;
                lastLastIndex = lastIndex;
                if (output.length >= limit) {
                    break;
                }
            }
            if (separator.lastIndex === match.index) {
                separator.lastIndex++; // Avoid an infinite loop
            }
        }
        if (lastLastIndex === str.length) {
            if (lastLength || !separator.test("")) {
                output.push("");
            }
        } else {
            output.push(str.slice(lastLastIndex));
        }
        return output.length > limit ? output.slice(0, limit) : output;
    };

// For convenience
    String.prototype.split = function (separator, limit) {
        return self(this, separator, limit);
    };

    return self;
}();
