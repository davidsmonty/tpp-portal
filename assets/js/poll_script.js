var test_result = 0;
var time_out_seconds = 100000;
var interval_seconds = 2;

var poll_handler = {

    initialise: function () {

        var urlParams = new URLSearchParams(location.search);
        var consentid = urlParams.get('consent-id');

        var to = time_out_seconds * 1000;
        var itv = interval_seconds * 1000;

        poll_handler.poll({}, to, itv, consentid).then(function () {

            console.log('Polling Complete')
            // Polling done, now do something else!
        }).catch(function () {
            // Polling timed out, handle the error!
            console.log('Polling Error')
        });


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
                            console.log('fail')
                            $("#pre_consent").hide();
                            $("#consent_fail").show();
                            break;

                        case 'qr':
                            $("#pre_consent").show();
                            if (Number(new Date()) < endTime) {
                                console.log('polling pre qr')
                                setTimeout(checkCondition, interval, resolve, reject);
                            }
                            break;

                        case 'poll':
                            $("#pre_consent").hide();
                            $("#consent_wait").show();
                            if (Number(new Date()) < endTime) {
                                console.log('polling post qr')
                                setTimeout(checkCondition, interval, resolve, reject);
                            } else {
                                alert()
                                //console.log('timeout - redirecting to TPP')
                                window.location.replace(result.responseJSON.redirect_url);
                                alert('timeout - redirecting to TPP')
                            }
                            break;

                        case 'redirect':
                            console.log('redirecting to TPP')
                            window.location.replace(result.responseJSON.redirect_url);
                            //alert('redirecting to TPP')
                            break;

                    }

                // all out error
                /*default:
                    var err = 'Unrecognised outcome - Reject';
                    console.log(err)
                    $("#pre_consent").hide();
                    $("#consent_fail").show();
                */
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
        console.log(JSON.stringify(rsp))
        return rsp;

    },
}

poll_handler.initialise();