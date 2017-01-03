// Override Laureate's Kaltura script that injects Twitter Bootstrap into our page
// Their lack of use of closures here is my gain!
function includeBootstrap () {
    return false;
}

// Initialize Zurb Foundation
jQuery(document).foundation({
    "magellan-expedition": {
        destination_threshold: 400 // pixels from the top of destination for it to be considered active
    }
});

// Hacky way to style links containing images
jQuery(document).ready(function(jQuery) {
    jQuery("article a img").parent().addClass("has-image");
});

// Ensure proper padding between sections if it got missed
jQuery(document).ready(function(jQuery) {
    jQuery(".section-break").before( '<div class="padding"/>' );
});

// Make entire Call to Action clickable, based on its first link
// If it has a _target attribute, open said link in a new window
jQuery(".cta a[href]:first-child").each(function(index, el) {
    var url = jQuery(this).attr("href");
    var target = jQuery(this).attr("target");
    var parent = jQuery(this).closest('.cta');
    console.log(url,target);
    if(url) {
        jQuery(parent).addClass("clickable");
        jQuery(parent).bind( "click", function(event) {
            var anchor = jQuery(parent).find("a[href]:first-child");
            url = jQuery(anchor).attr("href");
            console.log("destiny url = " + url)
		    if(target) {
				window.open( url, target + Math.floor(Math.random()*999999) ); // http://stackoverflow.com/a/2358532/1167354
				return false;
			} else {
				window.location = url;
				return false;
			}
		});
	}
});

// Toggleable Navigation for Small Breakpoint
jQuery('.hero nav label').click(function() {
    jQuery(this).siblings('.week-navigation').children('li').toggle('fast');
});

// Print in Browser
jQuery('img[alt="Print"]').click(function () {
    window.print();
});

// Focus on top of off-canvas, even when we're further down the page
jQuery(".right-off-canvas-toggle").click(function() {
    window.scrollTo(0,0);
});

// Look for Magellan nav elements in the page and set their attributes
// http://foundation.zurb.com/docs/components/magellan.html
jQuery("[data-magellan-arrival]").each(function(index, el) {
    var id = jQuery(el).attr('data-magellan-arrival');
    jQuery('#'+id).attr('data-magellan-destination',id);
});

// Add Divider Line Above "Week 1" in Right-Nav
jQuery( "#menu .side-nav li a:contains('Week 1')" ).addClass("divider");


jQuery('blockquote .kal-group').each(function(index, el) {
    jQuery(this).closest('blockquote').addClass('kaltura').removeClass('clickable');
});

// Offset in-page anchors to avoid being overlapped by fixed header
// http://stackoverflow.com/questions/10732690/offsetting-an-html-anchor-to-adjust-for-fixed-header
// https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onhashchange
jQuery(function(){

    // debug
    // if ("onhashchange" in window) {
    // 	console.info("This browser supports the hashchange event.");
    // }

    function locationHashChanged() {
        var jQueryanchor = jQuery(location.hash);
        var fixedElementHeight = 90; // Approximate height of the fixed navigation
        if (jQueryanchor.length > 0) {
            window.scrollTo(0, jQueryanchor.offset().top - fixedElementHeight);
        }
    }

    window.onhashchange = locationHashChanged;

});


// Apply styles to fixed sub-navigation when scrolling
// https://css-tricks.com/scroll-fix-content/
// Disabled here because it doesn't work super well in iOS, requires testing

// var scrollElement = jQuery("header.hero nav");

// jQuery(document).on( 'scroll', scrollElement, function(){

// 	var position = jQuery('body').scrollTop();

// 	if (position) {
// 		scrollElement.addClass("fixed");
// 	} else {
// 		scrollElement.removeClass("fixed");
// 	}

// });