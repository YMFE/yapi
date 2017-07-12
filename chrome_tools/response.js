/*==============common begin=================*/

var container = 'y-request';
var INITSTATUS = 0;
var RUNSTATUS = 1;
var ENDSTATUS = 2;
var localStorageKey = 'y_request_allow_urls'
/*==============common end=================*/

var yRequestDom = document.getElementById(container);

function handleHeader(headers) {
    if (!headers) return;
    var newHeaders = {}, headers = headers.split(/[\r\n]/).forEach(function (header) {
        var index = header.indexOf(":");
        var name = header.substr(0, index);
        var value = header.substr(index + 2);
        if (name) {
            newHeaders[name] = value;
        }

    })
    return newHeaders;
}

function resFn(res, dom, data) {
    if (!res) return;
    var id = dom.getAttribute("_id");
    var headers = handleHeader(this.getAllResponseHeaders());
    data.res = {
        id: id,
        status: this.status,
        statusText: this.statusText,
        header: headers,
        body: res
    }

    dom.innerText = JSON.stringify(data);
    dom.setAttribute('status', ENDSTATUS);
}

function formUrlencode(data) {
    return Object.keys(data).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&')
}

function sendAjax(req, successFn, errorFn) {

    var formDatas;
    var xhr = new XMLHttpRequest();

    xhr.timeout = req.timeout || 5000;

    req.method = req.method || 'GET';
    req.async = req.async === false ? false : true;
    req.headers = req.headers || {};

    if (req.method.toLowerCase() !== 'get') {
        if (!req.headers['Content-Type'] || req.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
            req.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            req.data = formUrlencode(req.data);
        } else if (req.headers['Content-Type'] === 'multipart/form-data') {
            formDatas = new FormData();
            if (req.data) {
                for (var name in req.data) {
                    formDatas.append(name, req.data[name]);
                }
            }
            if (req.files) {
                for (var name in req.files) {
                    var files = document.getElementById(req.files[name]).files;
                    if (files.length > 0) {
                        formDatas.append(name, files[0]);
                    }
                }
            }
            req.data = formDatas;
        } else if (typeof req.data === 'object' && req.data) {
            req.data = JSON.stringify(req.data);
        }
    } else {
        if (req.data) {
            var getUrl = formUrlencode(req.data);
            req.url = req.url + '?' + getUrl;
            req.data = '';
        }

    }



    xhr.open(req.method, req.url, req.async);

    if (req.headers) {
        for (var name in req.headers) {
            xhr.setRequestHeader(name, req.headers[name]);
        }
    }

    xhr.onload = function (e) {
        if (this.status == 200) {
            successFn.call(xhr, this.responseText);
        } else {
            errorFn.call(xhr, this.responseText)
        }
    };
    xhr.ontimeout = function (e) {
        errorFn.call(xhr, 'Error:Request timeout that the time is ' + xhr.timeout)
    };
    xhr.onerror = function (e) {
        errorFn.call(xhr, xhr.statusText)
    };
    xhr.upload.onprogress = function (e) { };

    xhr.send(req.data);

}

function yResponse() {
    var reqsDom = yRequestDom.childNodes;
    if (!reqsDom || reqsDom.length === 0) return;
    reqsDom.forEach(function (dom) {
        try {
            var status = dom.getAttribute("status"), request;

            if (+status === INITSTATUS) {
                dom.setAttribute("status", RUNSTATUS);
                var data = JSON.parse(dom.innerText);
                var req = data.req;

                sendAjax(req, function (res) {
                    resFn.bind(this)(res, dom, data);
                }, function (err) {
                    resFn.bind(this)(err, dom, data);
                })
            }
        } catch (error) {
            console.error(error.message)
            dom.parentNode.removeChild(dom)
        }

    })
}

function isAllowHost() {
    chrome.runtime.sendMessage({ action: 'get', name: localStorageKey }, function (res) {
        res = JSON.parse(res);
        var flag = false;
        for (var name in res) {
            if (location.href.indexOf(name) > -1) {
                flag = true;
            }
        }
        if (flag && yRequestDom) {
            console.log('yRequest running...')
            setInterval(function () {
                yResponse()
            }, 100)
        }
    })

}


isAllowHost();

