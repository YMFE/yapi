
function regexp_parse(p, c) {//遍历json中的regexp字符串，并将其转为RegExp对象。其中p为被转换的json，c为存储对象。	"kry|regexp/i|":"<(.*)>(.*)<\/(.*)>|<(.*)\/>"
  c = c || {};
  for (var i in p) {
    if (!p.hasOwnProperty(i)) {
      continue;
    }
    if (typeof p[i] === 'object') {
      c[i] = (p[i].constructor === Array) ? [] : {};
      regexp_parse(p[i], c[i]);
    } else {

      if (/^\w+\s*\|\s*(regexp){1}\s*(\/\s*[img])?/.test(i)) {
        var regexpStr = i.split("|");
        var regex = regexpStr[1].split("/");
        if (regex[0]) {
          try {
            if (regex[1]) {
              c[i.replace(/\|regexp\s*(\/[img]*)?\s*/, "")] = new RegExp(p[i], regex[1]);
            } else {
              c[i.replace(/\|regexp\s*(\/[img]*)?\s*/, "")] = new RegExp(p[i]);
            }
          }
          catch (e) {
            c[i] = p[i];
          }
        }

      } else {
        c[i] = p[i];
      }

    }
  }
  return c;
}




function mockToDocModel(mock,doc,key) {
  doc = doc || [];
  key = key || [];
  for (var i in mock) {
    if (!mock.hasOwnProperty(i)) {
      continue;
    }
    var index = i;
    if(/^\w+(\|\w+)?/.test(i)){
      index = i.split("|")[0];
    }
    if (typeof mock[i] === 'object') {
      if (mock[i].constructor === Array) {
        //为数组时
        if(mock.constructor != Array){
          if(key.length){
            key.push("."+ index + "[]");
          }else{
            key.push(index + "[]");
          }
          
        }else{
          key.push("[]");
        }
        doc.push(key.join(""));
        
      } else {
        // 为object时
        if(mock.constructor != Array){
          if(key.length){
            key.push('.'+index);
          }else{
            key.push(index);
          }
          
          doc.push(key.join());
        }
      }
      mockToDocModel(mock[i],doc,key);
      key.pop();
    } else {
      if(mock.constructor != Array){
        if(key.length){
          doc.push(key.join("")+"."+index);
        }else{
          doc.push(index);
        }
      }
    }
  }
  return doc;
}
mockToDocModel({
  "errcode": "@integer",
  "data|9-19": [
    "123",
    { 
      "name": "@name",
      "name1": [{
        "name3":"1"
      }]
    }],
  "data4": [1,2],
  "data1": "123",
  "data3": {
    "err": "errCode",
    "arr": [1,2]
  }
})
module.exports = {
  mockToDocModel: mockToDocModel,
  regexp_parse: regexp_parse
};
