
jQuery(document).ready(function ($) {
    $(document).foundation({
			accordion: {
				toggleable: true
			}
		});

    function resizeParentIframe() {
        var height = Math.max($("body")[0].scrollHeight, $("body").outerHeight());
        $(parent.document).contents().find("#loader").animate({"height": height+60});

        console.log('#loader height: ' + (height+60));
    }

    resizeParentIframe();

    function keepVideoAspect(item) {
        var ratio = $(item).data("ratio");
        ratio = typeof ratio === "undefined" ? 1.7677 : eval(ratio.replace(":", "/"));
        $(item).height($(item).width() / ratio);
    }

    function init() {
        $("section[role='tab']").hide();
        $($("section[role='tab']")[0]).show();

        if ($("section[role='tab']").find(".title").children().length > 1) {
            $("section[role='tab']").each(function (i, item) {
                var bgColor = $(item).find(".content").css("background-color");
                var tabLink = $(document.createElement("a"));
                tabLink.css("background-color", bgColor);
                var $title = $(item).find(".title h1");
                var title = $title.html();
                tabLink.html(title)
                tabLink.data("section", $title.text().trim());
                $(item).data("section", $title.text().trim());
                $(item).attr("data-section", $title.text().trim());

                $(".topTabs").append(tabLink);
            });

            $(".topTabs a").wrap("<li></li>")

            $("section[role='tab']").hide();
            $($("section[role='tab']")[0]).show();


            $(".topTabs").on("click", "a", function (event) {
                var section = $(event.currentTarget).data("section");
                var item = $("section[data-section='" + section + "']");

                if ($(item).is(":visible")) {
                    return;
                } else {
                    $(".parallax-mirror").stop().fadeToggle();
                    $("section[role='tab']:visible").stop().toggle("fade", {}, 300, function() {
                        $(item).stop().toggle("fade", {}, 300, function () {
                            $(window).trigger("resize");
                            $(".parallax-mirror[data-section='" + section + "']").stop().fadeIn();
                            resizeParentIframe();
                        });
                    });


                }

            });
        }
		
		
		$(".accordion").on("click", "li", function (event) {
            if (!$(event.target).is($(event.currentTarget).find("a[role='tab']"))) {
                return;
            }
            var that = this;

            if ($(that).is(":not(.active)")) {
                $(".accordion").find(".active").not(that).removeClass('active').find(".content").slideUp("fast");
                $(that).find(".content").slideDown("fast", function(){
                    resizeParentIframe();
                });
                $(that).addClass('active');
                $(that).find(".content").addClass("active");
            } else if($(that).is(".active")) {
                $(that).removeClass('active').find(".content").slideUp("fast", function(){
                    resizeParentIframe();
                });
            }

            $(window).trigger("resize");
		 });

        $(".bodycopy").find(".kal-group").each(function(i, item) {
            keepVideoAspect(item);
        });
    }



    jQuery(window).resize(function () {
        var imageContainer = $("section[role='tab']:visible").find(".hero-image");
        if (imageContainer.find(".kal-group").is(":visible")) {
            keepVideoAspect(imageContainer);
        }

        $(".bodycopy").find(".kal-group").each(function(i, item) {
            keepVideoAspect(item);
        });
    });

    function initPlayVideo () {
        $(".play-video-button").click(function(event) {
            var target = $(event.currentTarget);
            var buttonContainer = target.parents(".video-button-container");
            var section = target.parents("section[role='tab']").data("section");
            var bgImage = $(".parallax-mirror[data-section='" + section + "']");
            bgImage.fadeToggle();

            if (!buttonContainer.hasClass("expanded")) {
                var imageContainer = target.parents(".hero-image");
                imageContainer.animate({height: (imageContainer.outerWidth()/1.78777777)}, function() {
                    imageContainer.find(".kal-group").fadeIn(function(){
                        positionControlsPanel(imageContainer.find(".kal-group").find(".controls"));
                        keepVideoAspect(this);
                    });
                });
            } else {
                var target = $(event.currentTarget);
                var imageContainer = target.parents(".hero-image");

                imageContainer.find(".kal-group").fadeOut();
                imageContainer.animate({height: bgImage.outerHeight()});
            }

            target.find(".icon").toggleClass("fa-play-circle-o");
            target.find(".icon").toggleClass("fa-close");
            target.parents(".video-button-container").toggleClass("expanded");
        });
    }

    $(document).on('ready.px.parallax.data-api', function () {
        init();
        $('.parallax-window').parallax();
        initPlayVideo();
    });



});