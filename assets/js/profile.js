console.log(tell_user_token_data);
var profile = {
    initialise: function()  {

        // Register Events
        this.registerOnclicks();
        // Read Existing Cookie
        switch(pi) {
            case 'UserProfile':
                // code block
                this.getUserProfile();
                this.updateProfilePicture();
                break;
            case 'UserProfileMFA':
                // code block
                this.getUserProfile();
                this.getUserMFA();
                break;
            case 'OrganisationCerts':
                // code block
                this.getOrganisationCerts();
                break;
            case 'OrganisationUsers':
                // code block
                this.getOrganisationUsers();
                break;
            default:
                console.log('Update Other')
                this.getUserProfile();

        }

        this.populate_selects();

    },
    registerOnclicks: function() {


        $(".checkmark").click(function() {

            var el = $(this), newone = el.clone(true);
            el.before(newone);
            $("." + el.attr("class") + ":last").remove();

        });

       // const preview = document.querySelector('img');
       // const file = document.querySelector('input[type=file]').files[0];
        const reader = new FileReader();


        reader.addEventListener("load", function () {
            // convert image file to base64 string
            const preview = document.querySelector('img');
            preview.src = reader.result;
        }, false);



        $(document).on("click", "#login_button", function (event) {
            auth.s1_process();
        });

        $(document).on("click", ".closeUpdateAlert", function (event) {
            profile.updateAlertManager('close',true);
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
    updateProfilePicture: function(){


            const preview = $('#profile_pic_large');

            const file = $("#profile_picture_new").prop('files')[0];

if(file!==undefined) {
    var fileType = file["type"];


    const reader = new FileReader();

    reader.addEventListener("load", function () {
        // convert image file to base64 string
        preview.src = reader.result;
        $("#profile_pic_large").attr("src", reader.result);
        profile.image_uploader(reader.result, fileType);
        console.log('Attempt Image upload')

    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

    },
    image_uploader: function(img_data,type){




        var params = {
            'image' : img_data,
            'image_type' : type
        };

        var ajaxCallData = {
            type: "POST",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid +'/user/' + tell_user_token_data.user_uuid+'/avatar',
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.updateImageResponseHandler, ajaxCallData);



    },
    getUserProfile: function(){

        console.log(tell_cookie.tell_token);
        console.log(tell_user_token_data);

        var params = { };

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid +'/user/' + tell_user_token_data.user_uuid,
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.populateUserProfile, ajaxCallData);



    },
    getUserMFA: function(){

        console.log(tell_cookie.tell_token);
        console.log(tell_user_token_data);

        var params = { };

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid +'/user/' + tell_user_token_data.user_uuid+'/mfa',
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.populateUserMFAList, ajaxCallData);



    },
    getOrganisationCerts: function(){


        var params = { };

        var ajaxCallData = {
            type: "GET",
            url: _config.base_api_path+"tpp/"+ '758cbb53-47fa-473c-8b5b-35eb35aa6a90'+'/cert',
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
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid +'/user/' + tell_user_token_data.user_uuid,
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
            case 'UserProfile':
                // code block
                console.log('Update User Profile');
                profile.updateUser();
                break;
            case 'UserProfileSecurity':
                // code block
                console.log('Update Security Credentials');
                profile.updateUserPassword();
                break;
            case 'OrganisationCerts':
                // code block
                console.log('Add Organisation Certificate');
                profile.updateOrganisationCert();
                break;
            default:
                console.log('Update Other')


        }

    },
    updateUser: function(){

        profile.updateAlertManager('close',true);


        var params = {
            'tpp-id':  tell_user_token_data.client_uuid ,
            'user_first_name': $('#user_first_name').val(),
            'user_last_name' : $('#user_last_name').val(),
            'user_display_name' : $('#user_display_name').val(),
            'user_role' : $('#user_role').val(),
            'user_email' : $('#user_email').val(),
            'user_phone' : $('#user_phone').val(),
            'user_address' : $('#user_address').val()
        };

        var ajaxCallData = {
            type: "PATCH",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid +'/user/' + tell_user_token_data.user_uuid,
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.updateUserResponseHandler, ajaxCallData);


    },
    updateUserPassword: function(){

        profile.updateAlertManager('close',true);


        var params = {
            'tpp-id':  tell_user_token_data.client_uuid ,
            'existing_pword': $('#existing_pword').val(),
            'new_pword' : $('#new_pword').val(),
            'c_new_pword' : $('#c_new_pword').val()
        };

        var ajaxCallData = {
            type: "PATCH",
            url: _config.base_api_path+"tpp/"+ tell_user_token_data.client_uuid +'/user/' + tell_user_token_data.user_uuid+'/credentials',
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.updateUserResponseHandler, ajaxCallData);


    },
    updateOrganisation: function(){

        profile.updateAlertManager('close',true);

        $('#user_first_name').val(profile_data.first_name);
        $('#user_last_name').val(profile_data.last_name);
        $('#user_display_name').val(profile_data.display_name);
        $('#user_role').val(profile_data.role);
        $('#user_email').val(profile_data.email_address);
        $('#user_phone').val(profile_data.contact_number);
        $('#user_address').val(profile_data.address);

        var params = {
            'tpp-id': '758cbb53-47fa-473c-8b5b-35eb35aa6a90',
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

        profile.updateAlertManager('close',true);

        var params = {
            'tpp-id': '758cbb53-47fa-473c-8b5b-35eb35aa6a90',
            'cert_environment':  $('#cert_env-list').val(),
            'cert' : $('#base64pem').val(),
            'cert_type' :$('#cert_type-list').val()
        };

        var ajaxCallData = {
            type: "POST",
            url: _config.base_api_path+"tpp/"+ '758cbb53-47fa-473c-8b5b-35eb35aa6a90'+'/cert',
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.updateOrganisationCertResponseHandler, ajaxCallData);


    },
    updateOrganisationNCA: function(){

        profile.updateAlertManager('close',true);

        var params = {
            'tpp-id': '758cbb53-47fa-473c-8b5b-35eb35aa6a90',
            'nca': $('#nca-list').val(),
            'gurn': $('#nca_num').val(),

        };

        var ajaxCallData = {
            type: "PATCH",
            url: _config.base_api_path+"tpp/"+ '758cbb53-47fa-473c-8b5b-35eb35aa6a90',
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                "x-jwt-token" : tell_cookie.tell_token
            }

        };

        tell_ajax_handler.caller(this.updateOrganisationResponseHandler, ajaxCallData);


    },
    updateUserResponseHandler: function(profile_data){

        if(profile_data.status!=='error') {
            profile.updateAlertManager('show', true);

            console.log(profile_data)

            profile.populateUserProfile(profile_data);

            $('.unclicked_form_button').removeClass('saving');
            $('.unclicked_form_button').prop('disabled', false);
        } else {
            profile.updateAlertManager('show', false);
            $('.unclicked_form_button').removeClass('saving');
            $('.unclicked_form_button').prop('disabled', false);
        }


    },
    updateImageResponseHandler: function(profile_data){

        console.log(profile_data);
        profile.updateAlertManager('show', true);

        profile.getOrganisationCerts();


        $('.unclicked_form_button').removeClass('saving');
        $('.unclicked_form_button').prop('disabled', false);



    },
    updateOrganisationCertResponseHandler: function(profile_data){

        console.log(profile_data);
        profile.updateAlertManager('show', true);

        profile.getOrganisationCerts();


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
    populateUserProfile: function(profile_data) {

        $('#user_first_name').val(profile_data.first_name);
        $('#user_last_name').val(profile_data.last_name);
        $('#user_display_name').val(profile_data.display_name);
        $('#user_role').val(profile_data.role);
        $('#user_email').val(profile_data.email_address);
        $('#user_phone').val(profile_data.contact_number);
        $('#user_address').val(profile_data.address);

        $('#profile_summary_org_name').text(profile_data.tpp_name);
        $('#profile_summary_org_created').text(profile_data.last_check_nca);
        $('#logo_pic_small').attr("src", profile_data.logo);
        $('#logo_pic_large').attr("src", profile_data.logo);

        $('#profile_pic_small').attr("src", profile_data.icon);
        $('#profile_pic_large').attr("src", profile_data.icon);

    },
    populateUserMFAList: function(mfa_data) {

        console.log(mfa_data);

        if(mfa_data.length !== undefined) {

            $('#mfa_list').html('');

            $.each(mfa_data, function () {

                var cert_row = '' +
                    '<tr class="intro-x"><td class="w-30"><div class="flex m-3">' + this['device_name'] + '</div></td>' +
                    '<td class="text-center"><div class="text-gray-600 text-xs whitespace-no-wrap mt-3">' + this['confirmed_date'] + '</div></td>' +
                    '<td class=""><div class="flex items-center justify-center text-theme-9"> <button class="button w-24 rounded-full shadow-md mr-1 mb-2 bg-theme-9 text-white">Active</button></div></td>' +
                    '<td class="table-report__action w-56 mt-3">' +
                    '<div class="text-center"> <a href="javascript:;" data-toggle="modal" data-target="#delete-modal-preview" class="button inline-block bg-theme-1 text-white">Show Modal</a> </div><div class="flex justify-center items-center mt-3 ">' +
                    '<a class="flex items-center text-theme-6 mt-3" href="javascript:;" data-toggle="modal" data-target="#delete-confirmation-modal"> <i data-feather="trash-2" class="w-4 h-4 mr-1"></i> Delete </a></div></td>' +
                    '</tr>';

                $('#mfa_list').append(cert_row);
            });

        }

    }

}

$.validator.addMethod("pwcheck", function(value) {
    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
        && /[a-z]/.test(value) // has a lowercase letter
        && /[A-Z]/.test(value) // has a lowercase letter
        && /\d/.test(value) // has a digit
});

profile.initialise();


/* ORGANISATION FORM CONSTRAINTS */

var form_options = {
    rules: {
        user_display_name: "required",
        user_first_name: { required : true},
        user_last_name: "required",
        user_role: "required",
        user_email: "required",
        user_phone: "required",
        user_address: "required",
        existing_pword: {
            required: true,
            minlength: 8
        },
        new_pword: {
            required: true,
            pwcheck: true,
            minlength: 8
        },
        c_new_pword: {
            required: true,
            equalTo: "#new_pword"
        }
    },
    messages: {
        user_display_name: "Please choose a display name",
        user_first_name: "Please enter your first name",
        user_last_name: "Please enter your last name",
        username: {
            required: "Please enter a username",
            minlength: "Your username must consist of at least 2 characters"
        },
        existing_pword: {
            required: "Please provide your current password",
            minlength: "Your password must be at least 8 characters long",
        },
        new_pword: {
            required: "Please provide a password",
            minlength: "Your password must be at least 8 characters long",
            pwcheck: "Please check your password format"
        },
        c_new_pword: {
            required: "Please provide a password",
            minlength: "Your password must be at least 5 characters long",
            equalTo: "Please enter the same password as above"
        },
        user_role: "Please enter a valid role",
        user_email: "Please enter a valid contact email address",
        user_phone: "Please enter a valid contact number",
        user_address: "Please enter a valid address"
    },
    submitHandler : function(form) {

        profile.form_submitted();

    }
};