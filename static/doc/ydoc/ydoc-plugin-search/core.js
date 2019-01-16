$(function() {
  var num = 0;
  var searchText;
  var searchMaxNum = 8;
  var releativePath = document.getElementById('releativePath').getAttribute('content') || ''
  releativePath = releativePath.trim()
  releativePath = releativePath === '' ? '.' : releativePath

  window.ydoc_plugin_search_core = function(text) {
    if(!text)return;
    var json = cloneObject(window.ydoc_plugin_search_json);    
    searchText = text;
    num = 0;
    var result = search(json)
    return result;
  };

  function cloneObject(obj) {
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        var newArr = [];
        obj.forEach(function(item, index){
          newArr[index] = cloneObject(item)
        })
        return newArr;
      } else {
        var newObj = {};
        for (var key in obj) {
          newObj[key] = cloneObject(obj[key]);
        }
        return newObj;
      }
    } else {
      return obj;
    }
  }


  function search(json){
    var result = {}
    for(var i in json){
      var data = searchBook(json[i])
      data = filterBook(data);
      if(data.length > 0) result[i] = data;
    }
    return result;
  }

  function filterBook(newPages){
    return newPages.filter(function(page){
      if(!page.content && page.children.length === 0){
        return false;
      }
      return true;
    })
  }

  function searchBook(pages){
    var newPages = [];
    if(num > searchMaxNum){
      return newPages;
    }
    for(var i=0, l=pages.length; i< l; i++){
      var page = pages[i], searchPage = null;
      if(num > searchMaxNum){
        return newPages;
      }
      if(page.content && page.content.toLowerCase().indexOf(searchText.toLowerCase()) !== -1){
        num++;
        searchPage = {
          title: page.title,
          content: page.content,
          url: releativePath + page.url,
          children: []
        };
      }else{
        searchPage = {
          title: page.title,
          url: releativePath + page.url,
          children: []
        };
      }

      newPages.push(searchPage)

      if(page.children && Array.isArray(page.children)){
        for(var j=0, len=page.children.length; j< len; j++){
          var child = page.children[j];
          if(num >= searchMaxNum ){
            return newPages;
          }
          if(child.content && child.content.toLowerCase().indexOf(searchText.toLowerCase()) !== -1){
            child.url = releativePath + child.url;
            searchPage.children.push(child)
            num++;          
          }
        }
      }
    }    
    return newPages;
  }


});
