/**
 * CLEAN UI THEME SETTINGS
 */

var cleanUI = {
    hasTouch: (function() { return ('ontouchstart' in document.documentElement) })()
};



/**
 * CLEAN UI TEMPLATE SCRIPTS
 */

$(function(){

    /////////////////////////////////////////////////////////////////////////////
    // Slide toggle menu items on click

    $('.left-menu .left-menu-list-submenu > a').on('click', function(){
        var accessDenied = $('body').hasClass('menu-top') && $(window).width() > 768;

        if (!accessDenied) {
            var that = $(this).parent(),
                opened = $('.left-menu .left-menu-list-opened');

            if (!that.hasClass('left-menu-list-opened') && !that.parent().closest('.left-menu-list-submenu').length)
                opened.removeClass('left-menu-list-opened').find('> ul').slideUp(200);

            that.toggleClass('left-menu-list-opened').find('> ul').slideToggle(200);
        }
    });

    /////////////////////////////////////////////////////////////////////////////
    // Reinitialise jScrollPane (custom scroll on nav.left-menu) on window.resize

    function responsiveMenu() {
        var api,
            throttleTimeout,
            init = false;

        function initScroll(el) {
            if ($('nav.left-menu').length) {
                api = el.jScrollPane({
                    autoReinitialise: true,
                    autoReinitialiseDelay: 100
                }).data().jsp
            }
        }

        function initHorizontalScroll() {
            setTimeout(function(){
                if ($('body').hasClass('menu-top') && $(window).width() > 751 && $('nav.top-menu').length) {

                    if (api && init) {
                        api.destroy();
                        init = false;
                        $('.left-menu-list-opened').find('.left-menu-list').hide();
                        $('.left-menu-list-opened').removeClass('left-menu-list-opened');
                    }

                    var menu = $('.left-menu-list-root'),
                        menuOuter = $('.left-menu-list-root').parent(),
                        logo = $('.logo-container'),
                        innerWidth = menuOuter.width() - logo.outerWidth() - 20,
                        elements = menu.find('> *:not(.menu-top-hidden)'),
                        itemsWidth = 0;

                    if (!menu.find('.horizontal-menu-prev')) {
                        //menu.prepend('<li class="horizontal-menu-prev"></li>');
                        //menu.append('<li class="horizontal-menu-prev"></li>');
                    }

                    elements.hide();

                    elements.each(function(){
                        itemsWidth += Math.ceil($(this).width());
                        if (itemsWidth > innerWidth) {
                            $(this).hide();
                        } else {
                            $(this).show();
                        }
                    });

                    menu.addClass('inited');

                } else {

                    $('.left-menu-list-root > li').show();

                }
            }, 50)
        }

        function initVerticalScroll() {

            if (!cleanUI.hasTouch) {

                $('.left-menu-list-root > li').show();

                if (!$('body').hasClass('menu-top')) {
                    var el = $('nav.left-menu .scroll-pane');
                    initScroll(el);
                    init = true;
                }

                $(window).bind('resize', function() {

                    var el = $('nav.left-menu .scroll-pane');

                    if ($('body').hasClass('menu-top')) {

                        if ($(window).width() <= 751) {

                            $('.left-menu-list-root > li').show();
                            initScroll(el);
                            init = true;

                        } else {

                            if (api && init) {
                                api.destroy();
                                init = false;
                                $('.left-menu-list-opened').find('.left-menu-list').hide();
                                $('.left-menu-list-opened').removeClass('left-menu-list-opened');
                            }

                        }

                    } else {

                        if (!throttleTimeout) {
                            throttleTimeout = setTimeout(function() {
                                api.reinitialise();
                                throttleTimeout = null;
                            }, 50);
                        }

                    }

                });

            }

        }

        initVerticalScroll();

        initHorizontalScroll();

        $(window).bind('resize topmenu', function() {
            initHorizontalScroll();
        });

        $(window).bind('leftmenu', function() {
            initVerticalScroll();
        });

    }

    responsiveMenu();

    /////////////////////////////////////////////////////////////////////////////
    // Toggle menu on viewport < 768px

    $('.left-menu-toggle').on('click', function(){
        $(this).toggleClass('active');
        $('nav.left-menu').toggleClass('left-menu-showed');
        $('.main-backdrop').toggleClass('main-backdrop-showed')
    });

    /////////////////////////////////////////////////////////////////////////////
    // Hide menu and backdrop on backdrop click

    $('.main-backdrop').on('click', function(){
        $('.left-menu-toggle').removeClass('active');
        $('nav.left-menu').removeClass('left-menu-showed');
        $('.main-backdrop').removeClass('main-backdrop-showed')
    });

});