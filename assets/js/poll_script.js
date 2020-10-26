var test_result = 0;
var time_out_seconds = 360;
var interval_seconds = 2;

var poll_handler = {

    initialise: function () {

        loadGraphics();

        var urlParams = new URLSearchParams(location.search);
        var consent = urlParams.get('consent-id');
        var id = urlParams.get('id');
        var loc = atob(id);

        window.location.replace(loc);
        setTimeout(function () {

            jQuery("#QR2").qrcode({
                render: "table",
                width: 128,
                height: 128,
                text: loc
            });

            var to = time_out_seconds * 1000;
            var itv = interval_seconds * 1000;

            poll_handler.poll({}, to, itv, consent).then(function () {
            }).catch(function () {
                // Polling timed out, handle the error!                
            });
        }, 500);

    },

    poll: function (fn, timeout, interval, consentid) {
        var endTime = Number(new Date()) + (timeout || 2000);
        interval = interval || 100;

        var checkCondition = function (resolve, reject) {

            var result = poll_handler.poll_conditional(consentid);

            switch (result.status) {

                case 200:

                    // we have a response from db - validate it and take appropriate action

                    switch (result.responseJSON.action) {

                        case 'fail':
                            $("#pre_consent").hide();
                            $("#consent_fail").show();
                            break;

                        case 'qr':
                            $("#pre_consent").show();
                            if (Number(new Date()) < endTime) {
                                setTimeout(checkCondition, interval, resolve, reject);
                            }
                            break;

                        case 'poll':
                            $("#pre_consent").hide();
                            $("#consent_wait").show();
                            if (Number(new Date()) < endTime) {
                                setTimeout(checkCondition, interval, resolve, reject);
                            } else {
                                window.location.replace(result.responseJSON.redirect_url);
                            }
                            break;

                        case 'redirect':
                            window.location.replace(result.responseJSON.redirect_url);
                            break;

                    }
            }
        };

        return new Promise(checkCondition);
    },
    poll_conditional: function (consentid) {
        var rsp = $.ajax({
            type: "GET",
            url: _config.base_api_path + "poll/" + consentid,
            async: false,
            headers: {
                "Content-Type": "application/json"
            }
        }).done(function (result) {    
            return result;
        });
        return rsp;

    },


}

poll_handler.initialise();