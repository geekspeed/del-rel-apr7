window.onload = function () {

    console.log('in formOfPaymentResponse.html');
    // tell parent window of arrival

    function getJsonFromUrl() {
        var query = location.search.substr(1);
        return _.reduce(query.split('&'), function(memo, param) {
            memo[param.split('=')[0]] = param.split('=')[1];
            return memo;
        }, {})
    };

    function responseReceived() {
        console.log('in formOfPaymentResponse.html, sending message to parent window');
        var message = getJsonFromUrl();
        var hostUrl = window.location.protocol + "//" + window.location.host;
        window.parent.postMessage(message, hostUrl);
    }

    // announce presence to parent window
    responseReceived();
}