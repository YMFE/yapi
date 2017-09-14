// file_id:2D7ABF69-3BC0-4175-98C9-5C3D5CB00158 -- nerver change this !!

/*
 * file: qsso-auth.js
 * URL: https://qsso.corp.qunar.com/lib/qsso-auth.js
 * written by zhibin.ning
 * version: 0.1
 *
 */ 


if (!window['QSSO']) {
var QSSO = (function () {

    var AUTH_SERVER = 'https://qsso.corp.qunar.com',
        LOGIN_PAGE = '/login.php',
        SORRY_PAGE = '/sorry.html';

    if (location.hostname.match(/qunar\.ctripgroup\.com$/i)) {
        AUTH_SERVER = 'https://qunar.ctripgroup.com/sec/qsso/api';
    }

    var qualifyURL = function (url, encode) {
        var url = url || '';
        var ret = location.protocol + '//' + location.host + (url.substr(0,1) === '/' ? '' : location.pathname.match(/.*\//)) + url;
        if (encode) {
            ret = encodeURIComponent(ret);
        }
        return ret;
    };

    var URLStringify = function (o) {
        var ret = [];
        for (var i in o) {
            // ret.push( encodeURIComponent(i) + '=' + encodeURIComponent(o[i]) );
	    ret.push(i + '=' + o[i]);
        }
        return ret.join('&');
    };

    return {
        'auth': function (loginURI, opt_ext) {
            if (!location.hostname.match(/\.qunar(man|ops)?\.com$|\.qunarman\.com$|qunar\.it$|\.928383\.com$|^928383\.com$|qunar\.ctripgroup\.c(om|n)$|\.ctrip(corp)?\.com$|^opsdata\.me$|\.mofun\.com$/i)) {
                location = AUTH_SERVER + SORRY_PAGE + '?host=' + qualifyURL('', true);
                return;
            }
            var ret = qualifyURL(loginURI, true);

            var redirectURL = AUTH_SERVER + LOGIN_PAGE + '?ret=' + ret + (opt_ext ? '&ext=' + encodeURIComponent(URLStringify(opt_ext)) : '');
            // console.log(redirectURL);
            location = redirectURL;
        },

        'attach': function (eid, loginURI, opt_ext) {
            QSSO.login = function() {
                QSSO.auth(loginURI, opt_ext);

            };
            document.getElementById(eid).onclick = QSSO.login;
            if (location.hash.match('qsso-auto-login')) {
                QSSO.login();
            }
        }
    };


})();


/* todo add QSSO login UI, frame login, etc */


}
