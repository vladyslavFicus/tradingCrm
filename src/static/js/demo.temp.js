/**
 * TEMPLATE OPTIONS
 * Theme demo temporary scripts, remove it in your app
 */

$(function(){

    /////////////////////////////////////////////////////////////////////////////
    // TODO-NICK REFACTOR THIS CODE

    if (!localStorage.getItem('options-colorful')) {
        localStorage.setItem('options-colorful', 'colorful-enabled');
    }

    var optionsTheme = localStorage.getItem('options-theme'),
        optionsMode = localStorage.getItem('options-mode'),
        optionsMenuTop = localStorage.getItem('options-menu-top'),
        optionsMenu = localStorage.getItem('options-menu'),
        optionsColorful = localStorage.getItem('options-colorful');

    // THEME COLOR
    $('#options-theme .btn').on('click', function(){
        $('#options-theme .active').removeClass('active');
        var themeSelector = $(this).find('input').val();
        $('body').removeClass('theme-dark theme-default theme-blue theme-orange theme-red theme-green').addClass(themeSelector);
        localStorage.setItem('options-theme', themeSelector);
    });
    if (optionsTheme) {
        $('#options-theme input[value=' + optionsTheme + ']').closest('.btn').click();
    }

    // MODE SUPERCLEAN
    $('#options-mode .btn').on('click', function(){
        var themeSelector = $(this).find('input').val();
        $('body').removeClass('mode-superclean mode-default').addClass(themeSelector);
        localStorage.setItem('options-mode', themeSelector);
    });
    if (optionsMode) {
        $('#options-mode input[value=' + optionsMode + ']').closest('.btn').click();
    }

    // TOP MENU
    $('#options-menu-top .btn').on('click', function(){
        var themeSelector = $(this).find('input').val();
        $('body').removeClass('menu-top menu-left').addClass(themeSelector);
        localStorage.setItem('options-menu-top', themeSelector);

        if (themeSelector == 'menu-top') {
            $(window).trigger('topmenu');
        } else {
            $(window).trigger('leftmenu');
        }
    });

    if (optionsMenuTop) {
        $('#options-menu-top input[value=' + optionsMenuTop + ']').closest('.btn').click();
    }

    // FIXED MENU
    $('#options-menu .btn').on('click', function(){
        var themeSelector = $(this).find('input').val();
        $('body').removeClass('menu-fixed menu-static').addClass(themeSelector);
        localStorage.setItem('options-menu', themeSelector);
    });

    if (optionsMenu) {
        $('#options-menu input[value=' + optionsMenu + ']').closest('.btn').click();
    }


    // COLORFUL
    $('#options-colorful .btn').on('click', function(){
        var themeSelector = $(this).find('input').val();
        localStorage.setItem('options-colorful', themeSelector);
        $('body').removeClass('colorful-disabled colorful-enabled').addClass(themeSelector);
        colorfulRemoveClass();
        if (localStorage.getItem('options-colorful') == 'colorful-enabled') {
            colorfulAddClass();
        }
    });
    if (optionsColorful) {
        $('#options-colorful input[value=' + optionsColorful + ']').closest('.btn').click();
    }

    var colorfulClasses = 'left-menu-list-color-primary left-menu-list-color-success left-menu-list-color-warning left-menu-list-color-danger left-menu-list-color-yellow';

    function colorfulRemoveClass() {
        $('nav.left-menu .left-menu-list-root > li').removeClass(colorfulClasses);
    }

    function colorfulAddClass() {
        setTimeout(function(){
            $('nav.left-menu .left-menu-list-root > li').each(function(){
                var classArray = colorfulClasses.split(' '),
                    randomClass = classArray[Math.floor(Math.random() * classArray.length)];

                $(this).addClass(randomClass)
            })
        }, 200)
    }

});