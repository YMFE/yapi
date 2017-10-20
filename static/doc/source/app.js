$(document).ready(function() {
    // 移动端导航
    var $openPanel = $('.open-panel');
    var $contentLeft = $('.content-left');
    var $contentLeftWidth = $contentLeft.width() - 1;
    var $ydoc = $('.ydoc');
    var $mask = $('.mask');
    var $versionSelector = $('.version-selector');
    var $versionMask = $('.m-version-mask');
    var isPanelHide = true;
    var h2 = $('.content-right').find('h2');
    var h3 = $('.content-right').find('h3');
    var a = $('.content-left').find('a');
    var lis = $contentLeft.find('li');
    var titles = [];
    var menus = [];
    $ydoc.addClass('hidden');
    if (isWechat() && $contentLeft[0]) {
        $ydoc.addClass('off-webkit-scroll');
    }
    for (var i = 0; i < a.length; i++) {
        menus.push({
            name: $(a[i]).attr('href').split('#')[1],
            offsetTop: $(a[i]).offset().top - 77,
            parent: $(a[i]).parent()
        })
    }
    for (var i = 0; i < h2.length; i++) {
        titles.push({
            name: h2[i].id,
            jq: $(h2[i]),
            offsetTop: $(h2[i]).offset().top
        })
    }
    for (var i = 0; i < h3.length; i++) {
        titles.push({
            name: h3[i].id,
            jq: $(h3[i]),
            offsetTop: $(h3[i]).offset().top
        })
    }
    titles.sort(sortAsOffset('offsetTop'));

    $openPanel.on('click', function() {
        if (isPanelHide) { // 点击弹出panel
            isPanelHide = false;
            $ydoc.addClass('hidden');
            $mask.show();
            setTimeout(function() {
                $mask.addClass('show');
            }, 50)
            $openPanel.css({
                'transform': 'translateX(-' + $contentLeftWidth + 'px)'
            })
            $contentLeft.css({
                'transform': 'translateX(-' + $contentLeftWidth + 'px)'
            })
        } else { // 点击隐藏panel
            isPanelHide = true;
            $ydoc.removeClass('hidden');
            $mask.removeClass('show');
            setTimeout(function() {
                $mask.hide();
            }, 400)
            $openPanel.css({
                'transform': 'translateX(0px)'
            })
            $contentLeft.css({
                'transform': 'translateX(0px)'
            })
        }
        var scrollTop = $ydoc.scrollTop();
        // 遍历主页面的标题，找到当前窗口顶部的标题
        for (var i = 0; i < titles.length; i++) {
            if (titles[i].offsetTop > scrollTop) {
                // 遍历侧栏，找到对应的标题
                for (var j in menus) {
                    if (menus[j].name == titles[i].name) {
                        lis.removeClass('active');
                        menus[j].parent.addClass('active');
                        $('.docs-sidenav').scrollTop(menus[j].offsetTop);
                        return;
                    }
                }
                return;
            }
        }
    });

    $ydoc.removeClass('hidden');
    $ydoc.on('scroll', function() {
        sessionStorage.setItem('offsetTop', $ydoc.scrollTop());
    })
    // 待元素获获取offsetTop值之后再设置ydoc的offsetTop
    if (sessionStorage.offsetTop) {
        $ydoc.scrollTop(sessionStorage.offsetTop);
    }
    // $openPanel.trigger('click');
    $mask.on('click', function() {
        if (!isPanelHide) {
            $openPanel.click();
        }
    });

    // PC端导航
    $('.navbar-toggle').click(function() {
        $(this).next(".ydoc-nav").toggle();
    });

    $('.docs-sidenav li').click(function(e) {
        $('.docs-sidenav li').removeClass('active');
        $(this).addClass('active');
        if (!isPanelHide) {
            $openPanel.trigger('click');
        }
    });
    $ydoc.click(function(e) {
        if ($(e.target).data('target') !== 'version') {
            $versionMask.hide();
        }
    })
    $versionSelector.click(function(e) {
        $versionMask.show();
    });

    $('.markdown-body pre').map(function(i, item) {
        $(item).addClass('ydoc-example').append('<div class="ui-copy js-copy" data-clipboard-action="copy" data-clipboard-target=".js-code-' + i + '" data-copy-number="' + i + '">copy</div><div class="copy-tip copy-tip-' + i + '">已复制</div>');
        $(item).children('code').addClass('js-code-'+i);
    });

    // var winHeight = $(window).height() - 44,
        // sidebar = $('.docs-sidebar');

    // var docSideNav = $('.docs-sidenav');
    // if (winWidth > 767) {
    //     docSideNav.width($contentLeftWidth);
    // }

    // if (sidebar.height() > winHeight) {
    //     sidebar.css('max-height', winHeight + 'px');
    //     $('.docs-sidenav').css('max-height', winHeight + 'px');
    //     if (winWidth < 768) {
    //         $('.docs-sidenav').css({
    //             'overflow-x': 'hidden'
    //         });
    //     }
    //     var activeMenu,
    //         barScroll = false;
    //
    //     sidebar.on('mouseover', function() {
    //         barScroll = true;
    //     });
    //     sidebar.on('mouseout', function() {
    //         barScroll = false;
    //     });
    // };

    // $(window).on('scroll', function(e) {
    //     if ($(this).scrollTop() > ($('.footer').offset().top - $(window).height())) {
    //         winHeight = $(window).height() - $('.footer').outerHeight() - 44;
    //         sidebar.css('max-height', winHeight + 'px');
    //         $('.docs-sidenav').css('max-height', winHeight + 'px');
    //     } else {
    //         winHeight = $(window).height() - 44;
    //         sidebar.css('max-height', winHeight + 'px');
    //         $('.docs-sidenav').css('max-height', winHeight + 'px');
    //     }
    //
    //     if (!barScroll) {
    //         var activeItem = $('.docs-sidebar li.active a');
    //         if (activeItem.length) {
    //             if (!activeMenu || (activeMenu.attr('href') != activeItem.attr('href'))) {
    //                 activeMenu = activeItem;
    //                 var top = activeMenu.offset().top - sidebar.offset().top;
    //                 if (top < 0) {
    //                     //sidebar.scrollTop(sidebar.scrollTop() + top);
    //                     $('.docs-sidenav').scrollTop($('.docs-sidenav').scrollTop() + top);
    //                 } else if (top > winHeight - 88) {
    //                     //sidebar.scrollTop(sidebar.scrollTop() + top - winHeight + 44);
    //                     $('.docs-sidenav').scrollTop($('.docs-sidenav').scrollTop() + top - winHeight + 88);
    //                 }
    //             }
    //         }
    //     }
    // });

    // 退出全屏浏览器窗口大小改变，不触发resize
    $(window).on('resize', function(e) {
        $contentLeftWidth = $contentLeft.width() - 1;
    });

    function sortAsOffset(propertyName) {
        return function(obj1, obj2) {
            var val1 = obj1[propertyName];
            var val2 = obj2[propertyName];
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    function isWechat() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    // 代码复制功能
    var clipboard = new Clipboard('.js-copy');

    clipboard.on('success', function(e) {
      var copyNumber = $(e.trigger).attr('data-copy-number');
      $('.copy-tip-'+copyNumber).show();
      setTimeout(function() {
          $('.copy-tip-'+copyNumber).hide();
      }, 1000);
      e.clearSelection();
    });

});
