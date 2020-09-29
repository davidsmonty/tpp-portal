/**
 * Created by tonypoole on 15/06/2020.
 */

let app_env = '';
let cert_key = '';

var apps = {
    initialise: function () {
        // Register Events
        this.registerOnclicks();
        // Read Existing Cookie
       switch(pi) {
            case 'AppsMain':
                // code block

                this.getApps();
                break;
            case 'AppView':
                // code block
                this.getApp();

                //this.getApp();
                break;
            case 'AppsAdd':
                // code block
                this.getOrganisation();
                this.getOrganisationCerts();
                break;
            case 'OrganisationCerts':
                // code block
                this.getOrganisation();
                this.getOrganisationCerts();
                break;
            case 'OrganisationUsers':
                // code block
                this.getOrganisationUsers();
                break;
            default:
                console.log('Update Other')

        }


    },
    registerOnclicks: function () {

        $('[data-toggle="tooltip"]').tooltip()

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

    disableEnvironmentOption: function(value){

        $('#app_env_list option[value="'+value+'"]').attr("disabled", true);

    },
    populateOrgProfile: function(profile_data){

        var path = window.location.pathname // /account/search
        var path_env_full = path.split("/").pop();
        var path_env = path.split("-").pop();



        if(path_env=='sandbox'){


            if (profile_data.cert_count === 0) {

                $('.noApps').show();
                $('#page_form').hide();

            } else
            {
                $('.noApps').hide();
            }
        } else {



            if (profile_data.valid_eidas === 0) {

                $('.noAppsEidas').show();
                $('#page_form').hide();

            }

            if (profile_data.valid_nca === 0) {

                $('.noAppsNCA').show();
                $('#page_form').hide();

            }

        }


        switch(pi) {


        case 'AppsAdd':
            // code block
            if (profile_data.active_sandbox === 0) {
                apps.disableEnvironmentOption('sandbox');
            }
            if (profile_data.active_production === 0) {
                apps.disableEnvironmentOption('production');
            }

            break;

        default:
            console.log('Update Other')
    };
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
    getOrganisationCertsAppView: function () {

        var params = {};

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path + "tpp/" + tell_user_token_data.client_uuid + '/cert',
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token": tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.populateCertificatesAppView, ajaxCallData);


    },
    populateCertificatesAppView: function(cert_data){



        var nca_list = $("#app_cert_list");



        $.each(cert_data, function() {



            if(app_env=='sandbox') {

                nca_list.append($("<option />").val(this['tell_cert_key']).text(this['nickname'] + ' '));

            } else {

                if(this['cert_type']==='eidas'){
                    nca_list.append($("<option />").val(this['tell_cert_key']).text(this['nickname'] + ' '));
                }

            }

        });

        if(cert_key!=''){
            $('#app_cert_list').val(cert_key);
        }





    },
    populateCertificates: function(cert_data){

        console.log(cert_data);

        var nca_list = $("#app_cert_list");

        $.each(cert_data, function() {

            var path = window.location.pathname // /account/search
            var path_env_full = path.split("/").pop();
            var path_env = path.split("-").pop();


            if(path_env=='sandbox') {

                nca_list.append($("<option />").val(this['tell_cert_key']).text(this['nickname'] + ' '));

            } else {

                if(this['cert_type']==='eidas'){
                    nca_list.append($("<option />").val(this['tell_cert_key']).text(this['nickname'] + ' '));
                }

            }

        });




    },
    createApplication: function () {

        var path = window.location.pathname // /account/search
        var path_env_full = path.split("/").pop();
        var path_env = path.split("-").pop();

        apps.updateAlertManager('close', true);


            var params = {
                'tpp-id': tell_user_token_data.client_uuid,
                'app_name': $('#app_name').val(),
                'app_icon': '',
                'app_desc': $('#app_desc').val(),
                // 'nickname': $('#app_code').val(),
                'app_website': $('#app_website').val(),
                'redirect_url': $('#app_redirect').val(),
                'app_cert': $('#app_cert_list').val(),
                'app_environment': path_env

            };


            var ajaxCallData = {
                type: "POST",
                url: _config.base_api_path + "tpp/" + tell_user_token_data.client_uuid + '/app',
                data: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json",
                    "x-jwt-token": tell_cookie.tell_token
                }

            };

            tell_ajax_handler.caller(apps.createApplicationResponseHandler, ajaxCallData);




    },
    updateApplication: function () {

        apps.updateAlertManager('close', true);

        var path = window.location.pathname // /account/search
        var app_id = path.split("/").pop();

        if(app_id==='admin_apps_view.html'){
            app_id = 'ad0169c7-09e2-4075-bae7-f414a6c06584';
        }


        var params = {
                'tpp-id': tell_user_token_data.client_uuid,
                'app_name': $('#app_name').val(),
                'app_desc': $('#app_desc').val(),
               // 'nickname': $('#app_code').val(),
                'app_website': $('#app_website').val(),
                'redirect_url': $('#app_redirect').val(),
                'app_cert': $('#app_cert_list').val(),
                'app_environment': app_env
            };


            var ajaxCallData = {
                type: "PATCH",
                url: _config.base_api_path + "tpp/" + tell_user_token_data.client_uuid + '/app/'+app_id,
                data: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json",
                    "x-jwt-token": tell_cookie.tell_token
                }

            };

            tell_ajax_handler.caller(apps.createApplicationResponseHandler, ajaxCallData);




    },
    getApps: function () {

        var params = {};

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path + "tpp/" + tell_user_token_data.client_uuid + '/app',
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token": tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.populateApps, ajaxCallData);
    },
    getApp: function () {

        var path = window.location.pathname // /account/search
        var app_id = path.split("/").pop();


        if(app_id==='admin_apps_view.html'){
            app_id = 'ad0169c7-09e2-4075-bae7-f414a6c06584';
        }

        var params = {};

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path + "tpp/" + tell_user_token_data.client_uuid + '/app/'+app_id,
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token": tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.populateAppData, ajaxCallData);
    },
    updateAppIcon: function(){


        const preview = $('#icon_pic_large');

        const file = $("#app_icon_new").prop('files')[0];


        var fileType = file["type"];


        const reader = new FileReader();

        reader.addEventListener("load", function () {
            // convert image file to base64 string
            preview.src = reader.result;
            $("#icon_pic_large").attr("src",reader.result);
            apps.image_uploader(reader.result,fileType);
            console.log('Attempt Image upload')

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }


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

        console.log(data.status);

        if(data.status==='error'){
            apps.updateAlertManager('show', false);
        } else
        {
            apps.updateAlertManager('show', true);

            setTimeout(function () {
                apps.redirect("/applications");
            }, 2000);

        }


        $('.unclicked_form_button').removeClass('saving');
        $('.unclicked_form_button').prop('disabled', false);

    },
    redirect: function (location) {

        window.location = location;

    },
    form_submitted: function () {



        // Add Class to indicate loading
        $('.unclicked_form_button').addClass('saving');
        $('.unclicked_form_button').prop('disabled', true);

        switch (pi) {
            case 'AppsAdd':
                // code block
                console.log('Create Application');
                apps.createApplication();
                break;
            case 'AppView':
                // code block
                console.log('Update Organisation NCA Data');
                apps.updateApplication();
                break;
            case 'OrganisationCerts':
                // code block
                console.log('Add Organisation Certificate');
                apps.updateOrganisationCert();
                break;
            default:
                console.log('Update Other')


        }

    },
    populateApps: function (apps_array) {


        var i;
        for (i = 0; i < apps_array.length; i++) {

            apps.app_butt_const(apps_array[i]);
        }

    },
    populateAppData: function (appdata) {


        $('#app_uuid').val(appdata.app_id);
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

        app_env = appdata.environment;
        cert_key = appdata.tell_cert_key;
        apps.getOrganisationCertsAppView();



    },
    getOrganisation: function(){

        var params = { };

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid,
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(apps.populateOrgProfile, ajaxCallData);



    },
    app_butt_const: function (myapp) {

        $('.sandboxNoApp').hide();

        if ( myapp.environment === 'production'){ $('.productionNoApp').hide(); } else { $('.sandboxNoApp').hide(); }

        var env_vector = ( myapp.environment === 'production') ? 'file__icon--production' : 'file__icon--sandbox';
        var env_section = ( myapp.environment === 'production') ? 'productionAppContainer' : 'sandboxAppContainer';
        var app_icon = ( myapp.app_icon !== '') ? '<img class="app_icon_view" alt="Company Logo" id="icon_pic_large" src="'+myapp.app_icon+'">': '<img class="app_icon_view" alt="Company Logo" id="icon_pic_large" src="'+myapp.app_icon+'">';


        var app_icon = '<div class="intro-y col-span-6 sm:col-span-4 md:col-span-3 xxl:col-span-2">' +
            '<div class="file box rounded-md px-5 pt-5 pb-5 px-3 sm:px-5 relative zoom-in">' +

            '<a href="/applications/'+myapp.app_id+'" class="w-3/5 file__icon ' + env_vector + ' mx-auto">' +

            '<div class="file__icon__file-name">' + app_icon + '</div></a>' +
            '<a href="/applications/'+myapp.app_id+'" class="block font-medium mt-4 text-center truncate">' + myapp.app_name + '</a>' +


            '</div>' +
            '</div>';

        $('#'+env_section).append(app_icon);



    }

}

apps.initialise();

/* APPS FORM CONSTRAINTS */

var form_options = {
    rules: {
        app_name: "required",
        app_desc: {required: true},
        app_code: "required",
        app_website: {
            required: true,
            url: true
        },
        app_redirect: {
                required: true,
                url: true
            },
        app_cert_list: "required",
        app_env_list: "required"
    },
    messages: {
        app_name: "Please enter a valid Application Name",
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

        apps.form_submitted();

    }
};