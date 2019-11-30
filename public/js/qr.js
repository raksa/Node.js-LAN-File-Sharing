var getServerInfo = function (callback) {
    var request = new XMLHttpRequest();
    request.open('GET', '/share/info', true);

    var onError = function (caller) {
        //TODO check if offline (or server is down)
        console.log(request);
    }

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var resp = request.responseText;
            var data = JSON.parse(resp);
            if ("addresses" in data && "port" in data) {
                updateAddress(data["addresses"], data["port"]);
            }
        } else {
            onError(0);
        }
    };

    request.onerror = function () { onError(1); };

    request.send();
}

getServerInfo();
setInterval(function () {
    getServerInfo();
}, 2000);