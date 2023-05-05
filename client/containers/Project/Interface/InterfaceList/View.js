import './View.scss'
import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Table,
  Icon,
  Row,
  Col,
  Tooltip,
  message,
  Spin,
  Modal,
  Button,
  Select,
} from 'antd'
import { Link } from 'react-router-dom'
import AceEditor from 'client/components/AceEditor/AceEditor'
import { formatTime, safeArray } from '../../../../common.js'
//import ErrMsg from '../../../../components/ErrMsg/ErrMsg.js';
import Viewer from 'client/components/Editor/View'
import variable from '../../../../constants/variable'
import constants from '../../../../constants/variable.js'
import copy from 'copy-to-clipboard'
import SchemaTable from '../../../../components/SchemaTable/SchemaTable.js'

import {
  quicktype,
  InputData,
  JSONSchemaInput,
  JSONSchemaStore,
} from 'quicktype-core'

const { Option } = Select
const HTTP_METHOD = constants.HTTP_METHOD

async function quicktypeJSONSchema(targetLanguage, typeName, jsonSchemaString) {
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore())
  await schemaInput.addSource({ name: typeName, schema: jsonSchemaString })
  const inputData = new InputData()
  inputData.addInput(schemaInput)

  let res = await quicktype({
    inputData,
    lang: targetLanguage,
    rendererOptions: {
      'just-types': 'true',
      'class-prefix': '',
    },
  })
  return res
}

async function converJsonSchema(schema, lang) {
  const { lines: swiftPerson } = await quicktypeJSONSchema(
    lang,
    'WeaponsModel',
    schema,
  )
  return swiftPerson.join('\n')
}

@connect(state => {
  return {
    curData: state.inter.curdata,
    custom_field: state.group.field,
    currProject: state.project.currProject,
  }
})
class View extends Component {
  constructor(props) {
    super(props)
    this.state = {
      init: true,
      enter: false,
      convertVisible: false,
      curLanguage: 'typescript',
      jsonModelStr: '',
      langList: ['TypeScript', 'JAVA', 'Kotlin', 'Objective-C', 'Swift', 'Go'],
    }
    this.viewerRef = React.createRef()
  }
  static propTypes = {
    curData: PropTypes.object,
    currProject: PropTypes.object,
    custom_field: PropTypes.object,
  }

  req_body_form(req_body_type, req_body_form) {
    if (req_body_type === 'form') {
      const columns = [
        {
          title: '参数名称',
          dataIndex: 'name',
          key: 'name',
          width: 140,
        },
        {
          title: '参数类型',
          dataIndex: 'type',
          key: 'type',
          width: 100,
          render: text => {
            text = text || ''
            return text.toLowerCase() === 'text' ? (
              <span>
                <i className="query-icon text">T</i>文本
              </span>
            ) : (
              <span>
                <Icon type="file" className="query-icon" />
                文件
              </span>
            )
          },
        },
        {
          title: '是否必须',
          dataIndex: 'required',
          key: 'required',
          width: 100,
        },
        {
          title: '示例',
          dataIndex: 'example',
          key: 'example',
          width: 80,
          render(_, item) {
            return <p style={{ whiteSpace: 'pre-wrap' }}>{item.example}</p>
          },
        },
        {
          title: '备注',
          dataIndex: 'value',
          key: 'value',
          render(_, item) {
            return <p style={{ whiteSpace: 'pre-wrap' }}>{item.value}</p>
          },
        },
      ]

      const dataSource = []
      if (req_body_form && req_body_form.length) {
        req_body_form.map((item, i) => {
          dataSource.push({
            key: i,
            name: item.name,
            value: item.desc,
            example: item.example,
            required: item.required == 0 ? '否' : '是',
            type: item.type,
          })
        })
      }

      return (
        <div
          style={{ display: dataSource.length ? '' : 'none' }}
          className="colBody"
        >
          <Table
            bordered
            size="small"
            pagination={false}
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      )
    }
  }
  res_body(res_body_type, res_body, res_body_is_json_schema) {
    if (res_body_type === 'json') {
      if (res_body_is_json_schema) {
        return <SchemaTable dataSource={res_body} />
      } else {
        return (
          <div className="colBody">
            {/* <div id="vres_body_json" style={{ minHeight: h * 16 + 100 }}></div> */}
            <AceEditor
              data={res_body}
              readOnly={true}
              style={{ minHeight: 600 }}
            />
          </div>
        )
      }
    } else if (res_body_type === 'raw') {
      return (
        <div className="colBody">
          <AceEditor
            data={res_body}
            readOnly={true}
            mode="text"
            style={{ minHeight: 300 }}
          />
        </div>
      )
    }
  }

  req_body(req_body_type, req_body_other, req_body_is_json_schema) {
    if (req_body_other) {
      if (req_body_is_json_schema && req_body_type === 'json') {
        return <SchemaTable dataSource={req_body_other} />
      } else {
        return (
          <div className="colBody">
            <AceEditor
              data={req_body_other}
              readOnly={true}
              style={{ minHeight: 300 }}
              mode={req_body_type === 'json' ? 'javascript' : 'text'}
            />
          </div>
        )
      }
    }
  }

  onLanguageChange = val => {
    this.setState(
      {
        curLanguage: val,
      },
      () => {
        this.convertJsonSchema()
      },
    )
  }

  req_query(query) {
    const columns = [
      {
        title: '参数名称',
        dataIndex: 'name',
        width: 140,
        key: 'name',
      },
      {
        title: '是否必须',
        width: 100,
        dataIndex: 'required',
        key: 'required',
      },
      {
        title: '示例',
        dataIndex: 'example',
        key: 'example',
        width: 80,
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.example}</p>
        },
      },
      {
        title: '备注',
        dataIndex: 'value',
        key: 'value',
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.value}</p>
        },
      },
    ]

    const dataSource = []
    if (query && query.length) {
      query.map((item, i) => {
        dataSource.push({
          key: i,
          name: item.name,
          value: item.desc,
          example: item.example,
          required: item.required == 0 ? '否' : '是',
        })
      })
    }

    return (
      <Table
        bordered
        size="small"
        pagination={false}
        columns={columns}
        dataSource={dataSource}
      />
    )
  }

  countEnter(str) {
    let i = 0
    let c = 0
    if (!str || !str.indexOf) {
      return 0
    }
    while (str.indexOf('\n', i) > -1) {
      i = str.indexOf('\n', i) + 2
      c++
    }
    return c
  }

  componentDidMount() {
    if (!this.props.curData.title && this.state.init) {
      this.setState({ init: false })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!this.vRef && this.viewerRef.current) {
      this.vRef = this.viewerRef.current.getInstance()
    }
    if (this.props.curData._id !== prevProps.curData._id && this.vRef) {
      this.vRef.setMarkdown(this.props.curData.markdown)
    }
  }

  convertJsonSchema = async () => {
    const str = this.props.curData.res_body
    if (!str) return
    const { curLanguage } = this.state
    const jsonModelStr = await converJsonSchema(str, curLanguage)
    this.setState({
      jsonModelStr,
    })
  }

  componentWillUnmount() {
    this.setState({ init: true })
  }

  showConvertModal() {
    this.setState({
      convertVisible: true,
    })
    this.convertJsonSchema()
  }
  hideConvertModal() {
    this.setState({
      convertVisible: false,
    })
  }

  enterItem = () => {
    this.setState({
      enter: true,
    })
  }

  leaveItem = () => {
    this.setState({
      enter: false,
    })
  }

  copyUrl = url => {
    copy(url)
    message.success('已经成功复制到剪切板')
  }

  flagMsg = (mock, strice) => {
    if (mock && strice) {
      return <span>( 全局mock & 严格模式 )</span>
    } else if (!mock && strice) {
      return <span>( 严格模式 )</span>
    } else if (mock && !strice) {
      return <span>( 全局mock )</span>
    } else {
      return
    }
  }

  render() {
    const dataSource = []
    if (
      this.props.curData.req_headers &&
      this.props.curData.req_headers.length
    ) {
      this.props.curData.req_headers.map((item, i) => {
        dataSource.push({
          key: i,
          name: item.name,
          required: item.required == 0 ? '否' : '是',
          value: item.value,
          example: item.example,
          desc: item.desc,
        })
      })
    }

    const req_dataSource = []
    if (this.props.curData.req_params && this.props.curData.req_params.length) {
      this.props.curData.req_params.map((item, i) => {
        req_dataSource.push({
          key: i,
          name: item.name,
          desc: item.desc,
          example: item.example,
        })
      })
    }
    const req_params_columns = [
      {
        title: '参数名称',
        dataIndex: 'name',
        key: 'name',
        width: 140,
      },
      {
        title: '示例',
        dataIndex: 'example',
        key: 'example',
        width: 80,
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.example}</p>
        },
      },
      {
        title: '备注',
        dataIndex: 'desc',
        key: 'desc',
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.desc}</p>
        },
      },
    ]

    const columns = [
      {
        title: '参数名称',
        dataIndex: 'name',
        key: 'name',
        width: '200px',
      },
      {
        title: '参数值',
        dataIndex: 'value',
        key: 'value',
        width: '300px',
      },
      {
        title: '是否必须',
        dataIndex: 'required',
        key: 'required',
        width: '100px',
      },
      {
        title: '示例',
        dataIndex: 'example',
        key: 'example',
        width: '80px',
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.example}</p>
        },
      },
      {
        title: '备注',
        dataIndex: 'desc',
        key: 'desc',
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.desc}</p>
        },
      },
    ]
    let status = {
      undone: '未完成',
      done: '已完成',
    }

    let bodyShow =
      this.props.curData.req_body_other ||
      (this.props.curData.req_body_type === 'form' &&
        this.props.curData.req_body_form &&
        this.props.curData.req_body_form.length)

    let requestShow =
      (dataSource && dataSource.length) ||
      (req_dataSource && req_dataSource.length) ||
      (this.props.curData.req_query && this.props.curData.req_query.length) ||
      bodyShow

    let methodColor =
      variable.METHOD_COLOR[
        this.props.curData.method
          ? this.props.curData.method.toLowerCase()
          : 'get'
      ]
    if (!methodColor) {
      methodColor = 'get'
    }

    const { convertVisible, curLanguage, langList } = this.state
    const {
      res_body_type,
      tag,
      up_time,
      title,
      uid,
      username,
      path,
    } = this.props.curData
    const { _id, basepath } = this.props.currProject
    const location = window.location
    const mockUlr = `${location.origin}/mock/${_id}${basepath}${path}`
    let res = (
      <div className="caseContainer">
        <h2 className="interface-title" style={{ marginTop: 0 }}>
          基本信息
        </h2>
        <div className="panel-view">
          <Row className="row">
            <Col span={4} className="colKey">
              接口名称：
            </Col>
            <Col span={8} className="colName">
              {title}
            </Col>
            <Col span={4} className="colKey">
              创&ensp;建&ensp;人：
            </Col>
            <Col span={8} className="colValue">
              <Link className="user-name" to={'/user/profile/' + uid}>
                <img src={'/api/user/avatar?uid=' + uid} className="user-img" />
                {username}
              </Link>
            </Col>
          </Row>
          <Row className="row">
            <Col span={4} className="colKey">
              状&emsp;&emsp;态：
            </Col>
            <Col span={8} className={'tag-status ' + this.props.curData.status}>
              {status[this.props.curData.status]}
            </Col>
            <Col span={4} className="colKey">
              更新时间：
            </Col>
            <Col span={8}>{formatTime(up_time)}</Col>
          </Row>
          {safeArray(tag) && safeArray(tag).length > 0 && (
            <Row className="row remark">
              <Col span={4} className="colKey">
                Tag ：
              </Col>
              <Col span={18} className="colValue">
                {tag.join(' , ')}
              </Col>
            </Row>
          )}
          <Row className="row">
            {this.props.curData.interface_type === 'http' ? (
              <div>
                <Col span={4} className="colKey">
                  接口路径：
                </Col>
                <Col
                  span={8}
                  className="colValue"
                  onMouseEnter={this.enterItem}
                  onMouseLeave={this.leaveItem}
                >
                  <span
                    style={{
                      color: methodColor.color,
                      backgroundColor: methodColor.bac,
                    }}
                    className="colValue tag-method"
                  >
                    {this.props.curData.method}
                  </span>
                  <span className="colValue">
                    {this.props.currProject.basepath}
                    {this.props.curData.path}
                  </span>
                  <Tooltip title="复制路径">
                    <Icon
                      type="copy"
                      className="interface-url-icon"
                      onClick={() => this.copyUrl(this.props.curData.path)}
                      style={{
                        display: this.state.enter ? 'inline-block' : 'none',
                      }}
                    />
                  </Tooltip>
                </Col>
              </div>
            ) : (
              ''
            )}
            {this.props.curData.interface_type === 'dubbo' ? (
              <div>
                <Col span={4} className="colKey">
                  接口路径：
                </Col>
                <Col span={8} className="colValue ">
                  <Tooltip
                    placement="topLeft"
                    title={`${this.props.curData.r_facade}`}
                    overlayClassName="alert-tooltip-div"
                  >
                    <span
                      className="colValue superLength"
                      style={{
                        overflowWrap: 'break-word',
                        wordBreak: 'break-all',
                      }}
                    >
                      {`${this.props.curData.r_facade}`}
                    </span>
                  </Tooltip>
                </Col>

                <Col span={4} className="colKey">
                  方法：
                </Col>
                <Col span={8} className="colValue">
                  <span className="colValue">
                    {`${this.props.curData.r_method}`}
                  </span>
                </Col>
              </div>
            ) : (
              ''
            )}
          </Row>

          <Row className="row">
            <Col span={4} className="colKey">
              接口类型：
            </Col>
            <Col span={8}>
              <span>{this.props.curData.interface_type}</span>
            </Col>
            {this.props.curData.interface_type === 'http' ? (
              <div>
                <Col span={4} className="colKey">
                  Mock地址：
                </Col>
                <Col span={8} className="colValue">
                  {this.flagMsg(
                    this.props.currProject.is_mock_open,
                    this.props.currProject.strice,
                  )}
                  <a target="_blank" href={mockUlr}>
                    {mockUlr}
                  </a>

                  <Tooltip title="复制 Mock 地址">
                    <Icon
                      type="copy"
                      className="interface-url-icon"
                      onClick={() => this.copyUrl(mockUlr)}
                    />
                  </Tooltip>
                </Col>
              </div>
            ) : (
              ''
            )}
          </Row>
          {res_body_type === 'json' ? (
            <Row className="row">
              <Col span={4} className="colKey">
                JSON Model：
              </Col>
              <Col span={8}>
                <Button size="small" onClick={() => this.showConvertModal()}>
                  查看
                </Button>
              </Col>
            </Row>
          ) : null}

          {this.props.curData.custom_field_value &&
            this.props.custom_field.enable && (
              <Row className="row remark">
                <Col span={4} className="colKey">
                  {this.props.custom_field.name}：
                </Col>
                <Col span={18} className="colValue">
                  {this.props.curData.custom_field_value}
                </Col>
              </Row>
            )}
        </div>
        <h2 className="interface-title">备注</h2>
        <Viewer
          initialValue={this.props.curData.markdown || ''}
          ref={this.viewerRef}
        />
        <h2
          className="interface-title"
          style={{ display: requestShow ? '' : 'none' }}
        >
          请求参数
        </h2>
        {req_dataSource.length ? (
          <div className="colHeader">
            <h3 className="col-title">路径参数：</h3>
            <Table
              bordered
              size="small"
              pagination={false}
              columns={req_params_columns}
              dataSource={req_dataSource}
            />
          </div>
        ) : (
          ''
        )}
        {dataSource.length ? (
          <div className="colHeader">
            <h3 className="col-title">Headers：</h3>
            <Table
              bordered
              size="small"
              pagination={false}
              columns={columns}
              dataSource={dataSource}
            />
          </div>
        ) : (
          ''
        )}
        {this.props.curData.req_query && this.props.curData.req_query.length ? (
          <div className="colQuery">
            <h3 className="col-title">Query：</h3>
            {this.req_query(this.props.curData.req_query)}
          </div>
        ) : (
          ''
        )}

        <div
          style={{
            display:
              this.props.curData.method &&
              HTTP_METHOD[this.props.curData.method.toUpperCase()].request_body
                ? ''
                : 'none',
          }}
        >
          <h3 style={{ display: bodyShow ? '' : 'none' }} className="col-title">
            Body:
          </h3>
          {this.props.curData.req_body_type === 'form'
            ? this.req_body_form(
                this.props.curData.req_body_type,
                this.props.curData.req_body_form,
              )
            : this.req_body(
                this.props.curData.req_body_type,
                this.props.curData.req_body_other,
                this.props.curData.req_body_is_json_schema,
              )}
        </div>

        <h2 className="interface-title">返回数据</h2>
        {this.res_body(
          this.props.curData.res_body_type,
          this.props.curData.res_body,
          this.props.curData.res_body_is_json_schema,
        )}
        <h2 className="interface-title">接口下游</h2>
        <Modal
          width={800}
          title="生成 Native Model"
          visible={convertVisible}
          onCancel={() => this.hideConvertModal()}
          destroyOnClose={true}
          footer={null}
        >
          <div className="model-container">
            <div className="model-action">
              <Select
                defaultValue={curLanguage}
                style={{ width: 120 }}
                onChange={val => this.onLanguageChange(val)}
              >
                {langList.map(item => (
                  <Option value={item.toLowerCase()} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
              <Button
                type="primary"
                icon="copy"
                onClick={() => {
                  this.copyUrl(this.state.jsonModelStr)
                }}
              >
                复制
              </Button>
            </div>
            <div className="model-content">{this.state.jsonModelStr}</div>
          </div>
        </Modal>
      </div>
    )
    if (this.props.curData.record_type !== 0) {
      res = (
        <div className="caseContainer">
          {this.props.curData.desc && (
            <Viewer
              ref={this.viewerRef}
              initialValue={this.props.curData.markdown || ''}
            />
          )}
        </div>
      )
    }

    if (!this.props.curData.title) {
      if (this.state.init) {
        res = <div />
      } else {
        res = (
          <div style={{ marginTop: '150px', textAlign: 'center' }}>
            <Spin spinning={!this.state.init} />
          </div>
        )
      }
    }
    return res
  }
}

export default View
