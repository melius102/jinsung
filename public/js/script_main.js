const log = console.log;

let rdev = 0;
let g_mainColor = '#444242'; //'#444242', '#0000FF';
let g_subColor = '#EEEEEE'; //'#FFFFFF', '#FF0000';
let g_winWidth;
let g_winHeight;

function initCSS() {
    log("initCSS");

    g_winWidth = $(window).width();
    // g_winHeight = $(window).height();
    g_winHeight = $(window).outerHeight(); // for including hscroll

    document.documentElement.style.setProperty('--winWidth', `${g_winWidth}px`);
    document.documentElement.style.setProperty('--winHeight', `${g_winHeight}px`);
    document.documentElement.style.setProperty('--mainColor', g_mainColor);
    document.documentElement.style.setProperty('--subColor', g_subColor);

    let imgWidth = $("#story .img img").width();
    let divWidth = $("#story .img").width();
    $("#story .img img").css({ marginLeft: `${divWidth / 2 - imgWidth / 2}px` });
}

function introAni() {
    if (rdev) {
        $("#intro").children().delay(100).fadeIn(500).delay(100).fadeIn(0, function () {
            $("#intro").animate({
                top: `-${g_winHeight}px`
            }, 100).fadeOut();
            location.href = '#front';
        });
    } else {
        $("#intro").children().delay(500).fadeIn(1000).delay(1000).fadeIn(0, function () {
            $("#intro").animate({
                top: `-${g_winHeight}px`
            }, 1000).fadeOut();
            location.href = '#front';
        });
    }
}

initCSS();
introAni();

window.addEventListener('resize', initCSS);
window.addEventListener("load", () => {
    initThree();
    hScroll2();
    document.addEventListener('scroll', hScroll2, false);
});

function hScroll2() {
    let opacity;
    let winH = g_winHeight;
    opacity = opacityCtrl(-1, -1, 0.1 * winH, 0.8 * winH, g_mouse.scrTop);
    $("#front").css({ opacity });

    opacity = opacityCtrl(0.2 * winH, 0.5 * winH, 100 * winH, 100 * winH, g_mouse.scrTop);
    $("#menu").css({ opacity });

    opacity = opacityCtrl(0.2 * winH, 0.5 * winH, 1.3 * winH, 1.8 * winH, g_mouse.scrTop);
    $("#story").css({ opacity });

    opacity = opacityCtrl(1.2 * winH, 1.5 * winH, 100 * winH, 100 * winH, g_mouse.scrTop);
    $("#products").css({ opacity });
    $("#contact").css({ opacity });
}

function opacityCtrl(start0, stop0, start1, stop1, scrTop) {
    let opacity;
    if (scrTop < start0) opacity = 0;
    else if (scrTop < stop0) opacity = (scrTop - start0) / (stop0 - start0);
    else if (scrTop < start1) opacity = 1;
    else if (scrTop < stop1) opacity = 1 - (scrTop - start1) / (stop1 - start1);
    else opacity = 0;
    return opacity;
}