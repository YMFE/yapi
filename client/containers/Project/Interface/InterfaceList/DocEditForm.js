import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { nameLengthLimit } from '../../../../common.js'
import { Affix } from 'antd'
import Editor from 'client/components/Editor/Editor'
import { Form, Input, Button } from 'antd'
let EditFormContext
const FormItem = Form.Item

@connect(state => {
  return {
    custom_field: state.group.field,
    projectMsg: state.project.currProject,
  }
}, {})
class DocEditForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    curdata: PropTypes.object,
    onSubmit: PropTypes.func,
    cat: PropTypes.array,
    projectMsg: PropTypes.object,
  }

  constructor(props) {
    super(props)
    const { curdata } = this.props
    const { desc, markdown, title } = curdata
    this.state = {
      title,
      desc,
      markdown,
      submitStatus: false,
    }
    this.editorRef = React.createRef()
  }

  formSubmit = e => {
    e.preventDefault()
    this.setState({
      submitStatus: true,
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.desc = this.editor.getHtml()
        values.markdown = this.editor.getMarkdown()
        this.props.onSubmit(values)
      } else {
        this.setState({
          submitStatus: false,
        })
      }
    })
  }

  componentDidMount() {
    this.editor = this.editorRef.current.getInstance()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { title, desc, markdown } = this.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
    }

    return (
      <div>
        <Form>
          <h2 className="interface-title" style={{ marginTop: 0 }}>
            文档信息
          </h2>
          <div className="panel-sub">
            <FormItem
              className="interface-edit-item"
              {...formItemLayout}
              label="文档名称"
            >
              {getFieldDecorator('title', {
                initialValue: title,
                rules: nameLengthLimit('文档'),
              })(<Input id="title" placeholder="文档名称" />)}
            </FormItem>
          </div>
          <Editor initialValue={markdown || desc} ref={this.editorRef} />
          <FormItem
            className="interface-edit-item"
            style={{ textAlign: 'center', marginTop: '16px' }}
          >
            <Affix offsetBottom={0}>
              <Button
                className="interface-edit-submit-button"
                disabled={this.state.submitStatus}
                size="large"
                onClick={this.formSubmit}
              >
                保存
              </Button>
            </Affix>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create({
  // onValuesChange() {
  //   EditFormContext.props.changeEditStatus(true)
  // },
})(DocEditForm)
