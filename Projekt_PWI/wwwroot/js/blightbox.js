"use strict";

var lightbox = function lightbox(config) {
    var defaults = $.extend({
        durationShowLightbox: 500,
        durationHideLightbox: 500,
        durationShowContent: 500,
        durationHideContent: 500,
        wrap: false,
        desktopResolution: 992
    }, config);

    var $next;
    var $prev;
    var timeout;
    var clickedLink;
    var lightboxTrigger;
    var titleLightbox;
    var descriptionLightbox;
    var x;

    $("[data-lightbox-trigger]").on("click", function (e) {

        e.preventDefault();

        $("body").css("overflow", "hidden");

        $("#gifLightbox").stop().animate({
            opacity: 1
        }, 200);

        titleLightbox = $(this).attr("data-lightbox-title");
        descriptionLightbox = $(this).attr("data-lightbox-description");

        //GET LINK HREF
        var imageHref = $(this).attr("href");

        if ($("#lightbox").length > 0) {
            $("#titleLightbox").html(titleLightbox);
            $("#descriptionLightbox").html(descriptionLightbox);
            $("#lightbox #contentLightbox img").attr("src", imageHref);
        } else {
            var lightbox = '<div id="overlayLightbox"></div>' + '<div id="lightbox">' + '<img id="gifLightbox" src="./imgLightbox/loading.gif"/>' + '<div id="containerLightbox">' + '<div id="closeLightbox"></div>' + '<div id="textLightbox">' + '<h1 id="titleLightbox">' + titleLightbox + '</h1>' + '<div id="borderLightbox"></div>' + '<p id="descriptionLightbox">' + descriptionLightbox + '</p>' + '</div>' + '<div id="contentLightbox">' + //INSERT CLICKED LINK
            '<img src="' + imageHref + '" />' + '</div>' + '<div id="arrowsLightbox">' + '<div id="prevLightbox"></div>' + '<div id="nextLightbox"></div>' + '</div>' + '</div>' + '</div>';

            //INSERT LIGHTBOX HTML INTO PAGE
            $("body").append(lightbox);
        }

        clickedLink = $(this);

        lightboxTrigger = $(this).attr("data-lightbox-trigger");

        $next = $("#lightbox").find("#nextLightbox");
        $prev = $("#lightbox").find("#prevLightbox");

        if ($("[data-lightbox-trigger='" + lightboxTrigger + "']").index($(clickedLink)) === $("[data-lightbox-trigger='" + lightboxTrigger + "']").length - 1 && !defaults.wrap) {
            $next.css("opacity", "0.5");
            $prev.css("opacity", "1");
        } else if ($("[data-lightbox-trigger='" + lightboxTrigger + "']").index($(clickedLink)) === 0 && !defaults.wrap) {
            $prev.css("opacity", "0.5");
            $next.css("opacity", "1");
        }

        $("#overlayLightbox").show();

        //SHOW LIGHTBOX ANIMATIONS
        $("#lightbox").show().stop().animate({
            height: $(window).innerHeight()
        }, defaults.durationShowLightbox, function () {
            setValues();
        });
        $("#lightbox #gifLightbox").stop().animate({
            opacity: 0
        }, 100);

        $("#containerLightbox").clearQueue().stop().delay(defaults.durationShowLightbox).animate({
            opacity: 1
        }, defaults.durationShowContent);
    });
    //NEXT IMAGE
    $("body").on("click", "#nextLightbox", function (e) {
        if (e.target.id !== "nextLightbox") return;

        x = $("[data-lightbox-trigger='" + lightboxTrigger + "']").index($(clickedLink));
        x++;

        move(x, -70, e);
    });

    //PREV IMAGE
    $("body").on("click", "#prevLightbox", function (e) {
        if (e.target.id !== "prevLightbox") return;

        x = $("[data-lightbox-trigger='" + lightboxTrigger + "']").index($(clickedLink));

        x--;

        move(x, 70, e);
    });
    var move = function move(num, _move, e) {
        $("#nextLightbox, #prevLightbox").css("opacity", "1");
        $("#contentLightbox, #textLightbox").clearQueue().stop().animate({
            left: _move,
            opacity: 0
        }, {
            queue: false,
            duration: 400
        }).promise().then(function () {
            //WHEN ANIMATION IS ENDED
            $("#gifLightbox").stop().animate({
                opacity: 1
            }, 200);

            var nextIMG = $("[data-lightbox-trigger='" + lightboxTrigger + "']")[num];

            clickedLink = nextIMG;

            var imageHref = $(nextIMG).attr("href");

            //IF NOT WRAP THE IMAGES AND THERE ISN'T NEXT IMAGE AND NEXT ARROW WAS CLICKED
            if (!defaults.wrap && num + 1 > $("[data-lightbox-trigger='" + lightboxTrigger + "']").length - 1 && e.target.id === "nextLightbox") {
                clickedLink = $("[data-lightbox-trigger='" + lightboxTrigger + "']")[$("[data-lightbox-trigger='" + lightboxTrigger + "']").length - 1];
                imageHref = $(clickedLink).attr("href");
                $next.css("opacity", "0.5");
                // $("#nextLightbox").css("opacity", "0.5");
            }
            //IF NOT WRAP THE IMAGES AND THERE ISN'T PREVIOUS IMAGE AND PREV ARROW WAS CLICKED
            else if (!defaults.wrap && num - 1 < 0 && e.target.id === "prevLightbox") {
                    clickedLink = $("[data-lightbox-trigger='" + lightboxTrigger + "']"[0]);
                    imageHref = $(clickedLink).attr("href");
                    $prev.css("opacity", "0.5");
                    // $("#prevLightbox").css("opacity", "0.5");
                }
                //IF WRAP IMAGES AND IT IS THE THE LAST IMAGE AND NEXT ARROW WAS CLICKED
                else if (defaults.wrap && num > $("[data-lightbox-trigger='" + lightboxTrigger + "']").length - 1 && e.target.id === "nextLightbox") {
                        clickedLink = $("[data-lightbox-trigger='" + lightboxTrigger + "']")[0];
                        nextIMG = clickedLink;
                        imageHref = $(clickedLink).attr("href");
                    }
                    //IF WRAP IMAGES AND IT IS THE FIRST IMAGE AND PREV ARROW WAS CLICKED
                    else if (defaults.wrap && num < 0 && e.target.id === "prevLightbox") {
                            clickedLink = $("[data-lightbox-trigger='" + lightboxTrigger + "']")[$("[data-lightbox-trigger='" + lightboxTrigger + "']").length - 1];;
                            nextIMG = clickedLink;
                            imageHref = $(clickedLink).attr("href");
                        }

            $("#lightbox #contentLightbox img").attr("src", imageHref);

            //CHANGE TITLE AND DESCRIPTION
            titleLightbox = $(nextIMG).attr("data-lightbox-title");
            descriptionLightbox = $(nextIMG).attr("data-lightbox-description");

            $("#titleLightbox").html(titleLightbox);
            $("#descriptionLightbox").html(descriptionLightbox);

            $("#lightbox #contentLightbox img").on("load", function () {
                //WHEN IMAGE IS LOADED  
                setValues();

                $("#gifLightbox").stop().animate({
                    opacity: 0
                }, 100, function () {
                    $("#contentLightbox, #textLightbox").css("left", -_move + "px").clearQueue().stop().animate({
                        left: 0,
                        opacity: 1
                    }, {
                        queue: false,
                        duration: 400
                    });
                });
            });
        });
    };

    //WIDTH OF TextLightbox AND HEIGHT, TOP OF ARROWS
    var setValues = function setValues() {
        $("#containerLightbox").css("width", "");

        if ($(window).innerWidth() >= defaults.desktopResolution) $("#containerLightbox").css("width", $("#contentLightbox").innerWidth());

        $("#textLightbox").css({
            "width": $("#contentLightbox").innerWidth(),
            "height": $("#textLightbox").innerHeight()
        });
    };

    //RESIZE
    $(window).on("resize", function () {
        $("#lightbox").css("height", $(window).innerHeight())

        if ($(window).innerWidth() < defaults.desktopResolution) {
            // $("#prevLightbox, #nextLightbox").css({"top": "","height": ""});
            $("#containerLightbox").css("width", "");
            $("#textLightbox").css({
                "width": $("#contentLightbox").innerWidth(),
                "height": $("#textLightbox").innerHeight()
            });
        } else {
            setValues();
        }
    });

    //HIDE LIGHTBOX
    $("body").on("click", "#lightbox, #containerLightbox, #closeLightbox", function (e) {
        if (e.target !== this) return;
        clearTimeout(timeout);
        $("body").css("overflow", "visible");

        //HIDE LIGHTBOX ANIMATIONS
        $("#containerLightbox").stop().animate({
            opacity: 0
        }, defaults.durationHideContent);

        $("#lightbox").clearQueue().stop().delay(defaults.durationHideContent).animate({
            height: 0
        }, defaults.durationHideLightbox);

        timeout = setTimeout(function () {
            //AFTER ANIMATION REMOVE HTML
            $("#lightbox, #overlayLightbox").hide();
        }, defaults.durationHideContent + defaults.durationHideLightbox);
    });
};
