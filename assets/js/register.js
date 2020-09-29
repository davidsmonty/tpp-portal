/**
 * Created by tonypoole on 15/06/2020.
 */

var register = {
    initialise: function () {


        // Register Events
        this.registerOnclicks();
        // Read Existing Cookie


        // Register Events
        this.registerOnclicks();
        // Read Existing Cookie
        switch(pi) {
            case 'Register':
                // code block
                this.register_tpp();
                break;
            default:
                console.log('Update Other')

        }


    },
    register_tpp: function(){
        console.log('Registered')
    },
    registerOnclicks: function () {

        $(".checkmark").click(function () {

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
    getOrganisationCerts: function () {

        var params = {};

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path + "tpp/" + tell_user_token_data.client_uuid + '/cert',
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token": tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.populateCertificates, ajaxCallData);


    },
    populateCertificates: function(cert_data){

        console.log(cert_data);

        var nca_list = $("#app_cert_list");

        $.each(cert_data, function() {
            nca_list.append($("<option />").val(this['tell_cert_key']).text(this['tell_cert_key']+'   ('+this['environment']+') '));
        });




    },
    createRegistration: function () {

        register.updateAlertManager('close', true);


            var params = {
                'interface_id': _config.iface_uuid,
                'first_name': $('#first_name').val(),
                'last_name': $('#last_name').val(),
                'name': $('#organisation_name').val(),
                'website': $('#website_url').val(),
                'email': $('#email_address').val(),
                'phone': $('#contact_number').val(),
                'password': $('#passwd').val()

            };



            var ajaxCallData = {
                type: "POST",
                url: _config.base_api_path + "tpp",
                data: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json"
                }

            };

            tell_ajax_handler.caller(register.createRegistrationResponseHandler, ajaxCallData);




    },
    createRegistrationResponseHandler: function (data){

        register.updateAlertManager('show', true);

        $('.FormDetails').hide();

        $('.unclicked_form_button').removeClass('saving');
        $('.unclicked_form_button').hide();


    },
    image_uploader: function(img_data,type){


        var path = window.location.pathname // /account/search
        var app_id = path.split("/").pop();



        var params = {
            'image' : img_data,
            'image_type' : type
        };

        var ajaxCallData = {
            type: "POST",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid +'/app/'+ app_id +'/app-icon',
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.updateImageResponseHandler, ajaxCallData);



    },updateImageResponseHandler: function(profile_data){

        console.log(profile_data);
        org.updateAlertManager('show', true);

        this.getApp();


        $('.unclicked_form_button').removeClass('saving');
        $('.unclicked_form_button').prop('disabled', false);



    },

    createApplicationResponseHandler: function (data) {


        apps.updateAlertManager('show', true);

        $('.unclicked_form_button').removeClass('saving');
        $('.unclicked_form_button').prop('disabled', true);

    },
    form_submitted: function () {

        // Add Class to indicate loading
        $('.unclicked_form_button').addClass('saving');
        $('.register_btn').prop('disabled', true);

        switch (pi) {
            case 'Register':
                // code block
                console.log('Register');
                register.createRegistration();
                break;

            default:
                console.log('Update Other')


        }

    },
    populateApps: function (apps_array) {

        console.log(apps_array);


        var i;
        for (i = 0; i < apps_array.length; i++) {

            apps.app_butt_const(apps_array[i]);
        }

    },
    populateAppData: function (appdata) {

      console.log(appdata);


        $('#app_name').val(appdata.app_name);
        $('#app_desc').val(appdata.description);
        $('#app_code').val(appdata.nickname);
        $('#app_website').val(appdata.website);
        $('#app_redirect').val(appdata.redirect_url);
        $('#app_cert_list').val(appdata.tell_cert_key);
        $('#app_env_list').val(appdata.county);
        $('#app_icon').val(appdata.county);
        $('#app_env_list').val(appdata.environment);
        $('#icon_pic_large').attr("src", appdata.app_icon);



        $('#nca-list').val(profile_data.nca);

        $('#nca_num').val(profile_data.gurn);

        $('#profile_summary_org_name').text(profile_data.tpp_name);
        $('#profile_summary_org_created').text(profile_data.last_check_nca);
        $('#logo_pic_small').attr("src", profile_data.logo);
        $('#logo_pic_large').attr("src", profile_data.logo);



    },
    app_butt_const: function (myapp) {

        var env_vector = ( myapp.environment === 'production') ? 'file__icon--production' : 'file__icon--sandbox';
        var app_icon = ( myapp.app_icon !== '') ? '<img class="app_icon_view" alt="Company Logo" id="icon_pic_large" src="'+myapp.app_icon+'">': '<img class="app_icon_view" alt="Company Logo" id="icon_pic_large" src="'+myapp.app_icon+'">';


        var app_icon = '<div class="intro-y col-span-6 sm:col-span-4 md:col-span-3 xxl:col-span-2">' +
            '<div class="file box rounded-md px-5 pt-5 pb-5 px-3 sm:px-5 relative zoom-in">' +

            '<a href="/applications/'+myapp.app_id+'" class="w-3/5 file__icon ' + env_vector + ' mx-auto">' +

            '<div class="file__icon__file-name">' + app_icon + '</div></a>' +
            '<a href="/applications/'+myapp.app_id+'" class="block font-medium mt-4 text-center truncate">' + myapp.app_name + '</a>' +
            '<div class="text-gray-600 text-xs text-center">Created : ' + myapp.created + '</div>' +

            '</div>' +
            '</div>';

        $('#appContainer').append(app_icon);


    }

}

register.initialise();

/* APPS FORM CONSTRAINTS */

$.validator.addMethod("pwcheck", function(value) {
    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
        && /[a-z]/.test(value) // has a lowercase letter
        && /[A-Z]/.test(value) // has a lowercase letter
        && /\d/.test(value) // has a digit
});

var form_options = {
    rules: {
        first_name: "required",
        last_name: {required: true},
        organisation_name: "required",
        website_url: {
            required: true,
            url: true
        },
        email_address: {
                required: true
            },
        contact_number: "required",
        c_passwd: {
            required: true,
            equalTo: "#passwd"
        },
        passwd: {
            required: true,
            pwcheck: true,
            minlength: 8
        }
    },
    messages: {
        first_name: "Please enter a valid First Name",
        last_name: "Please enter a valid Last Name",
        organisation_name: "Please enter a Organisation Name",
        website_url: "Please enter your Website Url",
        email_address: "Please enter a valid email address",
        username: {
            required: "Please enter a username",
            minlength: "Your username must consist of at least 2 characters"
        },
        passwd: {
            required: "Please provide a password",
            minlength: "Your password must be at least 8 characters long",
            pwcheck: "Please check your password format"
        },
        c_passwd: {
            required: "Please provide a password",
            minlength: "Your password must be at least 5 characters long",
            equalTo: "Please enter the same password as above"
        },
        contact_number: "Please enter a valid contact number"
    },
    submitHandler: function (form) {

        register.form_submitted();

    }
};