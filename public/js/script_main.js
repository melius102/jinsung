const log = console.log;

let rdev = 0;
let g_mainColor = '#444242'; //'#444242', '#0000FF';
let g_subColor = '#EEEEEE'; //'#EEEEEE', '#FF0000';
let g_winWidth;
let g_winHeight;

let g_scrollTop = 0;
let g_menuList = [];
let g_menuPose = {};

let g_reactLoaded = false;
let g_onLoad = false;

initialization();

function initialization() {
    log('initialization');

    window.addEventListener("load", () => {
        g_onLoad = true;
        getWinSize();
        getScrollTop();
        if (!isMobile()) initThree();
        if (g_reactLoaded) {
            log('react loaded normally.')
            reactComptLoad();
            addMap();
            setOpacity();
        }

        // event handler
        document.addEventListener('scroll', () => {
            getScrollTop();
            arrowBtnUpdate();
            setOpacity();
        }, false);

        window.addEventListener('resize', () => {
            getWinSize();
            getScrollTop();
            getMenuListPos();
            arrowBtnUpdate();
            setOpacity();
        });

        $("#hamburger-btn").click(function (evt) {
            $("#gnb").stop().slideToggle('fast');
            evt.stopPropagation();
        });

        $("#gnb li").click(function (evt) {
            evt.stopPropagation();
        });

        $("html").click(function (evt) {
            $("#gnb.mobile").stop().slideUp('fast');
        });

        // go intro animation
        goIntroAni();
        loadFBSDK();
    });
}

function getMenuListPos() {
    g_menuList = [];
    $('.menu-item').each(function (i) {
        g_menuList.push(parseInt($(this).offset().top));
    });
    g_menuPose.story = $('#story').offset().top;
    g_menuPose.products = $('#products').offset().top;
    g_menuPose.contact = $('#contact').offset().top;
}

function getWinSize() {
    // log("getWinSize");

    g_winWidth = $(window).width();
    g_winHeight = $(window).height();
    // g_winHeight = $(window).outerHeight(); // for including hscroll & for address bar of mobile
    // log(g_winHeight);

    document.documentElement.style.setProperty('--winWidth', `${g_winWidth}px`);
    document.documentElement.style.setProperty('--winHeight', `${g_winHeight}px`);
    document.documentElement.style.setProperty('--mainColor', g_mainColor);
    document.documentElement.style.setProperty('--subColor', g_subColor);
    document.documentElement.style.setProperty('--subColor2', g_subColor + 'CC');

    let imgWidth = $("#story .img img").width();
    let divWidth = $("#story .img").width();
    $("#story .img img").css({ marginLeft: `${divWidth / 2 - imgWidth / 2}px` });

    if (window.matchMedia("(max-width: 768px)").matches) {
        $('#gnb').hide().addClass('mobile');
    } else {
        $('#gnb').show().removeClass('mobile');
    }
}

function getScrollTop() {
    g_scrollTop = parseInt($(document).scrollTop());
}

function setOpacity() {
    // log('setOpacity');
    let opacity;
    let dLen = g_winHeight * 0.3;

    opacity = opacityCtrl(-1, -1, dLen, g_menuPose.story - dLen);
    $("#front").css({ opacity });

    opacity = opacityCtrl(dLen, g_menuPose.story - dLen, 100000, 100000);
    $("#menu").css({ opacity });

    opacity = opacityCtrl(dLen, g_menuPose.story - dLen, g_menuPose.story + dLen, g_menuPose.products);
    $("#story").css({ opacity });

    opacity = opacityCtrl(g_menuPose.story + dLen, g_menuPose.products, g_menuPose.contact - dLen, g_menuPose.contact);
    $("#products").css({ opacity });

    opacity = opacityCtrl(g_menuPose.contact - dLen, g_menuPose.contact, 100000, 100000);
    $("#contact").css({ opacity });


    function opacityCtrl(start0, stop0, start1, stop1) {
        let opacity;
        if (g_scrollTop < start0) opacity = 0;
        else if (g_scrollTop < stop0) opacity = (g_scrollTop - start0) / (stop0 - start0);
        else if (g_scrollTop < start1) opacity = 1;
        else if (g_scrollTop < stop1) opacity = 1 - (g_scrollTop - start1) / (stop1 - start1);
        else opacity = 0;
        return opacity;
    }
}

// http://apis.map.kakao.com/
function addMap() {
    log('addMap');
    // 37.283185, 127.145192: lotte castle

    try {
        let mapContainer = document.getElementById('map');
        let mapOption = {
            center: new kakao.maps.LatLng(37.283185, 127.145192), // coordinate of map's center
            level: 3 // zoom
        };
        let map = new kakao.maps.Map(mapContainer, mapOption);

        let marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(37.283185, 127.145192) });
        marker.setMap(map);
    } catch (err) {
        console.log(err);
    }
}

function goIntroAni() {
    if (rdev) {
        $("#intro").children().delay(100).fadeIn(100).delay(100).fadeIn(0, function () {
            $("#intro").animate({
                top: `-${g_winHeight}px`
            }, 100).fadeOut(0, function () {
                $('#wrap0 #down-arrow').delay(100).fadeIn(100);
                $('#oline-shop').trigger('click');
            });
            location.href = '#story';
        });
    } else {
        $("#intro").children().delay(500).fadeIn(1000).delay(1000).fadeIn(0, function () {
            $("#intro").animate({
                top: `-${g_winHeight}px`
            }, 1000).fadeOut(0, function () {
                $('#wrap0 #down-arrow').delay(500).fadeIn(1000);
            });
            location.href = '#front';
        });
    }
}

// https://gist.github.com/BashCloud/2feb9975fa0fb0620ba030857f4f8fe6
function isMobile() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
