import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
//import wangEditor from 'wangeditor'
import { Tabs } from 'antd'
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
  }

  // initResParams () {
  //   const { resParams } = this.props
  //   if (resParams) {
  //     editor.txt.html(resParams)
  //   }
  // }

  componentDidMount () {
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

    function json_parse(json){
      try{
        return JSON.stringify(JSON.parse(json), null, "\t");
      }catch(e){
        return json
      }
    }

    let editor2 = this.editor = window.ace.edit("res-cover")
    editor2.getSession().setMode("ace/mode/json");
    editor2.getSession().on('change', ()=> {
      this.props.getResParams(editor2.getValue())
    });
    setTimeout( () => {
      editor2.setValue(json_parse(this.props.resParams))
    } ,400)
  }

  render () {
    const TabPane = Tabs.TabPane
    return (
      <section className="res-params-box">
        <Tabs defaultActiveKey="1">
          <TabPane tab="返回参数" key="1">
            <div id="res-cover"></div>
          </TabPane>
        </Tabs>
      </section>
    )
  }
}

export default ResParams
