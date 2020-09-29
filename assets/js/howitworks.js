var org = {
    initialise: function()  {

        // Register Events

        // Read Existing Cookie

        if(_config.pisp){
        $('.pisp_functionality').show();
        }

        this.populate_selects();

    },
    registerOnclicks: function() {


        $(".checkmark").click(function() {

            var el = $(this), newone = el.clone(true);
            el.before(newone);
            $("." + el.attr("class") + ":last").remove();

        });

        $(document).on("click", "#login_button", function (event) {
            auth.s1_process();
        });

        $(document).on("click", ".closeUpdateAlert", function (event) {
            org.updateAlertManager('close',true);
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

        const reader = new FileReader();


        reader.addEventListener("load", function () {
            // convert image file to base64 string
            org.updatelogoPicture();
            const preview = document.querySelector('img');
            preview.src = reader.result;
        }, false);
    },
    updatelogoPicture: function(){


        const preview = $('#logo_pic_large');

        const file = $("#org_logo_new").prop('files')[0];


        var fileType = file["type"];


        const reader = new FileReader();

        reader.addEventListener("load", function () {
            // convert image file to base64 string
            preview.src = reader.result;
            $("#logo_pic_large").attr("src",reader.result);
            org.image_uploader(reader.result,fileType);
            console.log('Attempt Image upload')

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }


    },
    image_uploader: function(img_data,type){




        var params = {
            'image' : img_data,
            'image_type' : type
        };

        var ajaxCallData = {
            type: "POST",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid +'/logo',
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.updateImageResponseHandler, ajaxCallData);



    },
    populate_selects: function(){

        var nca_list = $("#nca-list");

        $.each(nca_lu, function() {
            nca_list.append($("<option />").val(this['nca-code']).text('('+this['nca-code']+') '+this['nca-name']));
        });

        var country_list = $("#org_add_country");

        $.each(countries_lu, function() {
            country_list.append($("<option />").val(this['id']).text(this['text']+' - ('+ this['id']+')'));
        });





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

        tell_ajax_handler.caller(this.populateOrgProfile, ajaxCallData);



    },
    getOrganisationCerts: function(){

        var params = { };

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid +'/cert',
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.populateCertificates, ajaxCallData);



    },
    getOrganisationUsers: function(){

        var params = { };

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path+"tpp/"+ '758cbb53-47fa-473c-8b5b-35eb35aa6a90'+'/user/'+user_uuid,
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.populateCertificates, ajaxCallData);



    },


    form_submitted: function(){

        // Add Class to indicate loading
        $('.unclicked_form_button').addClass('saving');
        $('.unclicked_form_button').prop('disabled', true);

        switch(pi) {
            case 'OrganisationProfile':
                // code block
                console.log('Update Organisation Profile');
                org.updateOrganisation();
                break;
            case 'OrganisationNCA':
                // code block
                console.log('Update Organisation NCA Data');
                org.updateOrganisationNCA();
                break;
            case 'OrganisationCerts':
                // code block
                console.log('Add Organisation Certificate');
                org.updateOrganisationCert();
                break;
            default:
                console.log('Update Other')


        }

    },
    updateOrganisation: function(){

        org.updateAlertManager('close',true);

        var params = {
            'tpp-id': tell_user_token_data.client_uuid,
            'org_name': $('#organisation_name').val(),
            'org_trading_name' : $('#org_trading_name').val(),
            'org_website' : $('#org_website').val(),
            'org_add1' : $('#org_add1').val(),
            'org_add2' : $('#org_add2').val(),
            'org_add_tc' : $('#org_add_tc').val(),
            'org_add_county' : $('#org_add_county').val(),
            'org_add_pcode' : $('#org_add_pcode').val(),
            'org_add_country' : $('#org_add_country').val()

        };

        var ajaxCallData = {
            type: "PATCH",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid,
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.updateOrganisationResponseHandler, ajaxCallData);


    },
    updateOrganisationCert: function(){

        org.updateAlertManager('close',true);

        var params = {
            'tpp-id': tell_user_token_data.client_uuid,
            'cert_environment':  $('#cert_env-list').val(),
            'cert' : $('#base64pem').val(),
            'cert_type' :$('#cert_type-list').val()
        };

        var ajaxCallData = {
            type: "POST",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid +'/cert',
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.updateOrganisationCertResponseHandler, ajaxCallData);


    },
    updateOrganisationNCA: function(){

        org.updateAlertManager('close',true);

        var params = {
            'tpp-id': '758cbb53-47fa-473c-8b5b-35eb35aa6a90',
            'nca': $('#nca-list').val(),
            'gurn': $('#nca_num').val(),

        };

        var ajaxCallData = {
            type: "PATCH",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid,
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.updateOrganisationResponseHandler, ajaxCallData);


    },
    updateOrganisationResponseHandler: function(profile_data){

        org.updateAlertManager('show', true);

        org.populateOrgProfile(profile_data);

        $('.unclicked_form_button').removeClass('saving');
        $('.unclicked_form_button').prop('disabled', false);



    },
    updateOrganisationCertResponseHandler: function(profile_data){

        console.log(profile_data);
        org.updateAlertManager('show', true);

        org.getOrganisationCerts();


        $('.unclicked_form_button').removeClass('saving');
        $('.unclicked_form_button').prop('disabled', false);



    },
    updateAlertManager: function(action, status){

        switch(action) {
            case 'close':
                $('.updateAlertSuccess').hide( "fast", function() {   });
                $('.updateAlertFailure').hide( "fast", function() {   });
                break;
            case 'show':

                if(status===true){
                    $('.updateAlertSuccess').show( "fast", function() {   });
                } else {
                    $('.updateAlertFailure').show( "fast", function() {   });
                }


                break;
            default:
                console.log('Update Other')


        }

    },    updateImageResponseHandler: function(profile_data){

        console.log(profile_data);
        org.updateAlertManager('show', true);

        org.getOrganisation();


        $('.unclicked_form_button').removeClass('saving');
        $('.unclicked_form_button').prop('disabled', false);



    },
    populateCertificates: function(cert_data){

            console.log(cert_data);
        if(cert_data.length !== undefined) {

            $('#certificate_list').html('');

            $.each(cert_data, function () {

                var cert_row = '' +
                    '<tr class="intro-x"><td class="w-30"><div class="flex m-3">' + this['tell_cert_key'] + '</div></td>' +
                    '<td class="text-center"><div class="text-gray-600 text-xs whitespace-no-wrap mt-3">' + this['environment'] + '</div></td>' +
                    '<td class="text-center"><div class="text-gray-600 text-xs whitespace-no-wrap  mt-3">eIDAS</div></td>' +
                    '<td class="text-center"><div class="text-gray-600 text-xs whitespace-no-wrap mt-3">'+ this['certificate_expiry'] + '</div></td>' +
                    '<td class=""><div class="flex items-center justify-center text-theme-9"> <button class="button w-24 rounded-full shadow-md mr-1 mb-2 bg-theme-9 text-white">Active</button></div></td>' +
                    '<td class="table-report__action w-56 mt-3"><div class="text-center"> <a href="javascript:;" data-toggle="modal" data-target="#delete-modal-preview" class="button inline-block bg-theme-1 text-white">Show Modal</a> </div><div class="flex justify-center items-center mt-3 "><a class="flex items-center text-theme-6 mt-3" href="javascript:;" data-toggle="modal" data-target="#delete-confirmation-modal"> <i data-feather="trash-2" class="w-4 h-4 mr-1"></i> Delete </a></div></td>' +
                    '</tr>';

                $('#certificate_list').append(cert_row);
            });

        }


    },
    populateOrgProfile: function(profile_data){


        $('#organisation_name').val(profile_data.tpp_name);
        $('#org_trading_name').val(profile_data.trading_name);
        $('#org_website').val(profile_data.website);
        $('#org_add1').val(profile_data.address1);
        $('#org_add2').val(profile_data.address2);
        $('#org_add_tc').val(profile_data.town_city);
        $('#org_add_county').val(profile_data.county);
        $('#org_add_pcode').val(profile_data.postcode);
        $('#org_add_country').val(profile_data.country);

        $('#profile_summary_org_name').text(profile_data.tpp_name);
        $('#profile_summary_org_created').text(profile_data.last_check_nca);
        $('#logo_pic_small').attr("src", profile_data.logo);
        $('#logo_pic_large').attr("src", profile_data.logo);



        $('#nca-list').val(profile_data.nca);

        $('#nca_num').val(profile_data.gurn);

        $('#profile_summary_org_name').text(profile_data.tpp_name);
        $('#profile_summary_org_created').text(profile_data.last_check_nca);
        $('#logo_pic_small').attr("src", profile_data.logo);
        $('#logo_pic_large').attr("src", profile_data.logo);

        if(pi==='OrganisationNCA'){
        // Remove any button actions
        switch(profile_data.nca_check_status) {
            case 'Pending Verification':
                $('.nca-verification').removeClass('bg-theme-9');
                $('.nca-verification').removeClass('bg-theme-6');
                $('.nca-verification').addClass('bg-theme-12');
                $(".nca-verification").html("Pending Verification");

                break;
            case 'Failed Verification':
                $('.nca-verification').removeClass('bg-theme-9');
                $('.nca-verification').removeClass('bg-theme-12');
                $('.nca-verification').addClass('bg-theme-6');
                $(".nca-verification").html("Failed Verification");
                break;
            case 'Verified':
                $('.nca-verification').removeClass('bg-theme-12');
                $('.nca-verification').removeClass('bg-theme-6');
                $('.nca-verification').addClass('bg-theme-9');
                $(".nca-verification").html("Verified");
                $('#nca-list').prop('disabled', true);
                $("#nca_num").prop('disabled', true);
                $(".unclicked_form_button").hide();
                break;
            default:
                console.log('Update Other')


        }}


    }
}

org.initialise();


/* ORGANISATION FORM CONSTRAINTS */

var form_options = {
    rules: {
        organisation_name: "required",
        org_add_country: { required : true},
        organisation_trading_name: "required",
        org_website: "required",
        org_add1: "required",
        org_add2: "required",
        org_add_tc: "required",
        org_add_county: "required",
        org_add_pcode: "required"
    },
    messages: {
        organisation_name: "Please enter a valid Organisation Name",
        org_add_country: "Please enter a valid Organisation Country",
        lastname: "Please enter your lastname",
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
        email: "Please enter a valid email address",
        agree: "Please accept our policy",
        topic: "Please select at least 2 topics"
    },
    submitHandler : function(form) {

        org.form_submitted();

    }
};