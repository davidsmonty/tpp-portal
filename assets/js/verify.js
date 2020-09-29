/**
 * Created by tonypoole on 15/06/2020.
 */

var verify = {
    initialise: function () {


        // Register Events
        this.registerOnclicks();
        // Read Existing Cookie
        switch (pi) {

            case 'verify':
                // code block
                console.log('verify')
                this.verifyCode();
                break;
            default:
                console.log('Update Other')

        }


    },
    registerOnclicks: function () {

        $(".checkmark").click(function () {

            var el = $(this), newone = el.clone(true);
            el.before(newone);
            $("." + el.attr("class") + ":last").remove();

        });

    },
    updateAlertManager: function (action, status) {

        switch (action) {
            case 'close':
                $('.updateAlertSuccess').hide("fast", function () {
                });
                $('.updateAlertFailure').hide("fast", function () {
                });
                break;
            case 'show':

                if (status === true) {
                    $('.updateAlertSuccess').show("fast", function () {
                    });
                } else {
                    $('.updateAlertFailure').show("fast", function () {
                    });
                }


                break;
            default:
                console.log('Update Other')


        }

    },


    verifyCode: function () {

        var path = window.location.pathname // /account/search
        var act_code = path.split("/").pop();
      

        var params = {
            interface_id: _config.iface_uuid
        };

        var ajaxCallData = {
            type: "POST",
            url: _config.base_api_path + "/tpp/authenticate/" + act_code,
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json"
            }

        };

        tell_ajax_handler_unauthenticated.caller(this.activationResponseHandler, ajaxCallData);
    },
    activationResponseHandler: function (data) {
        console.log(data)

        switch (data.status_code) {
            case 200:
                // Show successful activation and redirect to login
                verify.hideAuthZone('#act1');
                verify.hideAuthZone('#act2');
                verify.hideAuthZone('#act4');
                verify.showAuthZone('#act3');
                setTimeout(function () {
                    verify.redirect("/login");
                }, 2000);
                break;
            case 404:
                // Invalid activation code show error message
                verify.hideAuthZone('#act1');
                verify.hideAuthZone('#act2');
                verify.hideAuthZone('#act3');
                verify.showAuthZone('#act4');
                break;
            case 402:
                // code block
                verify.hideAuthZone('#act1');
                verify.hideAuthZone('#act2');
                verify.hideAuthZone('#act3');
                verify.showAuthZone('#act4');
                break;
            case 401:
                // Expired Activation Code allow regen
                verify.hideAuthZone('#act1');
                verify.hideAuthZone('#act2');
                verify.hideAuthZone('#act4');
                verify.showAuthZone('#act2');
                break;
            case 403:
                // Already Activated redirect
                verify.hideAuthZone('#act1');
                verify.hideAuthZone('#act2');
                verify.hideAuthZone('#act4');
                verify.showAuthZone('#act3');
                setTimeout(function () {
                    verify.redirect("/login");
                }, 2000);
                break;
            default:
                var ajaxErr = {status: "error"};


        }
    },
    showAuthZone: function (zone) {

        //$(zone).show(  350 );
        $(zone).show(350);

    },
    hideAuthZone: function (zone) {

        $(zone).hide(350);

    },
    redirect: function (location) {

        window.location = location;

    },

    regenVerification: function (apps_array) {

        var path = window.location.pathname // /account/search
        var act_code = path.split("/").pop();
        var act_code = $('#email_address').val();

        console.log(act_code);

        var params = {
            interface_id: _config.iface_uuid,
            email: $('#email_address').val()
        };

        var ajaxCallData = {
            type: "POST",
            url: _config.base_api_path + "/tpp/authenticate",
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json"
            }

        };

        tell_ajax_handler_unauthenticated.caller(this.regenVerificationResponseHandler, ajaxCallData);

    },
    regenVerificationResponseHandler: function (response) {

        switch (response.status_code) {
            case 200:
                // Show successful activation and redirect to login
                verify.hideAuthZone('#act1');
                verify.hideAuthZone('#act2');
                verify.hideAuthZone('#act3');
                verify.hideAuthZone('#act4');
                verify.showAuthZone('#act5');

                break;
            case 404:
                // Invalid activation code show error message
                verify.hideAuthZone('#act1');
                verify.hideAuthZone('#act2');
                verify.hideAuthZone('#act3');
                verify.hideAuthZone('#act4');
                verify.hideAuthZone('#act5');
                verify.showAuthZone('#act6');
                break;

            default:
                var ajaxErr = {status: "error"};


        }

    },

    app_butt_const: function (myapp) {

        var env_vector = ( myapp.environment === 'production') ? 'file__icon--production' : 'file__icon--sandbox';
        var app_icon = ( myapp.app_icon !== '') ? '<img class="app_icon_view" alt="Company Logo" id="icon_pic_large" src="' + myapp.app_icon + '">' : '<img class="app_icon_view" alt="Company Logo" id="icon_pic_large" src="' + myapp.app_icon + '">';


        var app_icon = '<div class="intro-y col-span-6 sm:col-span-4 md:col-span-3 xxl:col-span-2">' +
            '<div class="file box rounded-md px-5 pt-5 pb-5 px-3 sm:px-5 relative zoom-in">' +

            '<a href="/applications/' + myapp.app_id + '" class="w-3/5 file__icon ' + env_vector + ' mx-auto">' +

            '<div class="file__icon__file-name">' + app_icon + '</div></a>' +
            '<a href="/applications/' + myapp.app_id + '" class="block font-medium mt-4 text-center truncate">' + myapp.app_name + '</a>' +
            '<div class="text-gray-600 text-xs text-center">Created : ' + myapp.created + '</div>' +

            '</div>' +
            '</div>';

        $('#appContainer').append(app_icon);


    }

}

verify.initialise();

/* APPS FORM CONSTRAINTS */

var form_options = {
    rules: {
        email_address: {
            required: true,
            email: true
        },
        app_desc: {required: true},
        app_code: "required",
        app_website: {
            required: true,
            url: true
        },
        app_redirect: {
            required: true,
            email: true
        },
        app_cert_list: "required",
        app_env_list: "required"
    },
    messages: {
        email_address: {
            required: "Please provide a valid email address",
            email: "This doesnt look like a valid email address",
            equalTo: "Please enter the same password as above"
        },
        app_desc: "Please enter a valid Application Country",
        app_code: "Please enter a valid App Code",
        app_website: "Please enter your Applications Website",
        app_redirect: "Please enter your App Redirect Location",
        username: {
            required: "Please enter a username",
            minlength: "Your username must consist of at least 2 characters"
        },
        password: {
            required: "Please provide a password",
            minlength: "Your password must be at least 5 characters long"
        },
        confirm_password: {
            required: "Please provide a password",
            minlength: "Your password must be at least 5 characters long",
            equalTo: "Please enter the same password as above"
        },
        app_cert_list: "Please select the apps chosen certificate",
        app_env_list: "Please select the apps chosen environment",
        topic: "Please select at least 2 topics"
    },
    submitHandler: function (form) {

        verify.form_submitted();

    }
};