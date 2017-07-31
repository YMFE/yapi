import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import wangEditor from 'wangeditor'
import { Card } from 'antd'
import { getResParams } from '../../../actions/addInterface.js'

//const editor = new wangEditor('#res-cover')



@connect(
  state => {
    return {
      resParams: state.addInterface.resParams
    }
  },
  {
    getResParams
  }
)

class ResParams extends Component {
  static propTypes = {
    resParams: PropTypes.string,
    getResParams: PropTypes.func
  }

  constructor(props) {
    super(props)
    console.log(props)
  }

  // initResParams () {
  //   const { resParams } = this.props
  //   if (resParams) {
  //     editor.txt.html(resParams)
  //   }
  // }

  componentDidMount() {
    //const reg = /(<p>)|(<\/p>)|&nbsp;|(<br>)|\s+|<div>|<\/div>/g
    //editor.customConfig.menus = []
    // editor.customConfig.onchange = html => {
    //   html = html.replace(reg, '')
    //   this.props.getResParams(html)
    // }
    // setTimeout(() => {
    //   this.initResParams()
    // }, 400)
    //editor.create()

    function json_parse(json) {
      try {
        return JSON.stringify(JSON.parse(json), null, "\t");
      } catch (e) {
        return json
      }
    }
    var langTools = window.ace.require("ace/ext/language_tools");
    let editor = this.editor = window.ace.edit("res-cover")
    editor.getSession().setMode("ace/mode/json");
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });

    var rhymeCompleter = {
      identifierRegexps: [/[@]/],
      getCompletions: function (editor, session, pos, prefix, callback) {
        console.log(prefix)
        if (prefix.length === 0) { callback(null, []); return }
        var wordList = [
          { name: '字符串', mock: '@string' },
          { name: '自然数', mock: '@natural' },          
          { name: '布尔', mock: '@boolean' },
          { name: '标题', mock: '@title' },
          { name: '姓名', mock: '@name' },
          { name: 'url', mock: '@url' },
          { name: '域名', mock: '@domain' },
          { name: 'ip地址', mock: '@ip' },
          { name: 'id', mock: '@id' },
          { name: 'guid', mock: '@guid' },
          { name: '当前时间', mock: '@now' },
          { name: '整数', mock: '@integer' },
          { name: '浮点数', mock: '@float' },
          { name: 'email', mock: '@email' },
          { name: '大段文本', mock: '@text' },
          { name: '句子', mock: '@sentence' },
          { name: '单词', mock: '@word' },
          { name: '地址', mock: '@region' }
        ]
        callback(null, wordList.map(function (ea) {
          return { name: ea.mock, value: ea.mock, score: ea.mock, meta: ea.name }
        }));
      }
    }
    langTools.addCompleter(rhymeCompleter);
    editor.getSession().on('change', () => {
      this.props.getResParams(editor.getValue())
    });
    setTimeout(() => {
      editor.setValue(json_parse(this.props.resParams))
    }, 400)
  }

  render() {
    return (
      <section className="res-params-box">
        <Card title="返回 Mock" style={{ width: 500 }}>
          <div id="res-cover"></div>
        </Card>
      </section>
    )
  }
}

export default ResParams
