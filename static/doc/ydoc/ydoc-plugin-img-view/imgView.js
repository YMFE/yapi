var $markdownBody = $('#markdown-body');
var $maskImg = $('.js-mask-img');
var $mask = $('.js-mask');

// 点击 markdown 中的图片
if ($markdownBody.length) {
  $markdownBody[0].addEventListener('click', function (e) {
    var target = e.target;
    if (target.tagName.toLocaleLowerCase() === 'img') {
      var src = target.attributes.src.value;
      if ($maskImg) {
        $maskImg[0].setAttribute('src', src);
        $mask.show();
        setTimeout(function () {
          $mask[0].classList.add('active');
        }, 0);
      }
    }
  });
}

// 点击遮罩中的图片
$mask[0].addEventListener('click', function(e) {
  if (e.target.className.indexOf('js-mask-img') == -1 && e.target.className.indexOf('container') == -1) {
    $mask[0].classList.remove('active');
    setTimeout(() => {
      $mask.hide();
      $maskImg[0].setAttribute('src', '');
    }, 400);
  }
})