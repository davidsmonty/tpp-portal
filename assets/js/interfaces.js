/**
 * Created by tonypoole on 15/06/2020.
 */

var interfaces = {
    initialise: function () {


        // Register Events
        this.registerOnclicks();
        // Read Existing Cookie

        console.log(tell_user_token_data);


        // Register Events
        this.registerOnclicks();
        // Read Existing Cookie
        switch(pi) {
            case 'InterfaceMain':
                // code block
                this.getInterfaces();
                break;
            case 'InterfaceView':
                // code block

                this.getInterface();
                break;
            case 'AppsAdd':
                // code block
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
    createInterface: function () {

        interfaces.updateAlertManager('close', true);


            var params = {
                'tpp-id': tell_user_token_data.client_uuid,
                'name': $('#interface_name').val(),
                'desc': $('#interface_desc').val(),
                'website': $('#interface_website').val(),
                'subdomain': $('#interface_subdomain').val()

            };


            var ajaxCallData = {
                type: "POST",
                url: _config.base_api_path + "aspsp/" + tell_user_token_data.client_uuid + '/interface',
                data: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json",
                    "x-jwt-token": tell_cookie.tell_token
                }

            };

            tell_ajax_handler.caller(interfaces.createInterfaceResponseHandler, ajaxCallData);




    },
    updateInterface: function () {

        interfaces.updateAlertManager('close', true);

        var path = window.location.pathname // /account/search
        var app_id = path.split("/").pop();
        var app_id = '8db251d7-f01c-481e-a164-bb0bd6e30151';

        var params = {
            'tpp-id': tell_user_token_data.client_uuid,
            'name': $('#interface_name').val(),
            'desc': $('#interface_desc').val(),
            'website': $('#interface_website').val(),
            'subdomain': $('#interface_subdomain').val()

        };


            var ajaxCallData = {
                type: "PATCH",
                url: _config.base_api_path + "aspsp/" + tell_user_token_data.client_uuid + '/interface/'+app_id,
                data: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json",
                    "x-jwt-token": tell_cookie.tell_token
                }

            };

            tell_ajax_handler.caller(interfaces.createInterfaceResponseHandler, ajaxCallData);




    },
    getInterfaces: function () {

        var params = {};

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path + "aspsp/" + tell_user_token_data.client_uuid + '/interface',
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token": tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.populateInterfaces, ajaxCallData);
    },
    getInterface: function () {

        var path = window.location.pathname // /account/search
        var app_id = path.split("/").pop();

        var app_id = '8db251d7-f01c-481e-a164-bb0bd6e30151';

        var params = {};

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path + "aspsp/" + tell_user_token_data.client_uuid + '/interface/'+app_id,
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token": tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.populateInterfaceData, ajaxCallData);
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
            interfaces.image_uploader(reader.result,fileType);
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
    redirect: function (location) {

        window.location = location;

    },
    createInterfaceResponseHandler: function (data) {



        if(data.status==='error'){
            interfaces.updateAlertManager('show', false);
        } else
        {
            interfaces.updateAlertManager('show', true);

            setTimeout(function () {
                interfaces.redirect("/interface/"+data.interface_id);
            }, 2000);

        }


        $('.unclicked_form_button').removeClass('saving');
        $('.unclicked_form_button').prop('disabled', false);

    },
    form_submitted: function () {

        // Add Class to indicate loading
        $('.unclicked_form_button').addClass('saving');
        $('.unclicked_form_button').prop('disabled', true);

        switch (pi) {
            case 'InterfaceAdd':
                // code block
                console.log('Create Interface');
                interfaces.createInterface();
                break;
            case 'InterfaceView':
                // code block
                console.log('Update Organisation NCA Data');
                interfaces.updateInterface();
                break;

            default:
                console.log('Update Other')


        }

    },
    populateInterfaces: function (interface_array) {

        console.log(interface_array);


        var i;
        for (i = 0; i < interface_array.length; i++) {

            interfaces.interface_butt_const(interface_array[i]);
        }

    },
    populateInterfaceData: function (interfacedata) {

      console.log(interfacedata);


        $('#interface_name').val(interfacedata.name);
        $('#interface_desc').val(interfacedata.desc);
        $('#interface_website').val(interfacedata.website);
        $('#interface_subdomain').val(interfacedata.subdomain);
        $('#logo_pic_small').attr("src", interfacedata.interface_icon);
        $('#logo_pic_large').attr("src", interfacedata.interface_icon);



        $('#profile_summary_org_name').text(interfacedata.name);
        $('#profile_summary_org_created').text(profile_data.last_check_nca);



    },
    interface_butt_const: function (myinterface) {

        var env_vector = 'file__icon--sandbox';
        var app_icon = ( myinterface.interface_icon !== '') ? '<img class="app_icon_view" alt="Interface Logo" id="icon_pic_large" src="'+myinterface.interface_icon+'">': '<img class="app_icon_view" alt="Interface Logo" id="icon_pic_large" src="'+myinterface.interface_icon+'">';


        var app_icon = '<div class="intro-y col-span-6 sm:col-span-4 md:col-span-3 xxl:col-span-2">' +
            '<div class="file box rounded-md px-5 pt-5 pb-5 px-3 sm:px-5 relative zoom-in">' +

            '<a href="/interfaces/'+myinterface.interface_id+'" class="w-3/5 file__icon ' + env_vector + ' mx-auto">' +

            '<div class="file__icon__file-name">' + app_icon + '</div></a>' +
            '<a href="/interfaces/'+myinterface.interface_id+'" class="block font-medium mt-4 text-center truncate">' + myinterface.name + '</a>' +
            '<div class="text-gray-600 text-xs text-center">' + myinterface.portal_domain + '</div>' +

            '</div>' +
            '</div>';

        $('#appContainer').append(app_icon);


    }

}

interfaces.initialise();

/* APPS FORM CONSTRAINTS */

var form_options = {
    groups: {
        interface_subdomain: "interface_subdomain"
    },
    rules: {
        interface_name: "required",
        interface_desc: {required: true},
        interface_website: {
            required: true,
            url: true
        },
        interface_subdomain: {
                required: true
            }
    },
    messages: {
        interface_name: "Please enter a valid Application Name",
        interface_desc: "Please enter a valid Application Country",
        interface_website: "Please enter a valid App Code",
        interface_subdomain: "Please enter your Applications Website"
    },
    errorPlacement: function(error, element) {
        if (element.attr("name") == "interface_subdomain") {

            error.appendTo(".subdomain_err");
        } else {
            error.insertAfter(element);
        }
    },
    submitHandler: function (form) {

        interfaces.form_submitted();

    }
};