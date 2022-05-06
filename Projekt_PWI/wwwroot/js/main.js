//Set full height on header

var windowWidthPrev = $(window).innerWidth();
$("header").css("height", $(window).innerHeight())

//Show, close nav

$("#navButton").on("click", function(){
    $(this).toggleClass("active");
    $("nav").toggleClass("active")

})

//Click anywhere to hide nav

$("main, header, footer").on("click", function(){
    $("#navButton").removeClass("active")
    $("nav").removeClass("active")
})


//Slide if you are on the appropriate height

const navIds = [];

$(window).on("load", () => {
            $("#navContainer").children().each((index, id) => {         //Get ids of navSection 
                navIds.push($(id).attr("id"))
            });
        })

let debounce_timer;
let scrollPosition;
let portfolioFromTop;
let portfolioHeight;
let windowHeight;

$(window).on("scroll load", () => {
    if (debounce_timer) {
        window.clearTimeout(debounce_timer);
    }

    debounce_timer = window.setTimeout(() => {
        scrollPosition = $(this).scrollTop()
        windowHeight = $(window).height()

        const infoFromTop = $(".info").offset().top;

        portfolioFromTop = $(".portfolio").offset().top;
        portfolioHeight = $(".portfolio").outerHeight(true);

        const aboutMeFromTop = $(".aboutMe").offset().top;

        if (scrollPosition > (infoFromTop / 2.8)) {
            $(".info").addClass("active")
        }
        if (scrollPosition > (portfolioFromTop - (windowHeight / 1.5))) {
            $(".portfolio").addClass("active")
        }
        if (scrollPosition > (aboutMeFromTop - (windowHeight / 1.5))) {
            $(".aboutMe").addClass("active")
        }

        //CHECK IN WHICH SECTION YOU ARE
        navIds.forEach(el => {
            if (scrollPosition >= $("." + el).offset().top - (windowHeight * 0.4)) {
                $(".currentNavSection").removeClass("currentNavSection")

                if (scrollPosition >= $(document).innerHeight() - windowHeight) {
                    $("#" + navIds[navIds.length - 1]).addClass("currentNavSection")
                    return
                }

                $("#" + el).addClass("currentNavSection")
            }

        })
    }, 100);
});

// //Scroll to clicked section

// $("#navContainer>p").on("click", (e) => {
//     const nameID = e.target.id
//     const goTo = "." + nameID;

//     $("html, body").stop(true).animate({
//         scrollTop: $(goTo).offset().top
//     }, 2000)
// })

// //Scroll to portfolio section

// $(".portfolioButton").on("click", () => {
//     $("html, body").animate({
//         scrollTop: $(".portfolio").offset().top
//     }, 2000)
// })

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

var changeScrollPosition = function (el) {
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

$(window).on('resize', function(){
    if($(window).innerWidth() !== windowWidthPrev){     //Only when width is changing
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
    hideButtonSection: 200,
    showButtonSection: 200,
    hideSectionAnimationTime: 600, //+
    showNewSectionAnimationTime: 600, //+
    lazyLoading: false, //+
    defaultChangeSection: true,
    createSectionContainer: true,
    createButtonContainer: true,
    sections: ["LOGO", "W & UI", "OTHER"]
})

//LIGHTBOX
lightbox({
    durationShowLightbox: 500,
    durationHideLightbox: 500,
    durationShowContent: 500,
    durationHideContent: 500,
    wrap: true,
})