/*
 Converts url params to JSON for return to parent.
 */
function getJsonFromUrl() {
    var query = decodeURI(location.search);
    // remove all question marks at start of query string, there may be one or two
    var questionPos = 0;
    while(query.charAt(questionPos) == '?') {
        questionPos ++;
    }

    return _.reduce(query.substr(questionPos).split('&'), function(memo, param) {
        memo[param.split('=')[0]] = param.split('=')[1];
        return memo;
    }, {})
};

window.onload = function () {

    var mode = document.getElementById('mode');
    mode.value = window.location.host;

    function doSubmit(event) {
        console.log('in formOfPayment.js, doSubmit called');
        var message = {
            submitCardInfo: true,
            creditCard: {
                cardNumber: document.getElementById('cc_no').value,
                expirationMonth: document.getElementById('cc_exp_mm').value,
                expirationYear: document.getElementById('cc_exp_yyyy').value,
                cvv: document.getElementById('cvv').value
            }
        };
        // console.log('in formOfPayment.js, submitting form');
        var paymentForm = document.getElementById('formOfPaymentForm');
        paymentForm.submit();
    }

    // report to parent form so parent can respond back with prepopulated data from server
    var message = {params: getJsonFromUrl()};
    if(!message.params.inSessionID) {
        message = {formLoaded: true};
    }
    else {
        console.log('in formOfPayment.js, form reloaded');
        message.formReLoaded = true;
        var hostUrl = window.location.protocol + "//" + window.location.host;
        // console.log('in formOfPayment.js, sending message to parent form:' + JSON.stringify(message));
        // console.log('in formOfPayment.js, after response hostUrl:' + hostUrl);
        window.parent.postMessage(message, hostUrl);
    }
    var ccNo, expirationMonth, expirationYear, cvv;
    ccNo = document.getElementById('cc_no');
    expirationMonth = document.getElementById('cc_exp_mm');
    expirationYear = document.getElementById('cc_exp_yyyy');
    cvv = document.getElementById('cvv');
    window.addEventListener('message', function (messageEvent) {
        console.log('in formOfPayment.html, got messageEvent, data:' + JSON.stringify(messageEvent.data) + ', origin:' + messageEvent.origin + ', source:' + messageEvent);
        var message = messageEvent.data;
        if (typeof message === 'object') {
            if (message.sessionId) {
                var sessionIdInput = document.getElementById('inSessionID');
                sessionIdInput.value = message.sessionId;
                var clientNoInput = document.getElementById('client_no');
                clientNoInput.value = message.clientNo;
                var paymentForm = document.getElementById('formOfPaymentForm');
                paymentForm.action = message.url;
                // console.log('in formOfPayment.js, got inSessionId:' + message.inSessionid);
                // console.log('in formOfPayment.js, got clientNo:' + message.clientNo);
            }
            if (message.cardNumber) {
                // console.log('in formOfPayment.js, message.cardNumber:' + message.cardNumber);
                if(clientNoInput.value) {
                    ccNo.value = message.cardNumber;
                    expirationMonth.value = message.expirationMonth;
                    expirationYear.value = message.expirationYear;
                    cvv.value = message.cvv || '***';
                    doSubmit();
                }
                else {
                    // console.log('in formOfPayment.js, clientNoInput.value not set');
                    var hostUrl = window.location.protocol + "//" + window.location.host;
                    window.parent.postMessage({
                        formReLoaded: true,
                        params: {errors: 1}
                    }, hostUrl);
                }
            } else {
                // console.log('in formOfPayment.js, message.cardNumber not set');
            }
        } else {
            // console.log('in formOfPayment.js, typeof message not object');
        }
    });
}
