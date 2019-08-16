export default  function forJson(json) {
    var html='';
    try {
        var fomjson=formatJson(json);
        html= Process(fomjson);
    }catch (e) {
        html=json;
    }
    return html;

}

//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
  function formatJson(json, options) {
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
    if (typeof json !== 'string') {
        json = JSON.stringify(json,null,4);
    } else {
        json = JSON.parse(json);
        json = JSON.stringify(json,null,4);
    }

    return json;
}
//引用示例部分
//(1)创建json格式或者从后台拿到对应的json格式
//var originalJson = {"name": "binginsist", "sex": "男", "age": "25"};
//下面用一个真实的json数据做测试
//var originalJson = {
//    "_errmsg":"ok",
//    "result":[
//    ],
//    "stat":"wechat",
//    "_token":"",
//    "weixinId":"900504",
//    "_errcode":"0",
//    "regionId":"00000000"
//}
//
//(2)调用formatJson函数,将json格式进行格式化
//var resultJson = formatJson(originalJson);
////(3)将格式化好后的json写入页面中
//document.getElementById("writePlace").innerHTML = '<pre>' +resultJson + '<pre/>';

//着色
 function Process(json) {
   //var json = $('#y1').text();
    var html = "";
    try {
        if (json == "") {
            json = '""';
        }
        var obj = eval("[" + json + "]");
        html = ProcessObject(obj[0], 0, false, false, false);
        //$("#show").html(html);
        return html;
    } catch(e) {
        html=json;
    }
}function IsArray(obj) {
    return obj &&
        typeof obj === 'object' &&  typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length'));
}

function ProcessObject(obj, indent, addComma, isArray, isPropertyContent) {
    var html = "";
    var comma = (addComma) ? "<span class='Comma'>,</span> ": "";
    var type = typeof obj;
    if (IsArray(obj)) {
        if (obj.length == 0) {
            html += GetRow(indent, "<span class='ArrayBrace'>[ ]</span>" + comma, isPropertyContent);
        } else {
            html += GetRow(indent, "<span class='ArrayBrace'>[</span>", isPropertyContent);
            for (var i = 0; i < obj.length; i++) {
                html += ProcessObject(obj[i], indent + 1, i < (obj.length - 1), true, false);
            }
            html += GetRow(indent, "<span class='ArrayBrace'>]</span>" + comma);
        }
    } else {
        if (type == "object" && obj == null) {
            html += FormatLiteral("null", "", comma, indent, isArray, "Null");
        } else {
            if (type == "object") {
                var numProps = 0;
                for (var prop in obj) {
                    prop=prop+""; 
                    numProps++;
                }
                if (numProps == 0) {
                    html += GetRow(indent, "<span class='ObjectBrace'>{ }</span>" + comma, isPropertyContent)
                } else {
                    html += GetRow(indent, "<span class='ObjectBrace'>{</span>", isPropertyContent);
                    var j = 0;
                    for (var prop1 in obj) {
                        html += GetRow(indent + 1, '<span class="PropertyName">"' + prop1 + '"</span>: ' + ProcessObject(obj[prop1], indent + 1, ++j < numProps, false, true))
                    }
                    html += GetRow(indent, "<span class='ObjectBrace'>}</span>" + comma);
                }
            } else {
                if (type == "number") {
                    html += FormatLiteral(obj, "", comma, indent, isArray, "Number");
                } else {
                    if (type == "boolean") {
                        html += FormatLiteral(obj, "", comma, indent, isArray, "Boolean");
                    } else {
                        if (type == "function") {
                            obj = FormatFunction(indent, obj);
                            html += FormatLiteral(obj, "", comma, indent, isArray, "Function");
                        } else {
                            if (type == "undefined") {
                                html += FormatLiteral("undefined", "", comma, indent, isArray, "Null");
                            } else {
                                html += FormatLiteral(obj, '"', comma, indent, isArray, "String");
                            }
                        }
                    }
                }
            }
        }
    }
    return html;
}

function FormatLiteral(literal, quote, comma, indent, isArray, style) {
    if (typeof literal == "string") {
        literal = literal.split("<").join("&lt;").split(">").join("&gt;");
    }
    var str = "<span class='" + style + "'>" + quote + literal + quote + comma + "</span>";
    if (isArray) {
        str = GetRow(indent, str);
    }
    return str;
}
function FormatFunction(indent, obj) {
    var tabs = "";
    for (var i = 0; i < indent; i++) {
        tabs += "    ";
    }
    var funcStrArray = obj.toString().split("\n");
    var str = "";
    for (var j= 0; j < funcStrArray.length; j++) {
        str += ((j == 0) ? "": tabs) + funcStrArray[j] + "\n";
    }
    return str;
}
function GetRow(indent, data, isPropertyContent) {
    var tabs = "";
    for (var i = 0; i < indent && !isPropertyContent; i++) {
        tabs += "    ";
    }
    if (data != null && data.length > 0 && data.charAt(data.length - 1) != "\n") {
        data = data + "\n";
    }
    return tabs + data;
}
