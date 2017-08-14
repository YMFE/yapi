var ace = require('brace'),
  Mock = require('mockjs')
require('brace/mode/javascript');
require('brace/theme/xcode');
require("brace/ext/language_tools.js");
var json5 = require('json5');

var langTools = ace.acequire("ace/ext/language_tools"),
  editor,
  mockEditor,
  rhymeCompleter,
  wordList = [
    { name: '字符串', mock: '@string' },
    { name: '自然数', mock: '@natural' },
    { name: '浮点数', mock: '@float' },
    { name: '字符', mock: '@character' },
    { name: '布尔', mock: '@boolean' },
    { name: 'url', mock: '@url' },
    { name: '域名', mock: '@domain' },
    { name: 'ip地址', mock: '@ip' },
    { name: 'id', mock: '@id' },
    { name: 'guid', mock: '@guid' },
    { name: '当前时间', mock: '@now' },
    { name: '日期', mock: '@date' },
    { name: '时间', mock: '@time' },
    { name: '日期时间', mock: '@datetime' },
    { name: '图片连接', mock: '@image' },
    { name: '图片data', mock: "@imageData" },
    { name: '颜色', mock: '@color' },
    { name: '颜色hex', mock: '@hex' },
    { name: '颜色rgba', mock: '@rgba' },
    { name: '颜色rgb', mock: '@rgb' },
    { name: '颜色hsl', mock: '@hsl' },
    { name: '整数', mock: '@integer' },
    { name: '浮点数', mock: '@float' },
    { name: 'email', mock: '@email' },
    { name: '大段文本', mock: '@paragraph' },
    { name: '句子', mock: '@sentence' },
    { name: '单词', mock: '@word' },
    { name: '大段中文文本', mock: '@cparagraph' },
    { name: '中文标题', mock: '@ctitle' },
    { name: '标题', mock: '@title' },
    { name: '姓名', mock: '@name' },
    { name: '中文姓名', mock: '@cname' },
    { name: '中文姓', mock: '@cfirst' },
    { name: '中文名', mock: '@clast' },
    { name: '英文姓', mock: '@first' },
    { name: '英文名', mock: '@last' },
    { name: '中文句子', mock: '@csentence' },
    { name: '中文词组', mock: '@cword' },
    { name: '地址', mock: '@region' },
    { name: '省份', mock: '@province' },
    { name: '城市', mock: '@city' },
    { name: '地区', mock: '@county' },
    { name: '转换为大写', mock: '@upper' },
    { name: '转换为小写', mock: '@lower' },
    { name: '挑选（枚举）', mock: '@pick' },
    { name: '打乱数组', mock: '@shuffle' },
    { name: '协议', mock: '@protocol' }
  ];

function run(options) {
  options = options || {};
  var container, data;
  container = options.container || 'mock-editor';
  if (options.wordList && typeof options.wordList === 'object' && options.wordList.name && options.wordList.mock) {
    wordList.push(options.wordList);
  }
  data = options.data || '';

  editor = ace.edit(container)
  editor.$blockScrolling = Infinity;
  editor.getSession().setMode('ace/mode/javascript');
  editor.setTheme('ace/theme/xcode');
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: false,
    enableLiveAutocompletion: true,
    useWorker: false
  });
  mockEditor = {
    curData: {},
    getValue: editor.getValue,
    setValue: function (data) {
      data = data || '';
      if (typeof data === 'string') {
        editor.setValue(data);
      } else if (typeof data === 'object') {
        editor.setValue(json5.stringify(data, null, "  "))
      }
    },
    editor: editor
  }
  rhymeCompleter = {
    identifierRegexps: [/[@]/],
    getCompletions: function (editor, session, pos, prefix, callback) {
      if (prefix.length === 0) { callback(null, []); return }
      callback(null, wordList.map(function (ea) {
        return { name: ea.mock, value: ea.mock, score: ea.mock, meta: ea.name }
      }));
    }
  }

  langTools.addCompleter(rhymeCompleter);
  mockEditor.setValue(data);
  handleJson(editor.getValue())

  editor.clearSelection();

  editor.getSession().on('change', () => {
    handleJson(editor.getValue())
    if (typeof options.onChange === 'function') {
      options.onChange.call(mockEditor, mockEditor.curData);
    }

  });

  return mockEditor;
}



function handleJson(json) {
  var curData = mockEditor.curData;
  try {
    var obj = json5.parse(json);
    curData.text = json;
    curData.format = true;
    curData.jsonData = obj;
    curData.mockData = Mock.mock(obj);
  } catch (e) {
    curData.format = e.message;
  }
}


module.exports = run;