/**
 * Created by tonypoole on 06/07/2020.
 */

/** AJAX HANDLER LOGIC **/

var tell_ajax_handler = {
    caller: function (callback, ajaxCallData) {
        $.ajax({ type: ajaxCallData.type, url: ajaxCallData.url, data: ajaxCallData.data, dataType:ajaxCallData.dataType, headers: ajaxCallData.headers })
            .done(function (res, textStatus, xhr) {
                console.log(xhr.status);
                var result = res;
                result.status_code = xhr.status;
                callback(result);
            })
            .fail(function (err) {
                console.log(err);
                console.log(err.status);
                console.log(err.responseJSON);
                switch(err.status) {
                    case 401:
                        // code block
                        console.log('Unauthenticated - Redirect')
                        break;
                    default:
                        if(err.responseJSON!==undefined){ var error_type = err.responseJSON.error; } else { var error_type = ''; }
                        var ajaxErr = { status: "error", type: error_type };

                        callback(ajaxErr);
                }

            });
    },
};

var tell_ajax_handler_unauthenticated = {
    caller: function (callback, ajaxCallData) {
        $.ajax({ type: ajaxCallData.type, url: ajaxCallData.url, data: ajaxCallData.data, dataType:ajaxCallData.dataType, headers: ajaxCallData.headers })
            .done(function (res, textStatus, xhr) {
                console.log(xhr.status);
                var result = res;
                result.status_code = xhr.status;
                callback(result);
            })
            .fail(function (err) {

                var result = {};
                result.status_code = err.status;

                        callback(result);

            });
    },
};

var affinity_retry_handler = {
    caller: function (callback, ajaxCallData, retryCount) {
        $.ajax({ type: ajaxCallData.type, url: ajaxCallData.url, data: ajaxCallData.data })
            .done(function (res) {
                var result = JSON.parse(res);
                --retryCount;
                callback(result, retryCount);
            })
            .fail(function () {
                var ajaxErr = { status: "error" };
                retryCount;
                callback(ajaxErr, retryCount);
            });
    },
};


    /** Navigation Logic **/
    var admin_g = {
        initialise: function () {
            this.registerOnclicks();
            this.get_admin_menu();
        },
        registerOnclicks: function () {

            $(document).click(function(){
                console.log('hide it')
                $(".dropdown-box").removeClass('show');
            });

            /* Clicks within the dropdown won't make
             it past the dropdown itself */
            $(document).on("click", ".dropdown", function (event) {

                event.stopPropagation();
                console.log('show it')
                $(".dropdown-box").addClass('show');
            });




                },
        get_admin_menu: function () {
            admin_g.populate_admin_menu(nav.nav_admin);
            admin_g.populate_profile_menu(nav.nav_profile);
            admin_g.construct_menu(nav.nav_header);
        },
        populate_admin_menu: function (menu_array) {
            var i;
            for (i = 0; i < menu_array.length; i++) {
                admin_g.admin_m_constr(menu_array[i]);
            }
            var app_icon =
                '<li class="side-nav__devider my-6"></li>' +
                "<li>" +
                '<a class="side-menu logout-action">' +
                '<div class="side-menu__icon"> <i class="ti-power-off lead-3 text-primary"></i> </div>' +
                '<div class="side-menu__title"> Logout </div>' +
                "</a>" +
                "</li>";
            $("#admin_menu").append(app_icon);
        },
        populate_profile_menu: function (menu_array) {
            var i;
            var p_menu = '';
            for (i = 0; i < menu_array.length; i++) {
                p_menu = p_menu+'<a href="' + menu_array[i].nav_href +'" class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md"> <i data-feather="user" class="w-4 h-4 mr-2"></i> ' + menu_array[i].nav_name +' </a>';
            }

            $("#profile_menu").append(p_menu);
        },
        admin_m_constr: function (myapp) {
            if (typeof pmi !== "undefined") {
                if (pmi === myapp.nav_name) {
                    var active = "side-menu--active";
                } else {
                    var active = "";
                }
                var app_icon =
                    "<li>" +
                    '<a href="' +
                    myapp.nav_href +
                    '" class="side-menu ' +
                    active +
                    '">' +
                    '<div class="side-menu__icon"> <i class="' +
                    myapp.nav_icon +
                    ' lead-3 text-primary"></i> </div>' +
                    '<div class="side-menu__title"> ' +
                    myapp.nav_name +
                    " </div>" +
                    "</a>" +
                    "</li>";
                $("#admin_menu").append(app_icon);
            }
        },
        construct_menu: function (nav_array) {
            var i;
            for (i = 0; i < nav_array.length; i++) {
                admin_g.nav_link_const(nav_array[i]);
            }
        },
        nav_link_const: function (nav_item) {
            if ((nav_item.nav_secure === !0 && is_secure === !0) || nav_item.nav_secure === !1) {
                if (nav_item.nav_children.length > 0) {
                    var arrow = '<span class="arrow"></span>';
                    var children = admin_g.constr_nav_children(nav_item.nav_children);
                } else {
                    var arrow = "";
                    var children = "";
                }
                var nav = '<li class="nav-item"> <a class="nav-link" href="' + nav_item.nav_href + '">' + nav_item.nav_name + " " + arrow + "</a>" + children + "</li>";
                $(".nav-navbar").append(nav);
            }
        },
        constr_nav_children: function (nav_child_array) {
            var sub_nav_string = "";
            var i;
            for (i = 0; i < nav_child_array.length; i++) {
                sub_nav_string += admin_g.nav_child_const(nav_child_array[i]);
            }
            return '<nav class="nav">' + sub_nav_string + "</nav>";
        },
        nav_child_const: function (nav_child_item) {
            return '<a class="nav-link" href="' + nav_child_item.nav_href + '">' + nav_child_item.nav_name + "</a>";
        },
    };
admin_g.initialise();

/* SET REDOC LOCATION */

$('#redoc_spec').attr("spec-url", _config.swagger_file);


/* Brandify Site */



var brandify = {

    initialise: function () {
        this.site_brand();
    },
    site_brand: function (config) {
        document.body.innerHTML = document.body.innerHTML.replace(/{{Tell-Client}}/g, _config.client_name);
        document.head.innerHTML = document.head.innerHTML.replace(/{{Tell-Client}}/g, _config.client_name);
    }

}

brandify.initialise();

/* Swagger / Redocs Logic */

var tell_docs={initialise:function(){ tell_docs.registerOnclicks(),tell_docs.initPrefSpec()},initPrefSpec:function(){!0===$("#myonoffswitch").is(":checked")?($("#swagger-ui").fadeOut("slow",function(){$("#swagger-ui").addClass("hide-spec")}),$("#redoc_spec").fadeIn("slow",function(){$("#redoc_spec").removeClass("hide-spec")})):($("#redoc_spec").fadeOut("slow",function(){$("#redoc_spec").addClass("hide-spec")}),$("#swagger-ui").fadeIn("slow",function(){$("#swagger-ui").removeClass("hide-spec")}))},registerOnclicks:function(){$(document).on("change","#myonoffswitch",function(e){tell_docs.initPrefSpec()})}};
tell_docs.initialise();


/* Smooth Scroll Logic */

'use strict';

$(function() {
    /*
     |--------------------------------------------------------------------------
     | Configure your website
     |--------------------------------------------------------------------------
     |
     | We provided several configuration variables for your ease of development.
     | Read their complete description and modify them based on your need.
     |
     */

    page.config({
        smoothScroll: true,
    });
});
