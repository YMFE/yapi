import React, { Component } from 'react'
import { Button, message, Alert } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'
import AceEditor from 'client/components/AceEditor/AceEditor'
import { updateInterfaceData } from '../../../../reducer/modules/interface.js'

@connect(
  state => {
    return {
      data: state.inter.curdata,
    }
  },
  {
    updateInterfaceData,
  },
)
export default class Script extends Component {
  constructor(props) {
    super(props)
    const { data } = this.props
    const { pre_script = '', after_script, _id } = data
    this.state = {
      id: _id,
      pre_script,
      after_script,
    }
  }

  onSave = async () => {
    const { pre_script, after_script, id } = this.state
    const params = {
      id,
      pre_script,
      after_script,
    }
    let result = await axios.post('/api/interface/up', params)
    if (result.data.errcode === 0) {
      this.props.updateInterfaceData(params)
      message.success('保存成功')
    } else {
      message.error(result.data.errmsg)
    }
  }

  render() {
    let { pre_script, after_script } = this.state
    return (
      <div
        style={{
          padding: '20px',
        }}
      >
        <Alert
          message="优先级：当前脚本将覆盖项目层级配置的脚本"
          type="info"
          showIcon
          style={{
            marginBottom: '20px',
          }}
        />
        <p>Pre-script：Request 的处理脚本</p>
        <AceEditor
          style={{
            minHeight: '300px',
            margin: '10px 10px 20px',
            width: '80%',
          }}
          data={pre_script}
          onChange={editor => this.setState({ pre_script: editor.text })}
          fullScreen={true}
        />
        <p>After-script：Response 的处理脚本</p>

        <AceEditor
          style={{
            minHeight: '300px',
            margin: '10px 10px 20px',
            width: '80%',
          }}
          data={after_script}
          onChange={editor => this.setState({ after_script: editor.text })}
          fullScreen={true}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button type="primary" onClick={() => this.onSave()}>
            保存
          </Button>
        </div>
      </div>
    )
  }
}
