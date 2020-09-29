var test_result = 0;
var time_out_seconds = 100000;
var interval_seconds = 2;

var auth_sim = {

    initialise: function () {

        var urlParams = new URLSearchParams(location.search);
        var consentid = urlParams.get('consent-id');
        var rsp = 'https://tell.money/404.html';

        rsp = $.ajax({
            type: "GET",
            url: 'https://system.tell.money/v1/auth/stub?consent-id=' + consentid,
            async: false,
            headers: {
                "Content-Type": "application/json"
            }
        }).done(function (result) {
            return result;
        });

        if (rsp.status !== 200) {
            
            rsp = $.ajax({
                type: "GET",
                url: 'https://system.tell.money/dev/auth/stub?consent-id=' + consentid,
                async: false,
                headers: {
                    "Content-Type": "application/json"
                }
            }).done(function (result) {
                return result;
            });
        }

        $("a").attr("href", rsp.responseJSON.tpp_url);

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
                                console.log('timeout - redirecting to TPP')
                                window.location.replace(result.responseJSON.redirect_url);
                            }
                            break;

                        case 'redirect':
                            console.log('redirecting to TPP')
                            window.location.replace(result.responseJSON.redirect_url);
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

auth_sim.initialise();