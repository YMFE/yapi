(function (win) {

    /*==============common begin=================*/

    var container = 'y-request';
    var INITSTATUS = 0;
    var RUNSTATUS = 1;
    var ENDSTATUS = 2;

    /*==============common end=================*/


    function createNode(tagName, attributes, parentNode) {
        options = attributes || {};
        tagName = tagName || 'div';
        var dom = document.createElement(tagName);
        for (var attr in attributes) {
            if (attr === 'id') dom.id = options[attr];
            else dom.setAttribute(attr, options[attr]);
        }
        if (parentNode) parentNode.appendChild(dom);
        return dom;
    }

    function getid() {
        return container + '-' + id++;
    }


    var yRequestDom = createNode('div', { id: container, style: 'display:none' }, document.getElementsByTagName('body')[0]);
    var yRequestMap = {};
    var id = 0;
    var interval;


    function yRequest(req) {
        if (!req) return;
        if (typeof req === 'string') req = { url: req }

        data = {
            res: null,
            req: req
        }
        data = JSON.stringify(data, null, 4);
        var newId = getid();
        var div = createNode('div', {
            _id: newId,
            status: INITSTATUS
        }, yRequestDom);
        div.innerText = data;
        yRequestMap[newId] = {
            id: newId,
            status: INITSTATUS,
            success: function (res, header, data) {
                if (typeof req.success === 'function') {
                    req.success(res, header, data);
                }
            },
            error: function (error, header, data) {
                if (typeof req.error === 'function') {
                    req.error(error, header, data)
                }
            }
        }
        monitor();
    }



    function monitor() {
        if (interval) return;
        interval = setInterval(function () {
            var queueDom = yRequestDom.childNodes;
            if (!queueDom || queueDom.length === 0) {
                interval = clearInterval(interval);
            }

            try {
                for (var i = 0; i < queueDom.length; i++) {
                    try {
                        var dom = queueDom[i];
                        if (+dom.getAttribute('status') === ENDSTATUS) {
                            var text = dom.innerText;
                            if (text) {
                                var data = JSON.parse(dom.innerText);
                                var id = dom.getAttribute('_id');
                                var res = data.res;
                                if (res.status === 200) {
                                    yRequestMap[id].success(res.body, res.header, data);
                                } else {
                                    yRequestMap[id].error(res.statusText, res.header, data);
                                }
                                dom.parentNode.removeChild(dom);
                            } else {
                                dom.parentNode.removeChild(dom);
                            }

                        }
                    } catch (err) {
                        console.error(err.message);
                        dom.parentNode.removeChild(dom);
                    }
                }
            } catch (err) {
                console.error(err.message);
                interval = clearInterval(interval);
            }


        }, 50)
    }

    win.yRequest = yRequest;
    if (typeof define == 'function' && define.amd) {
        define('yRequest', [], function () {
            return yRequest;
        });
    }

})(window)

