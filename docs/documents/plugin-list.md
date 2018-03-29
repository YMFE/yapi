## 怎么分享我的插件？
Fork github.com/ymfe/yapi ，编辑根目录下的 plugin.json 文件， 然后 Pull-Request 到 ymfe/yapi

## 插件列表
<ul id="list">

</ul>

<script>
window.onload = function(){
  var list = [{
    title: 'yapi-plugin-qsso',
    url: 'https://github.com/ymfe/yapi-plugin-qsso',
    desc: 'qunar 专用 sso 第三方登录'
  }];
  var el = $('#list');
  list.forEach(function(item){
    el.append("<li>" + '<a target="_black" href=' + item.url + ">" + item.title + "</a>" + "&nbsp;" + item.desc + "</li>")
  })
}
</script>