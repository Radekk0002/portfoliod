"use strict";

(function ($) {
    $.fn.gallery = function (config) {
        var defaults = $.extend({
            desktopResolution: 768, //+
            columnsOnMobile: 2, //+
            elementsOnMobile: 4, //-
            elementsOnDesktop: 3, //-
            slideAnimationTime: 400,
            slideAnimationTimeDesktop: 400, //+
            hideButtonSection: 200,
            showButtonSection: 200,
            hideSectionAnimationTime: 600, //+
            showNewSectionAnimationTime: 600, //+
            lazyLoading: true, //+
            defaultChangeSection: true,
            createSectionContainer: true,
            createButtonContainer: true,
            sections: []

        }, config);

        return this.each(function () {

            var $t = $(this);
            var $sections = $t.find("[data-sl-section]");
            var $pickSections = $t.find("[data-section]");
            var $sectionsDivs = $sections.children("div");
            var $defaultActiveSectionButton = $t.find("[data-section].active").data("section");
            var defaultActiveSectionButtonStyles;
            var $NotActiveSectionButton;
            var notActiveSectionButtonStyles;

            var clickedSection;

            var movement = 0;
            var fires = 0;

            var ElementsHideFrom = -defaults.elementsOnMobile;
            var ElementsHideTo = 0;
            var ElementsSlideFrom = 0;
            var ElementsSlideTo = defaults.elementsOnMobile;
            var elementsToShow = defaults.elementsOnMobile;

            var elementSlideDesktTo = defaults.elementsOnDesktop;

            var lastElements = 0;
            var slideDeskt = 0;

            var waitResize;

            var clonedSectionsButtons;
            var sectionButtonsParent;

            $(window).on("load", function () {

                //CREATE NEXT PREV BUTTONS
                if (defaults.createButtonContainer === true) {
                    $sections.wrapAll("<div class='containerGallery'></div>");
                    var buttonContainer = "<div class='slider-move-container'>" + "<div data-sl-move='prev'></div>" + "<div class='dot'></div>" + "<div data-sl-move='next'></div>" + "</div>";

                    $(buttonContainer).insertAfter($(".containerGallery", $t));
                }

                //CREATE SECTION CONTAINER
                if (defaults.createSectionContainer === true) {
                    var sectionDivs = "<div class='active' style='border-spacing: 1.4px; transform: scale(1.4);'></div>";

                    //CREATE AS MUCH DIVS AS IS SECTIONS
                    for (var i = 1; i < defaults.sections.length; i++) {
                        sectionDivs += "<div></div>";
                    }
                    var sectionContainer = "<div class='section-container'>" + "<div class='sections'>" + sectionDivs + "</div>" + "<div class='sectionLine'></div>" + "</div>";
                    $(sectionContainer).insertBefore($(".containerGallery", $t));

                    if (defaults.defaultChangeSection === true) {
                        //  ALL EXCEPT FIRST DIV - (TO ANIMATE BUTTONS)
                        $(".sections>div:nth-child(n+2)", $t).css("borderSpacing", 1);
                    }
                }

                // NAME SECTIONS
                if (defaults.sections.length !== 0 || defaults.createSectionContainer === true) {

                    //SET ALL DATA SECTION ATTRIBUTE AND THEIR VALUES
                    $(".sections", $t).children().each(function (el) {
                        $(this).attr("data-section", defaults.sections[el]);
                    });

                    //SET NEW VALUE
                    $pickSections = $t.find("[data-section]");

                    //SET ALL VALUES FOR DATA-SL-SECTION ATTRIBUTE
                    $(".containerGallery", $t).children().each(function (el) {
                        $(this).attr("data-sl-section", defaults.sections[el]);
                    });
                    //SET CLASS "show-section" TO FIRST DATA IN "defaults.sections"
                    $defaultActiveSectionButton = $pickSections.first().data("section");
                }

                $NotActiveSectionButton = $t.find("[data-section]:not(.active)").data("section");

                defaultActiveSectionButtonStyles = $("[data-section='" + $defaultActiveSectionButton + "']").attr("style");

                notActiveSectionButtonStyles = $("[data-section='" + $NotActiveSectionButton + "']").attr("style");

                $("[data-sl-section='" + $defaultActiveSectionButton + "']", $t).css({
                    "display": "inline-block",
                    "font-size": 0
                }).addClass("show-section");

                if ($(window).innerWidth() < defaults.desktopResolution) {
                    $(".containerGallery", $t).css("height", "");
                    setValues(defaults.elementsOnMobile, defaults.columnsOnMobile);

                } else if ($(window).innerWidth() >= defaults.desktopResolution) {
                    $(".containerGallery", $t).css("height", "");
                    setValues(defaults.elementsOnDesktop);
                    $("[data-sl-move=prev]").css("opacity", "0.15");

                }

                clickedSection = $("[data-section].active", $t).data("section");

                if (clickedSection === "undefined") {
                    clickedSection = $("[data-sl-section]:first", $t).data("sl-section")
                }
                if ($(".show-section", $t).length <= 0) {
                    $("[data-sl-section]:first", $t).addClass("show-section")
                }

                loadImages(clickedSection);

                sectionButtonsParent = $($pickSections).parent();
                clonedSectionsButtons = sectionButtonsParent.html()
            });

            //NEXT
            $($t).on("click", "[data-sl-move=next]", function (e) {
                //MOBILE
                if ($(window).innerWidth() < defaults.desktopResolution) {
                    ElementsHideFrom = ElementsSlideFrom;
                    ElementsHideTo = ElementsSlideTo;
                    ElementsSlideFrom += elementsToShow;
                    ElementsSlideTo += elementsToShow;

                    moveMobile(ElementsHideFrom, ElementsHideTo, ElementsSlideFrom, ElementsSlideTo, movement, e);
                }
                //DESKTOP
                else {
                    elementSlideDesktTo++;
                    moveDesktop(elementSlideDesktTo, e);
                }
            });

            //PREV
            $($t).on("click", "[data-sl-move=prev]", function (e) {
                //MOBILE
                if ($(window).innerWidth() < defaults.desktopResolution || $(window).innerWidth() >= defaults.desktopResolution && defaults.sameSlidingAnimationOnDesktop === true) {
                    ElementsHideFrom = ElementsSlideFrom;
                    ElementsHideTo = ElementsSlideTo;
                    ElementsSlideFrom -= elementsToShow;
                    ElementsSlideTo -= elementsToShow;

                    moveMobile(ElementsHideFrom, ElementsHideTo, ElementsSlideFrom, ElementsSlideTo, -movement, e);
                }
                //DESKTOP
                else {
                    elementSlideDesktTo--;
                    moveDesktop(elementSlideDesktTo, e);
                }
            });

            //MOVE SLIDER DIVS ON MOBILE
            var moveMobile = function moveMobile(hideFrom, hideTo, slideFrom, slideTo, left, evt) {

                if ($(".show-section>div:nth-child(" + slideTo + ")", $t).length <= 0 && $(evt.target).attr("data-sl-move") === "prev") {
                    hideFrom = 0;

                    hideTo = elementsToShow;

                    ElementsHideFrom = $(".show-section>div", $t).length - $(".show-section>div", $t).length % elementsToShow + elementsToShow;

                    ElementsHideTo = ElementsHideFrom + elementsToShow;

                    ElementsSlideFrom = $(".show-section>div", $t).length - $(".show-section>div", $t).length % elementsToShow;

                    ElementsSlideTo = ElementsSlideFrom + elementsToShow;

                    lastElements = $(".show-section>div", $t).length - $(".show-section>div", $t).length % elementsToShow;

                    if ($(".show-section>div", $t).length % elementsToShow === 0) {
                        lastElements = $(".show-section>div", $t).length - elementsToShow;

                        ElementsHideFrom -= elementsToShow;

                        ElementsHideTo -= elementsToShow;

                        ElementsSlideFrom -= elementsToShow;

                        ElementsSlideTo -= elementsToShow;
                    }
                    slideFrom = lastElements;

                    slideTo = $(".show-section>div", $t).length;
                }

                $(".show-section>div", $t).slice(hideFrom, hideTo).animate({
                    left: -left * 1.1,
                    opacity: 0
                }, {
                    queue: false,
                    duration: defaults.slideAnimationTime,
                    complete: function complete() {
                        $(this).css('display', "none");
                        // IF THERE IS NO OTHER DIV RETURN TO FIRST DIVS
                        if ($(".show-section>div:nth-child(" + (slideFrom + 1) + ")", $t).length <= 0 && $(evt.target).attr("data-sl-move") === "next") {
                            ElementsHideFrom = hideFrom = -elementsToShow;
                            ElementsHideTo = hideTo = 0;
                            ElementsSlideFrom = slideFrom = 0;
                            ElementsSlideTo = slideTo = elementsToShow;
                        }

                        $(".show-section>div", $t).slice(slideFrom, slideTo).css({
                            "opacity": 0,
                            "left": left * 1.1,
                            "display": "inline-block"
                        }).animate({
                            left: 0,
                            opacity: 1
                        }, {
                            queue: false,
                            duration: defaults.slideAnimationTime
                        });
                    }
                });
            };

            // MOVE SLIDER DIVS ON DESKTOP

            var moveDesktop = function moveDesktop(slideToDeskt, evt) {
                $("[data-sl-move=prev]").css("opacity", "1");
                if (slideToDeskt <= defaults.elementsOnDesktop) {
                    $("[data-sl-move=prev]").css("opacity", "0.15");
                }

                if (slideToDeskt + 1 === defaults.elementsOnDesktop && $(evt.target).attr("data-sl-move") === "prev") {
                    elementSlideDesktTo = elementsToShow;
                    return;
                }

                // IF THERE IS NO OTHER DIV RETURN TO FIRST DIVS
                if ($(".show-section>div:nth-child(" + slideToDeskt + ")", $t).length <= 0 && $(evt.target).attr("data-sl-move") === "next") {
                    $(".show-section", $t).animate({
                        left: "0"
                    }, defaults.slideAnimationTime * 2);

                    elementSlideDesktTo = elementsToShow;
                    $("[data-sl-move=prev]").css("opacity", "0.15");
                    return;
                }

                slideDeskt = -($(".containerGallery", $t).innerWidth() / defaults.elementsOnDesktop) * (slideToDeskt - defaults.elementsOnDesktop);

                $(".show-section", $t).animate({
                    left: slideDeskt
                }, {
                    queue: false,
                    duration: defaults.slideAnimationTime,
                    complete: function complete() {}
                });
            };

            //CHANGE SECTION
            $($t).on("click", "[data-section]", function (e) {
                clickedSection = $(e.target).data("section");
                changeSection();
            });

            var changeSection = function changeSection() {
                if (defaults.defaultChangeSection === true) {

                    //ANIMATE SECTION BUTTONS
                    $($pickSections).stop(false, false).removeClass("active").animate({
                        "border-spacing": 1
                    }, {
                        queue: false,
                        duration: defaults.hideButtonSection,
                        step: function step(now) {
                            $(this).css("transform", "scale(" + now + ")");
                        },
                        complete: function complete() {
                            $("[data-section='" + clickedSection + "']", $t).stop(false, false).addClass("active").animate({
                                "border-spacing": 1.4
                            }, {
                                queue: false,
                                duration: defaults.showButtonSection,
                                easing: "swing",
                                step: function step(x) {
                                    $(this).css("transform", "scale(" + x + ")");
                                }
                            });
                        }
                    });
                } else if (typeof defaults.defaultChangeSection === "function") {
                    defaults.defaultChangeSection();
                }
                fadeInOutNewSection(clickedSection);
            };

            var fadeInOutNewSection = function fadeInOutNewSection(section) {
                loadImages(section);

                //IF IMAGES ARE CACHED
                if ($("[data-sl-section='" + section + "'] img", $t)[0].complete) {
                    fadingAnimation()
                }
                //IF IMAGES ARE NOT CACHED
                $("[data-sl-section='" + section + "'] img", $t).on("load", function () {
                    fadingAnimation()
                });


            };
            //FADE OUT AND FADE IN NEW SECTION ANIMATION 
            var fadingAnimation = function () {
                $($sections).stop().animate({
                    opacity: 0
                }, {
                    queue: false,
                    duration: defaults.hideSectionAnimationTime,
                    complete: function complete() {
                        $(this).css("display", "none").removeClass("show-section");
                        $("[data-sl-section='" + clickedSection + "']", $t).css({
                            "display": "inline-block",
                            "opacity": 0
                        }).addClass("show-section").stop().animate({
                            opacity: 1
                        }, {
                            queue: false,
                            duration: defaults.showNewSectionAnimationTime
                        });
                        if ($(window).innerWidth() < defaults.desktopResolution) {
                            setValues(defaults.elementsOnMobile, defaults.columnsOnMobile);
                        } else {
                            setValues(defaults.elementsOnDesktop);
                            $("[data-sl-move=prev]").css("opacity", "0.15");
                        }
                    }
                });
            }
            var loadImages = function loadImages(section) {
                if (defaults.lazyLoading === true) {
                    var divs = $("[data-sl-section='" + section + "']", $t).find("[data-sl-src]");
                    divs.map(function (index) {
                        if ($(divs[index]).data("sl-src") !== "") {
                            var imgSrc = $(divs[index]).data("sl-src");
                            $(divs[index]).find("img").attr("src", imgSrc);
                            $(divs[index]).attr("data-sl-src", "");
                        }
                    });
                }
            };

            $(window).on("resize load", function () {
                clearTimeout(waitResize)
                // waitResize = setTimeout(function(){

                waitResize = setTimeout(function () {
                    $(".containerGallery", $t).css("width", "");
                    $(".containerGallery", $t).css("height", "");
                    //RESET ONLY IF RESOLUTION BREAKPOINT WAS REACHED (1 TIME) (MOBILE)
                    if ($(window).innerWidth() < defaults.desktopResolution && fires) {
                        fullReset();
                        fires = 0;
                    }

                    //RESET ONLY IF RESOLUTION BREAKPOINT WAS REACHED (1 TIME) (DESKTOP)
                    else if ($(window).innerWidth() >= defaults.desktopResolution && !fires) {
                        fullReset();
                        $($sections).css("overflow", "visible");
                        fires = 1;
                    }

                    if ($(window).innerWidth() >= defaults.desktopResolution) {
                        $(".containerGallery", $t).css("width", $(".show-section").innerWidth());
                        slideDeskt = -($(".containerGallery", $t).innerWidth() / defaults.elementsOnDesktop) * (elementSlideDesktTo - defaults.elementsOnDesktop);
                        $(".show-section", $t).css("left", slideDeskt);
                    }
                    $(".containerGallery", $t).css("height", $(".containerGallery", $t).innerHeight());
                    movement = $(".show-section", $t).innerWidth();
                }, 300)
            })

            var setValues = function setValues(el, col) {
                ElementsHideFrom = -el;
                ElementsHideTo = 0;
                ElementsSlideFrom = 0;
                ElementsSlideTo = el;

                elementSlideDesktTo = el;

                elementsToShow = el;

                $($sectionsDivs).attr("style", "");

                if ($(window).innerWidth() < defaults.desktopResolution) {
                    movement = $(".show-section", $t).innerWidth();

                    var maxHeight = 100 / (el / col) + "%";

                    var maxWidth = 100 / col + "%";

                    if (col >= el) {
                        maxHeight = "100%";
                    } else if (defaults.columnsOnMobile === 1) {
                        maxHeight = 100 / el + "%";
                    }

                    // IF ELEMENTS ON MOBILE DIVIDED BY COLUMNS ON MOBILE GIVS DECIMAL THEN GET UNIT NUMBER AND ADD 1
                    else if (el % col !== 0) {
                        maxHeight = 100 / (Math.floor(el / col) + 1) + "%";
                    }
                    $($sectionsDivs).css("display", "none");

                    $("[data-sl-section]>div:nth-child(-n+" + el + ")", $t).css("display", "inline-block");
                    movement = $(".show-section", $t).innerWidth();
                } else {
                    var maxHeight = "100%";
                    var maxWidth = 100 / el + "%";
                    $($sections).css("left", "");
                    $("[data-sl-section]>div", $t).css("display", "inline-block");
                }

                $($sectionsDivs).css({
                    "height": maxHeight,
                    "width": maxWidth
                });
            };

            var fullReset = function fullReset() {
                $($sections).removeClass("show-section").css({
                    "display": "none",
                    "opacity": 0
                });
                $("[data-section]", $t).attr("style", notActiveSectionButtonStyles).removeClass("fading active");
                $("[data-section='" + $defaultActiveSectionButton + "']", $t).attr("style", defaultActiveSectionButtonStyles).addClass("active");
                $(".containerGallery", $t).css("height", "");
                $($sections).css("white-space", "normal");
                $("[data-sl-section='" + $defaultActiveSectionButton + "']", $t).css({
                    "display": "inline-block",
                    "opacity": 1,
                    "font-size": 0
                }).addClass("show-section");

                if ($(window).innerWidth() < defaults.desktopResolution) {
                    setValues(defaults.elementsOnMobile, defaults.columnsOnMobile);
                    $("[data-sl-move=prev]").css("opacity", "1");
                    $($sections).css("left", "");
                } else {
                    setValues(defaults.elementsOnDesktop);
                    $($sections).css("white-space", "nowrap");
                    $("[data-sl-move=prev]").css("opacity", "0.15");
                    slideDeskt = 0;
                }

                $(".containerGallery", $t).css("height", $(".containerGallery", $t).innerHeight());

                //RESET ALL SECTION BUTTONS
                $("[data-section]", $t).detach();
                sectionButtonsParent.append(clonedSectionsButtons);
            };
        });
    };
})(jQuery);