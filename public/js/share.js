var previousFileNames = null;
var fileList = document.getElementById('fileList');
var updateFileList = function (fileNames, allowDeletion) {
    if (!(fileNames instanceof Array)) {
        fileList.innerHTML = "";
        return;
    }
    if (arrayEquals(previousFileNames, fileNames)) {
        return;
    }

    //TODO do this with document.createElement
    fileList.innerHTML = fileNames.map(function (fileName) {
        return `<div class="list-item">
        <a target="_blank" href="./f/`+ fileName + `" class="list-group-item" download>` + fileName + `</a>
        ${allowDeletion ? `<a class="list-group-item-close" href="javascript:void(0);" onclick="deleteFile('` + fileName + `')">&times;</a>` : ''}
      </div>`;
    }).join('');

    previousFileNames = fileNames;
}

function arrayEquals(ar1, ar2) {
    if (ar1 == null) {
        return ar2 == null;
    }
    if (ar2 == null) {
        return ar1 == null;
    }
    if (ar1.length != ar2.length) {
        return false;
    } else {
        for (var index = 0; index < ar1.length; index++) {
            if (ar1[index] != ar2[index]) return false;
        }
        return true;
    }
}

var deleteFile = function (fileName) {
    if (!confirm("Are you sure?")) return;
    var request = new XMLHttpRequest()
    request.open('GET', `./f/del/` + fileName, true)
    request.send();
}

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
            if ("fileList" in data) {
                updateFileList(data["fileList"], data["allowDeletion"]);
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


/* Query based upload success error stuff */

var queryText = location.search;

//Clearing query.
window.history.pushState('obj', document.title, "http://" + location.host + location.pathname);

//TODO do this properly
var successIndex = queryText.startsWith("?success=");
if (successIndex) {
    var successPanel = document.getElementById('successPanel');
    if (successPanel) successPanel.className = successPanel.className.replace("hidden", "");

    var fileSuccessName = document.getElementById('fileSuccessName');
    fileSuccessName.innerText = decodeURIComponent(queryText.substring(9));

} else if (queryText.startsWith("?error=")) {
    var errorPanel = document.getElementById('errorPanel');
    if (errorPanel) errorPanel.className = errorPanel.className.replace("hidden", "");
}

/* Drag n Drop Upload */

var holder = document.body;
var fileToUploadButton = document.getElementById('fileToUploadButton');

holder.ondragover = function (e) {
    e.preventDefault();
    e.stopPropagation();
    var x = e.pageX;
    var y = e.pageY;

    fileToUploadButton.style.position = "fixed";
    fileToUploadButton.style.top = (y - 11) + "px";
    fileToUploadButton.style.left = (x - 40) + "px";

};

var fixButtonBack = function () { fileToUploadButton.style.position = "static"; }
holder.ondragend = fixButtonBack;
holder.ondragexit = fixButtonBack;
holder.ondragleave = function (e) {
    //console.log("holder.ondragleave",e);
    if (e.target == fileToUpload
        || e.pageX <= 10 || e.pageX >= window.innerWidth - 10
        || e.pageY <= 10 || e.pageY >= window.innerHeight - 10) {
        fixButtonBack();
    }
}
holder.ondrop = function (e) {
    if (e.target != fileToUpload) {
        e.preventDefault();
    }
    fixButtonBack();
}


var fileToUpload = document.getElementById('fileToUpload');
fileToUpload.onchange = function (e) {
    holder.className += " success";
    setTimeout(function () {
        fileToUpload.form.submit();
    }, 1);
}