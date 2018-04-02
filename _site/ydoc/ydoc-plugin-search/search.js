$(function(){
  var $searchResult = $('.js-search-result'),
      $searchInput = $('.js-input');

  // 去除空格
  String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
  };

  // 判断是否为空对象
  function realObj(obj) {
    for (var i in obj) {
      return true;
    }
    return false;
  }

  // 防抖函数
  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  var highlightTextPrevNum = 6;
  var highlightTextNextNum = 20;
  // 简化文本内容长度
  function simplifyStrDom(str, val) {
    var index = str.indexOf(val);
    var startIndex = index > highlightTextPrevNum ? index - highlightTextPrevNum : 0;
    var sliceStr = str.slice(startIndex, index + val.length + highlightTextNextNum);
    var addHighlightStr = sliceStr.replace(val, '<span class="highlight">' + val + '</span>');
    var ellipsis = (sliceStr.lastIndexOf(val) != -1) || (sliceStr.lastIndexOf(val) > highlightTextNextNum) ? '...' : '';
    return addHighlightStr + ellipsis;
  }

  // 监听输入的内容
  $searchInput.on('input', debounce(function(e) {
    var val = e.target.value.trim(),
        res = window.ydoc_plugin_search_core(val);
    
    $searchResult.show();
    if (realObj(res) || val === '') {
      var dom = '';
      for (var key in res) {
        dom += `<div class="headline">${key}</div>`;
        res[key].forEach(function(item) {
          var contentDom = '';
          item.children.forEach(function(i) {
            i.title = simplifyStrDom(i.title, val);
            i.content = simplifyStrDom(i.content, val);
            contentDom += `<div class="caption" onclick="window.open('${i.url}', '_self')">
                <div class="title">${i.title}</div>
                <div class="desc">${i.content}</div>
              </div>`;
          });
          dom += `<div class="row">
            <div class="subtitle" onclick="window.open('${item.url}', '_self')">${item.title}</div>
            <div class="content">${contentDom}</div>
          </div>`;
        });
      }
      $searchResult.html(dom);
    } else {
      $searchResult.html(`<div class="empty">没有找到关键词 <b>${val}</b> 的搜索结果</div>`)
    }
  }, 300));

  // $searchInput
  $searchInput.on('blur', function(e) {
    $searchResult.hide();
  });

  // ESCAPE key pressed
  $(document).on('keydown', function (e) {
    if (e.keyCode == 27) {
      $searchInput[0].value = '';
      $searchResult.hide();
    }
  });
})