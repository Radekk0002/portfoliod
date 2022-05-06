"use strict";

//Set full height on header

var windowWidthPrev = $(window).innerWidth();
$("header").css("height", $(window).innerHeight())

//Show, close nav

$("#navButton").on("click", function () {
    $(this).toggleClass("active");
    $("nav").toggleClass("active");
});

//Click anywhere to hide nav

$("main, header, footer").on("click", function () {
    $("#navButton").removeClass("active");
    $("nav").removeClass("active");
});

//Slide if you are on the appropriate height

var navIds = [];

$(window).on("load", function () {
    $("#navContainer").children().each(function (index, id) {

        navIds.push($(id).attr("id"));
    });
});

var debounce_timer = void 0;
var scrollPosition = void 0;
var portfolioFromTop = void 0;
var portfolioHeight = void 0;
var windowHeight = void 0;

$(window).on("scroll load", function () {
    
        if (debounce_timer) {
            window.clearTimeout(debounce_timer);
        }

        debounce_timer = window.setTimeout(function () {
            scrollPosition = $(this).scrollTop();
            windowHeight = $(window).height();

            var infoFromTop = $(".info").offset().top;

            portfolioFromTop = $(".portfolio").offset().top;
            portfolioHeight = $(".portfolio").outerHeight(true);

            var aboutMeFromTop = $(".aboutMe").offset().top;
            if (!$(".contact").hasClass("active")){

            if (scrollPosition > infoFromTop / 2.8) {
                $(".info").addClass("active");
            }
            if (scrollPosition > portfolioFromTop - (windowHeight / 1.5)) {
                $(".portfolio").addClass("active");
            }
            if (scrollPosition > aboutMeFromTop - (windowHeight / 1.5)) {
                $(".aboutMe").addClass("active");
            }
        }

            //CHECK IN WHICH SECTION YOU ARE
            navIds.forEach(function (el) {
                if (scrollPosition >= $("." + el).offset().top - windowHeight * 0.4) {
                    $(".currentNavSection").removeClass("currentNavSection");

                    if (scrollPosition >= $(document).innerHeight() - (windowHeight/1.8)) {
                        $("#" + navIds[navIds.length - 1]).addClass("currentNavSection");
                        return;
                    }

                    $("#" + el).addClass("currentNavSection");
                }
            });
        }, 20);
    
});

// //Scroll to clicked section

// $("#navContainer>p").on("click", function (e) {
//     var nameID = e.target.id;
//     var goTo = "." + nameID;

//     $("html, body").stop(true).animate({
//         scrollTop: $(goTo).offset().top
//     }, 2000);
// });

// //Scroll to portfolio section

// $(".portfolioButton").on("click", function () {
//     $("html, body").animate({
//         scrollTop: $(".portfolio").offset().top
//     }, 2000);
// });

//Scroll to clicked section

Math.customEasing = function (t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
};

$("#navContainer>p").on("click", function (e) {
    const nameID = e.target.id
    const goTo = "." + nameID;
    changeScrollPosition($(goTo))
});

//Scroll to portfolio section

$(".portfolioButton").on("click", function () {
    changeScrollPosition($(".portfolio"))
});

var changeScrollPosition = function(el){
    var currentOffset = document.documentElement.scrollTop;
    var offsetTo = el.offset().top;
    var change = offsetTo - currentOffset
    var duration = change / 2;
    if (duration < 0) duration = -duration
    var currentTime = 0;
    var increment = 8;

    function animateScroll() {
        function scrollStep() {
            currentTime += increment
            var val = Math.customEasing(currentTime, currentOffset, change, duration);
            window.scrollTo(0, val)
            if (currentTime < duration) {
                requestAnimationFrame(scrollStep)
            } else {
                return
            }
        }
        window.requestAnimationFrame(scrollStep);
    }
    animateScroll()
}

//Resize - set 100vh on header (URL bar bug)

$(window).on('resize', function () {
    if ($(window).innerWidth() !== windowWidthPrev) {     //Only when width is changing
        $("header").css("height", $(window).innerHeight())
    }
    windowWidthPrev = $(window).innerWidth();
})


//Gallery

$(".portfolio").gallery({
    desktopResolution: 992, //+
    columnsOnMobile: 2, //+
    elementsOnMobile: 4, //-
    elementsOnDesktop: 3, //-
    slideAnimationTime: 500,
    slideAnimationTimeDesktop: 400, //+
    hideSectionAnimationTime: 600, //+
    showNewSectionAnimationTime: 600, //+
    lazyLoading: true, //+
    defaultChangeSection: $(".portfolio").on("click", "[data-section]", function (e) {

        $("[data-order]").removeClass("active fading")
        var clickedSectionData = $(e.target).attr("data-order")
        var clickedSection = $("[data-order='" + clickedSectionData + "']")

        clickedSection.addClass("active")
        setTimeout(function () { //Give time to remove class
            if (clickedSectionData === "3") {
                $("[data-order=1]").addClass("fading")
                $("[data-order=2]").attr("data-order", "4")
                $("[data-order=3]").attr("data-order", "2")
                $("[data-order=1]").attr("data-order", "3")
                $("[data-order=4]").attr("data-order", "1")

            } else if (clickedSectionData === "1") {
                $("[data-order=3]").addClass("fading")
                $("[data-order=2]").attr("data-order", "4")
                $("[data-order=1]").attr("data-order", "2")
                $("[data-order=3]").attr("data-order", "1")
                $("[data-order=4]").attr("data-order", "3")
            }
        },10)
    }),
    createSectionContainer: false,
    createButtonContainer: true,
});



//LIGHTBOX
lightbox({
    durationShowLightbox: 500,
    durationHideLightbox: 500,
    durationShowContent: 500,
    durationHideContent: 500,
    wrap: true
});
