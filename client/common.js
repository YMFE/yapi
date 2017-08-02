import moment from 'moment'

exports.formatTime = (timestamp) => {
  return moment.unix(timestamp).format("YYYY-MM-DD HH:mm:ss")
}

exports.regexp_parse = regexp_parse;
function regexp_parse(p,c) {//遍历json中的regexp字符串，并将其转为RegExp对象。其中p为被转换的json，c为存储对象。
  c = c || {}; 
  for (var i in p) {  
    if(! p.hasOwnProperty(i)){  
      continue;  
    }  
    if (typeof p[i] === 'object') {  
      c[i] = (p[i].constructor === Array) ? [] : {};  
      regexp_parse(p[i], c[i]);  
    } else {  
      if(/^\/.+\/$/.test(p[i])){
        var regexpStr = p[i].substring(1,p[i].length-1);
        try{
          c[i] = new RegExp(regexpStr);
        }
        catch(e)
        {
          c[i] = p[i];
        }
      }else{
        c[i] = p[i]; 
      }
      
    }  
  }  
  return c;  
}
