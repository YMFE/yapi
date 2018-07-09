$(function(){
  var $searchResult = $('.js-search-result'),
      $searchInput = $('.js-input'),
      activeIndex = 0;

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
    var reg = new RegExp('(' + val + ')', 'gi'); // 搜索的值进行高亮替换时, 忽略大小写
    var addHighlightStr = sliceStr.replace(reg, '<span class="highlight">' + '$1' + '</span>');
    var ellipsis = (sliceStr.lastIndexOf(val) != -1) || (sliceStr.lastIndexOf(val) > highlightTextNextNum) ? '...' : '';
    return addHighlightStr + ellipsis;
  }

  // 隐藏搜索结果框
  function hideSearchResult() {
    $searchResult.hide();
  }

  // 监听输入的内容
  $searchInput.on('input', debounce(function(e) {
    var val = e.target.value.trim(),
        res = window.ydoc_plugin_search_core(val);
    
    activeIndex = 0;
    $(document).off('keydown');
    $searchResult.show();
    if (realObj(res) || val === '') {
      var dom = '';
      for (var key in res) {
        dom += '<div class="headline">' + key + '</div>';
        res[key].forEach(function(item) {
          var contentDom = '';
          if (item.children.length) {
            item.children.forEach(function (i) {
              i.title = simplifyStrDom(i.title, val);
              i.content = simplifyStrDom(i.content, val);
              contentDom += '<a class="caption" href="' + i.url + '">' +
                '<div class="title">' + i.title + '</div>' +
                '<div class="desc">' + i.content + '</div></a>';
            });
          } else {
            item.title = simplifyStrDom(item.title, val);
            item.content = simplifyStrDom(item.content, val);
            contentDom = '<a class="caption" href="' + item.url + '">' +
              '<div class="title">' + item.title + '</div>' +
              '<div class="desc">' + item.content + '</div></a>';
          }
          dom += '<div class="row">' + 
            '<a class="subtitle" href="' + item.url + '">' + item.title + '</a>' + 
            '<div class="content">' + contentDom + '</div>' + 
          '</div>';
        });
      }
      $searchResult.html(dom);

      var $captions = $('.js-search-result .caption');
      var length = $captions.length;
      if ($captions.length) {
        $captions[activeIndex].classList.add('active');
        // 监听键盘事件 up: 38, down: 40, enter: 13
        $(document).on('keydown', function (e) {
          if (e.keyCode == 38) {
            $captions[activeIndex].classList.remove('active');
            activeIndex = (activeIndex + length - 1) % length;
            $captions[activeIndex].classList.add('active');
          } else if (e.keyCode == 40) {
            $captions[activeIndex].classList.remove('active');
            activeIndex = (activeIndex + 1) % length;
            $captions[activeIndex].classList.add('active');
          } else if (e.keyCode == 13) {
            window.open($captions[activeIndex].href, '_self');
          }
        });
      }
      // 按下 ESC 键，清空输入框并收起搜索结果框
      $(document).on('keydown', function (e) {
        if (e.keyCode == 27) {
          $searchInput[0].value = '';
          $searchResult.hide();
        }
      });
    } else {
      $searchResult.html('<div class="empty">没有找到关键词 <b>' + val + '</b> 的搜索结果</div>')
    }
  }, 300));

  $searchResult.on('click', function(e){
    return false;
  })

  $(document).on('click', function(e){
    $searchResult.hide();
  })


})