var IPandPort = document.getElementById('IPandPort');
var updateAddress = function (addresses, port) {
    if (!(addresses instanceof Array)) return;
    IPandPort.innerText = addresses.map(function (address) {
        return [address, port].join(":");
    }).join(", ");
    if (addresses.length > 0) {
        document.getElementById("theQRCode").setAttribute("src", `/qr_codes/${addresses[0]}_${port}.png`)
    } else {
        document.getElementById("theQRCode").setAttribute("src", "");
    }
}