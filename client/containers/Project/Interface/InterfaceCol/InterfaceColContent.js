import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
//import constants from '../../../../constants/variable.js'
import { Tooltip, Icon, Button, Spin, Modal, message, Select, Switch } from 'antd'
import { fetchInterfaceColList, fetchCaseList, setColData } from '../../../../reducer/modules/interfaceCol'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { isJson,  handleJson, handleParamsValue } from '../../../../common.js'
import mockEditor from '../InterfaceList/mockEditor';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import axios from 'axios'
import URL from 'url';
import Mock from 'mockjs'
import json5 from 'json5'
import CaseReport from './CaseReport.js'
import _ from 'underscore'

const MockExtra = require('common/mock-extra.js')
const Option = Select.Option;
function json_parse(data) {
  try {
    return json5.parse(data)
  } catch (e) {
    return data
  }
}

function handleReport(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
}


@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      isShowCol: state.interfaceCol.isShowCol,
      isRander: state.interfaceCol.isRander,
      currCaseList: state.interfaceCol.currCaseList,
      currProject: state.project.currProject
    }
  },
  {
    fetchInterfaceColList,
    fetchCaseList,
    setColData
  }
)
@withRouter
@DragDropContext(HTML5Backend)
class InterfaceColContent extends Component {

  static propTypes = {
    match: PropTypes.object,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    fetchCaseList: PropTypes.func,
    setColData: PropTypes.func,
    history: PropTypes.object,
    currCaseList: PropTypes.array,
    currColId: PropTypes.number,
    currCaseId: PropTypes.number,
    isShowCol: PropTypes.bool,
    isRander: PropTypes.bool,
    currProject: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.reports = {};
    this.records = {};
    this.state = {
      rows: [],
      reports: {},
      visible: false,
      curCaseid: null,
      hasPlugin: false,
      currColEnv: '',
      advVisible: false,
      curScript: '',
      enableScript: false
    };
    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
  }

  async componentWillMount() {
    const result = await this.props.fetchInterfaceColList(this.props.match.params.id)
    let { currColId } = this.props;
    const params = this.props.match.params;
    const { actionId } = params;
    this.currColId = currColId = +actionId ||
      result.payload.data.data[0]._id;
    this.props.history.push('/project/' + params.id + '/interface/col/' + currColId)
    if (currColId && currColId != 0) {
      let result = await this.props.fetchCaseList(currColId);
      if (result.payload.data.errcode === 0) {
        this.reports = handleReport(result.payload.data.colData.test_report);
      }

      this.props.setColData({ currColId: +currColId, isShowCol: true, isRander: false })
      this.handleColdata(this.props.currCaseList)
    }

    let startTime = 0;
    this.interval = setInterval(() => {
      startTime += 500;
      if (startTime > 5000) {
        clearInterval(this.interval);
      }
      if (window.crossRequest) {
        clearInterval(this.interval);
        this.setState({
          hasPlugin: true
        })
      } else {
        this.setState({
          hasPlugin: false
        })
      }
    }, 500)

  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  handleColdata = (rows) => {
    rows = rows.map((item) => {
      item.id = item._id;
      item._test_status = item.test_status;
      return item;
    })
    rows = rows.sort((n, o) => {
      return n.index - o.index;
    })
    this.setState({
      rows: rows
    })
  }

  executeTests = async () => {
    for (let i = 0, l = this.state.rows.length, newRows, curitem; i < l; i++) {
      let { rows } = this.state;
      curitem = Object.assign({}, rows[i], { test_status: 'loading' });
      newRows = [].concat([], rows);
      newRows[i] = curitem;
      this.setState({
        rows: newRows
      })
      let status = 'error', result;
      try {
        result = await this.handleTest(curitem);
        if (result.code === 400) {
          status = 'error';
        } else if (result.code === 0) {
          status = 'ok';
        } else if (result.code === 1) {
          status = 'invalid'
        }
      } catch (e) {
        console.error(e);
        status = 'error';
        result = e;
      }

      this.reports[curitem._id] = result;
      this.records[curitem._id] = {
        params: result.params,
        body: result.res_body
      };

      curitem = Object.assign({}, rows[i], { test_status: status });
      newRows = [].concat([], rows);
      newRows[i] = curitem;
      this.setState({
        rows: newRows
      })
    }
    await axios.post('/api/col/up_col', { col_id: this.props.currColId, test_report: JSON.stringify(this.reports) })
  }

  handleTest = async (interfaceData) => {
    const { currProject } = this.props;
    let requestParams = {};
    let { case_env } = interfaceData;
    let path = URL.resolve(currProject.basepath, interfaceData.path);
    interfaceData.req_params = interfaceData.req_params || [];
    interfaceData.req_params.forEach(item => {
      let val = this.handleValue(item.value);
      requestParams[item.name] = val;
      path = path.replace(`:${item.name}`, val || `:${item.name}`);
    });
    const domains = currProject.env.concat();

    case_env = this.state.currColEnv ? this.state.currColEnv : case_env;

    let pathQuery = {};
    let currDomain = _.find(domains, item => item.name === case_env);

    if (!currDomain) {
      currDomain = domains[0];
    }

    const urlObj = URL.parse(URL.resolve(currDomain.domain, '.' + path));
    urlObj.query && urlObj.query.split('&').forEach(item => {
      if (item) {
        item = item.split('=');
        pathQuery[item[0]] = item[1];
      }
    })

    const href = URL.format({
      protocol: urlObj.protocol || 'http',
      host: urlObj.host,
      pathname: urlObj.pathname,
      query: Object.assign(pathQuery, this.getQueryObj(interfaceData.req_query, requestParams))
    });

    let result = { code: 400, msg: '数据异常', validRes: [] };
    let that = this;

    result.url = href;
    result.method = interfaceData.method;
    result.headers = that.getHeadersObj(interfaceData.req_headers);
    if (interfaceData.req_body_type === 'form') {
      result.body = that.arrToObj(interfaceData.req_body_form, requestParams)
    } else {
      let reqBody = isJson(interfaceData.req_body_other);
      if (reqBody === false) {
        result.body = this.handleValue(interfaceData.req_body_other)
      } else {
        reqBody = handleJson(reqBody, this.handleValue)
        requestParams = Object.assign(requestParams, reqBody);
        result.body = JSON.stringify(reqBody)
      }

    }

    try {
      let data = await this.crossRequest({
        url: href,
        method: interfaceData.method,
        headers: that.getHeadersObj(interfaceData.req_headers),
        data: result.body,
        timeout: 8240000
      })
      let res = data.res.body = json_parse(data.res.body);
      let header = data.res.header;
      result.res_header = header;
      result.res_body = res;
      result.params = requestParams;
      let validRes = [];
      if (res && typeof res === 'object') {
        if (interfaceData.mock_verify) {
          let tpl = MockExtra(json_parse(interfaceData.res_body), {
            query: interfaceData.req_query,
            body: interfaceData.req_body_form
          })
          validRes = Mock.valid(tpl, res);
        }
      }
      let responseData = Object.assign({}, {
        status: data.res.status,
        body: res,
        header: data.res.header,
        statusText: data.res.statusText
      })
      await that.handleScriptTest(interfaceData, responseData, validRes, requestParams);
      if (validRes.length === 0) {
        result.code = 0;
        result.validRes = [{ message: '验证通过' }];
      } else if (validRes.length > 0) {
        result.code = 1;
        result.validRes = validRes;
      }
      return result;

    } catch (data) {
      if (data.err) {
        data.err = data.err || '请求异常';
        try {
          data.err = json_parse(data.err);
        } catch (e) {
          console.log(e)
        }
        result.res_body = data.err;
        result.res_header = data.header;
      } else {
        result.res_body = data.message;
      }

      result.code = 400;
      return result;
    }
  }

  crossRequest = (options) => {
    return new Promise((resolve, reject) => {
      options.error = options.success = function (res, header, data) {
        
        if(isNaN(data.res.status)){
          reject({
            err: res,
            header
          })
        }
        resolve(data);
      }
      window.crossRequest(options);
    })
  }

  //response, validRes
  handleScriptTest = async (interfaceData, response, validRes, requestParams) => {
    if (interfaceData.enable_script !== true) {
      return null;
    }
    try {
      let test = await axios.post('/api/col/run_script', {
        response: response,
        records: this.records,
        script: interfaceData.test_script,
        params: requestParams
      })
      if (test.data.errcode !== 0) {
        test.data.data.logs.forEach(item=>{
          validRes.push({
            message: item
          })
        })
      }
    } catch (err) {
      validRes.push({
        message: 'Error: ' + err.message
      })
    }
  }

  handleValue = (val) => {
    return handleParamsValue(val, this.records);
  }

  

  arrToObj = (arr, requestParams) => {
    arr = arr || [];
    const obj = {};
    arr.forEach(item => {
      if (item.name && item.enable && item.type !== 'file') {
        obj[item.name] = this.handleValue(item.value);
        if (requestParams) {
          requestParams[item.name] = obj[item.name];
        }
      }
    })
    return obj;
  }



  getQueryObj = (query, requestParams) => {
    query = query || [];
    const queryObj = {};
    query.forEach(item => {
      if (item.name && item.enable) {
        queryObj[item.name] = this.handleValue(item.value);
        if (requestParams) {
          requestParams[item.name] = queryObj[item.name];
        }
      }
    })
    return queryObj;
  }
  getHeadersObj = (headers) => {
    headers = headers || [];
    const headersObj = {};
    headers.forEach(item => {
      if (item.name && item.value) {
        headersObj[item.name] = this.handleValue(item.value);
      }
    })
    return headersObj;
  }

  onRow(row) {
    return {
      rowId: row.id,
      onMove: this.onMoveRow
    };
  }
  onMoveRow({ sourceRowId, targetRowId }) {
    let rows = dnd.moveRows({
      sourceRowId,
      targetRowId
    })(this.state.rows);
    let changes = [];
    rows.forEach((item, index) => {
      changes.push({
        id: item._id,
        index: index
      })
    })
    axios.post('/api/col/up_col_index', changes).then(()=>{
      this.props.fetchInterfaceColList(this.props.match.params.id)
    })
    if (rows) {
      this.setState({ rows });
    }
  }

  async componentWillReceiveProps(nextProps) {
    let newColId = !isNaN(nextProps.match.params.actionId) ? +nextProps.match.params.actionId : 0;
    
    if (newColId && this.currColId && newColId !== this.currColId || nextProps.isRander) {
      this.currColId = newColId;
      await this.props.fetchCaseList(newColId);
      this.props.setColData({ currColId: +newColId, isShowCol: true, isRander: false })
      this.handleColdata(this.props.currCaseList)
    }
  }

  openReport = (id) => {
    if (!this.reports[id]) {
      return message.warn('还没有生成报告')
    }
    this.setState({
      visible: true,
      curCaseid: id
    })
  }

  openAdv = (id) => {
    let findCase = _.find(this.props.currCaseList, item => item.id === id)

    this.setState({
      enableScript: findCase.enable_script,
      curScript: findCase.test_script,
      advVisible: true,
      curCaseid: id
    }, () => {
      let that = this;
      if (that.Editor) {
        that.Editor.setValue(this.state.curScript);
      } else {
        that.Editor = mockEditor({
          container: 'case-script',
          data: this.state.curScript,
          onChange: function (d) {
            that.setState({
              curScript: d.text
            })
          }
        })
      }
    })
  }

  handleAdvCancel = () => {
    this.setState({
      advVisible: false
    });
  }

  handleAdvOk = async () => {
    const { curCaseid, enableScript, curScript } = this.state;
    const res = await axios.post('/api/col/up_case', {
      id: curCaseid,
      test_script: curScript,
      enable_script: enableScript
    });
    if (res.data.errcode === 0) {
      message.success('更新成功');
    }
    this.setState({
      advVisible: false
    });
    let currColId = this.currColId;
    await this.props.fetchCaseList(currColId);
    this.props.setColData({ currColId: +currColId, isShowCol: true, isRander: false })
    this.handleColdata(this.props.currCaseList)
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  colEnvChange = (envName) => {
    let rows = [...this.state.rows];
    for (var i in rows) {
      rows[i].case_env = envName;
    }
    this.setState({
      rows: [...rows],
      currColEnv: envName
    });
  }

  render() {
    const columns = [{
      property: 'casename',
      header: {
        label: '用例名称'
      },
      props: {
        style: {
          width: '250px'
        }
      },
      cell: {
        formatters: [
          (text, { rowData }) => {
            let record = rowData;
            return <Link to={"/project/" + record.project_id + "/interface/case/" + record._id}>{record.casename.length > 23 ?record.casename.substr(0, 20) + '...' : record.casename}</Link>
          }
        ]
      }
    }, {
      header: {
        label: 'key',
        formatters: [() => {
          return <Tooltip title={<span>每个用例都有唯一的key，用于获取所匹配接口的响应数据，例如使用 <a href="http://yapi.qunar.com/case.html#变量参数" className="link-tooltip" target="blank">变量参数</a> 功能</span>}>
            Key</Tooltip>
        }]
      },
      props: {
        style: {
          width: '100px'
        }
      },
      cell: {
        formatters: [
          (value, { rowData }) => {
            return <span>{rowData._id}</span>
          }]
      }
    }, {
      property: 'test_status',
      header: {
        label: '状态'
      },
      props: {
        style: {
          width: '100px'
        }
      },
      cell: {
        formatters: [(value, { rowData }) => {
          let id = rowData._id;
          let code = this.reports[id] ? this.reports[id].code : 0;
          if (rowData.test_status === 'loading') {
            return <div ><Spin /></div>
          }

          switch (code) {
            case 0:
              return <div ><Tooltip title="Pass"><Icon style={{ color: '#00a854' }} type="check-circle" /></Tooltip></div>
            case 400:
              return <div ><Tooltip title="请求异常"><Icon type="info-circle" style={{ color: '#f04134' }} /></Tooltip></div>
            case 1:
              return <div ><Tooltip title="验证失败"><Icon type="exclamation-circle" style={{ color: '#ffbf00' }} /></Tooltip></div>
            default:
              return <div ><Icon style={{ color: '#00a854' }} type="check-circle" /></div>
          }
        }]
      }
    }, {
      property: 'path',
      header: {
        label: '接口路径'
      },
      cell: {
        formatters: [
          (text, { rowData }) => {
            let record = rowData;
            return (
              <Tooltip title="跳转到对应接口">
                <Link to={`/project/${record.project_id}/interface/api/${record.interface_id}`}>{record.path.length > 23 ? record.path + '...' : record.path}</Link>
              </Tooltip>
            )
          }
        ]
      }
    },
    {
      header: {
        label: '操作'

      },
      props: {
        style: {
          width: '200px'
        }
      },
      cell: {
        formatters: [(text, { rowData }) => {
          let reportFun = () => {
            if (!this.reports[rowData.id]) {
              return null;
            }
            return <Button onClick={() => this.openReport(rowData.id)}>测试报告</Button>
          }
          return <div className="interface-col-table-action">
            <Button onClick={() => this.openAdv(rowData.id)} type="primary">高级</Button>
            {reportFun()}
          </div>
        }]
      }
    }
    ];
    const { rows, currColEnv } = this.state;
    const components = {
      header: {
        cell: dnd.Header
      },
      body: {
        row: dnd.Row
      }
    };
    const resolvedColumns = resolve.columnChildren({ columns });
    const resolvedRows = resolve.resolve({
      columns: resolvedColumns,
      method: resolve.nested
    })(rows);
    let colEnv = this.props.currProject.env || [];
    return (
      <div className="interface-col">
        <h2 className="interface-title" style={{ display: 'inline-block', margin: "0 20px", marginBottom: '16px' }}>测试集合&nbsp;<a target="_blank" rel="noopener noreferrer" href="http://yapi.qunar.com/case.html" >
          <Tooltip title="点击查看文档"><Icon type="question-circle-o" /></Tooltip>
        </a></h2>
        <div style={{ display: 'inline-block', margin: 0, marginBottom: '16px' }}>
          <Select value={currColEnv} style={{ width: "320px" }} onChange={this.colEnvChange}>
            <Option key="default" value="" >默认使用 case 详情页面保存的 domain</Option>
            {
              colEnv.map((item) => {
                return <Option key={item._id} value={item.name}>{item.name + ": " + item.domain}</Option>;
              })
            }
          </Select>
        </div>
        {this.state.hasPlugin ?
          <Button type="primary" style={{ float: 'right' }} onClick={this.executeTests}>开始测试</Button> :
          <Tooltip title="请安装 cross-request Chrome 插件">
            <Button disabled type="primary" style={{ float: 'right' }} >开始测试</Button>
          </Tooltip>
        }

        <Table.Provider
          components={components}
          columns={resolvedColumns}
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <Table.Header
            className="interface-col-table-header"
            headerRows={resolve.headerRows({ columns })}
          />

          <Table.Body
            className="interface-col-table-body"
            rows={resolvedRows}
            rowKey="id"
            onRow={this.onRow}
          />
        </Table.Provider>
        <Modal
          title="测试报告"
          width="660px"
          style={{ minHeight: '500px' }}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <CaseReport {...this.reports[this.state.curCaseid]} />
        </Modal>

        <Modal
          title="自定义测试脚本"
          width="660px"
          style={{ minHeight: '500px' }}
          visible={this.state.advVisible}
          onCancel={this.handleAdvCancel}
          onOk={this.handleAdvOk}
          maskClosable={false}
        >
          <h3>
            是否开启:&nbsp;
            <Switch checked={this.state.enableScript} onChange={e => this.setState({ enableScript: e })} />
          </h3>
          <div className="case-script" id="case-script" style={{ minHeight: 500 }}></div>
        </Modal>
      </div>
    )
  }
}

export default InterfaceColContent
