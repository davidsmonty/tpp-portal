/**
 * Created by tonypoole on 15/06/2020.
 */

var is_secure = false;
var tell_cookie = {};
var tell_user_token_data = {};

var auth = {
    initialise: function () {

        // Register Events
        this.registerOnclicks();
        // Read Existing Cookie
        this.readCookie();
        this.isActiveSession();

    },
    registerOnclicks: function () {

        $(".dropdown-toggle").click(function () {

            var el = $(this), newone = el.clone(true);
            el.before(newone);
            $("." + el.attr("class") + ":last").remove();

        });

        $(document).on("click", "#login_button", function (event) {
            auth.s1_process();
        });

        $(document).on("click", ".logout-action", function (event) {
            auth.expireCookies();
            auth.redirect('/');
        });

        $(document).on("click", "#login_verify", function (event) {
            auth.s2_process();
        });
        $(document).on("click", "#login_verify_s3", function (event) {
            auth.s3_process();
        });
    },
    readCookie: function () {

        var rc = document.cookie;
        var sc = rc.split(';')
        for (var i = 0; i < sc.length; i++) {

            var kv_str = sc[i].trim();
            var key = kv_str.substring(0, kv_str.indexOf('='));
            var value = kv_str.substring(kv_str.indexOf('=') + 1);
            if (key.length > 0) {
                tell_cookie[key] = value;
            }
        }
    },
    isActiveSession: function () {

        if (typeof tell_cookie.tell_session === 'undefined') {
            // No Tell Session In Process
            auth.expireCookies();

        } else {

            // Extract User Details
            auth.extractSecureViewData();
        }

    },
    get_cookie: function (name) {
        return document.cookie.split(';').some(c => {
            return c.trim().startsWith(name + '=');
        });
    },
    forceExpireCookie: function (name, path, domain) {


        if (auth.get_cookie(name)) {


            var uncook = name + "=" +
                ((path) ? ";path=" + path : "") +
                ((domain) ? ";domain=" + domain : "") +
                ";expires=Thu, 01 Jan 1970 00:00:01 GMT";


            document.cookie = uncook;
        }

    },
    expireCookies: function () {
        auth.forceExpireCookie('tell_token', '/');
        auth.forceExpireCookie('tell_session', '/');
    },
    extractSecureViewData: function () {

        if (typeof tell_cookie.tell_token === 'undefined') {
            // No Tell Token
            auth.expireCookies();
            return;

        } else {

            var td = tell_cookie.tell_token.split('.');
            if (typeof td[1] === 'undefined') { // invalid JWT
                auth.expireCookies();
                return;
            }
            tell_user_token_data = JSON.parse(atob(td[1]));
            if (typeof tell_user_token_data.access_code === 'undefined') { // invalid JWT
                auth.expireCookies();
                return;
            }

            // Change Presentation Information
            auth.secureViewer();
        }


    },
    setCookie: function (name, value, options = {}) {

        console.log('setting cookie: ' + name);

        options = {
            path: '/',
            // add other defaults here if necessary
            ...options
        };

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }


        document.cookie = updatedCookie;
    },
    secureViewer: function () {

        is_secure = true;
        $('#logInBox').hide();
        $('#loggedInBox').show();
        $('#admin-menu').show();
        $('#greeting-options').show();
        $('#loggedInBox').text('Hi ' + tell_user_token_data.user_fname);
        $('.full-name').text(tell_user_token_data.user_fname + ' ' + tell_user_token_data.user_lname);
        $('#profile-picture--header').attr("src", tell_user_token_data.user_icon);


    },

    s1_process: function () {

        $('#s1_warning').hide();
        $('.pword_icon').removeClass('icon_warn');
        $('.uname_icon').removeClass('icon_warn');

        var username = $("#email").val();
        var password = $("#password").val();

        var data = {
            operation: 's1',
            username: username,
            password: password
        };


        // Send Auth Call
        $.ajax({
            type: "POST",
            url: _config.base_api_path+"authenticate",
            dataType: "json",
            crossDomain: "true",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),

            success: function (rsp, textStatus, xhr) {
                auth.s1_handler(rsp);
            },
            error: function (rsp) {
                // show an error message
                auth.s1_error_handler(rsp.responseJSON);

            }
        });

    },
    s1_error_handler: function (s1_err_rsp) {


        switch (s1_err_rsp.subcode) {
            case '401-001':
                // code block
                $('#s1_warning').text('Unrecognised User Email');
                $('#s1_warning').show();
                $('.uname_icon').addClass('icon_warn');
                break;
            case '401-002':
                $('#s1_warning').text('Incorrect User Password');
                $('#s1_warning').show();
                $('.pword_icon').addClass('icon_warn');
                break;
            default:
                $('#s1_warning').text('Unknown Error Occurred');
                $('#s1_warning').show();


            // code block
        }


    },
    s1_handler: function (s1_rsp) {

        this.setCookie('tell_token', s1_rsp.jwt, {'max-age': 3600});
        this.readCookie();

        switch (s1_rsp.mfa_status) {
            case 0:
                // MFA SET_UP REQUIRED
                $('#man-qr-code').text(s1_rsp.mfa_secret);
                $("#auto-qr-code").attr("src", s1_rsp.mfa_url);
                auth.hideAuthZone('#s1_form');
                auth.showAuthZone('#s2_form');
                break;
            case 1:
                // MFA SET_UP COMPLETE
                $('#man-qr-code').text(s1_rsp.mfa_secret);
                $("#auto-qr-code").attr("src", s1_rsp.mfa_url);
                auth.hideAuthZone('#s1_form');
                auth.showAuthZone('#s3_form');
                break;
            case 2:
                // MFA SET_UP REQUIRED
                $('#man-qr-code').text(s1_rsp.mfa_secret);
                $("#auto-qr-code").attr("src", s1_rsp.mfa_url);
                auth.hideAuthZone('#s1_form');
                auth.showAuthZone('#s2_form');
                break;
            default:
            // code block
        }


    },
    showAuthZone: function (zone) {

        //$(zone).show(  350 );
        $(zone).show(350);

    },
    hideAuthZone: function (zone) {

        $(zone).hide(350);

    },
    s3_process: function () {

        $('#s2_warning').hide();
        $('#s3_warning').hide();
        $('.totp_icon').removeClass('icon_warn');

        var totp = $("#totp_code_s3").val();

        var data = {
            operation: 's2',
            token: tell_cookie.tell_token,
            totp: totp
        };

        console.log(data);

        // Send Auth Call
        $.ajax({
            type: "POST",
            url: _config.base_api_path+"authenticate",
            dataType: "json",
            crossDomain: "true",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),

            success: function (rsp, textStatus, xhr) {
                auth.s2_handler(rsp);
            },
            error: function (rsp) {
                // show an error message
                auth.s2_error_handler(rsp.responseJSON);

            }
        });

    },
    s2_process: function () {


        $('#s2_warning').hide();
        $('#s3_warning').hide();
        $('.totp_icon').removeClass('icon_warn');

        var totp = $("#totp_code").val();

        var data = {
            operation: 's2',
            token: tell_cookie.tell_token,
            totp: totp
        };

        console.log(data);

        // Send Auth Call
        $.ajax({
            type: "POST",
            url: _config.base_api_path+"authenticate",
            dataType: "json",
            crossDomain: "true",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),

            success: function (rsp, textStatus, xhr) {
                //alert(xhr.getResponseHeader('x-jwt-token'));
                auth.s2_handler(rsp);
            },
            error: function (rsp) {
                // show an error message
                auth.s2_error_handler(rsp.responseJSON);

            }
        });

    },
    s2_error_handler: function (s2_err_rsp) {
        console.log(s2_err_rsp.subcode);

        switch (s2_err_rsp.subcode) {
            case 500:
                // code block
                $('#s2_warning').text('Invalid Passcode');
                $('#s2_warning').show();
                $('#s3_warning').text('Invalid Passcode');
                $('#s3_warning').show();
                $('.totp_icon').addClass('icon_warn');
                break;
            default:

                $('#s2_warning').text('Unknown Error Occurred');
                $('#s2_warning').show();
                $('#s3_warning').text('Unknown Error Occurred');
                $('#s3_warning').show();
                $('.totp_icon').addClass('icon_warn');


            // code block
        }


    },
    s2_handler: function (s2_rsp) {

        this.setCookie('tell_token', encodeURIComponent(s2_rsp.jwt), {'max-age': 3600});
        this.setCookie('tell_session', encodeURIComponent(s2_rsp.tell_session), {'max-age': 3600});
        this.readCookie();

        // MFA SET_UP REQUIRED
        auth.hideAuthZone('#s2_form');
        auth.hideAuthZone('#s3_form');
        auth.showAuthZone('#s3_confirmation');

        setTimeout(function () {
            auth.redirect("/applications");
        }, 2000);


    },
    redirect: function (location) {

        window.location = location;

    }

}

auth.initialise();

$(document).ready(function() {

    setTimeout(function(){
        $('body').addClass('loaded');
    }, 1000);

});