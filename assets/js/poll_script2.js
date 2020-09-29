

var test_result = 0;
var time_out_seconds = 100000;
var interval_seconds = 2;

var poll_handler = {

    initialise: function () {

        var urlParams = new URLSearchParams(location.search);
        var intentid = urlParams.get('intent-id');

        // get details from back-end
        var rsp = $.ajax({
            type: "GET",
            url: _config.base_api_path + "poll/init" + intentid,
            async: false,
            headers: {
                "Content-Type": "application/json"
            }
        }).done(function (result) {
            return result;
        }); 

        if (rsp.status === 302) {
            
            var data = JSON.parse(rsp.responseText)
         
            window.location.replace(data.location);
            setTimeout(function () {

                jQuery("#QR2").qrcode({
                    render:"table",
                    width: 128,
                    height: 128,
                    text: data.location
                });

                var to = time_out_seconds * 1000;
                var itv = interval_seconds * 1000;
       
                poll_handler.poll({}, to, itv, data.consentid).then(function () {
                }).catch(function () {
                    // Polling timed out, handle the error!
                    console.log('Polling Error')
                });                
            }, 500);
        }


        
        //return rsp;


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
                                setTimeout(checkCondition, interval, resolve, reject);
                            } else { console.log(poll)
                                window.location.replace(result.responseJSON.redirect_url);
                            }
                            break;

                        case 'redirect':   
                        console.log('HERE')
                        console.log(result.responseJSON.redirect_url)                         
                            window.location.replace(result.responseJSON.redirect_url);
                            break;

                    }
            }
        };

        return new Promise(checkCondition);
    },
    poll_conditional: function (consentid) { console.log(999); console.log(_config.base_api_path + "poll/" + consentid);

        var rsp = $.ajax({
            type: "GET",
            url: _config.base_api_path + "poll/" + consentid,
            async: false,
            headers: {
                "Content-Type": "application/json"
            }
        }).done(function (result) { console.log(result)
            return result;
        });
        return rsp;

    },

    
}

poll_handler.initialise();