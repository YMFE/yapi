function generateHtml(url) {
  return `
        <div class="item">
          <span class="url">${url}</span> 
          <span class="del">✕</span>
        </div>
      `
}


var key = 'y_request_allow_urls';

var urls = chrome.runtime.sendMessage({action:'get', name: key}, function(urls){
  var urlDom = $('#urls');

  if (!urls || $.trim(urls) === '{}') {
    urls = { 'http://yapi.corp.qunar.com': true ,
      '127.0.0.1': true,
      '0.0.0.0' : true
      };
    chrome.runtime.sendMessage({action:'set', name: key, value: JSON.stringify(urls)})
    
  }
  else urls = JSON.parse(urls);

  for (var url in urls) {
    urlDom.append(generateHtml(url));
  }

  $('#add .submit').bind('click', function () {
    
    var val = $('#add input').val()
    if (val) urls[val] = true;
    chrome.runtime.sendMessage({
      action:'set',
      name: key,
      value: JSON.stringify(urls)
    })
    
    urlDom.append(generateHtml(val))
  })

  urlDom.on('click', '.del', function (event) {
    console.log('del')
    var p = event.target.parentNode;
    var url = $(p).find('.url').text();
    delete urls[url]

    chrome.runtime.sendMessage({
      action:'set',
      name: key,
      value: JSON.stringify(urls)
    })
    p.parentNode.removeChild(p)
  })
});
