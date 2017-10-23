import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import constants from '../../../../constants/variable.js'
import { Tooltip, Icon, Button, Spin, Modal, message ,Select} from 'antd'
import { fetchInterfaceColList, fetchCaseList, setColData } from '../../../../reducer/modules/interfaceCol'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { isJson, handleMockWord, simpleJsonPathParse } from '../../../../common.js'
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import axios from 'axios'
import URL from 'url';
import Mock from 'mockjs'
import json5 from 'json5'
import CaseReport from './CaseReport.js'
const MockExtra = require('common/mock-extra.js')
const Option = Select.Option;
function json_parse(data) {
  try {
    return json5.parse(data)
  } catch (e) {
    return data
  }
}
const HTTP_METHOD = constants.HTTP_METHOD;


@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      isShowCol: state.interfaceCol.isShowCol,
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
      currColEnv: ''
    };
    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
  }

  async componentWillMount() {
    const result = await this.props.fetchInterfaceColList(this.props.match.params.id)
    let { currColId } = this.props;
    const params = this.props.match.params;
    const { actionId } = params;
    currColId = +actionId ||
      result.payload.data.data.find(item => +item._id === +currColId) && +currColId ||
      result.payload.data.data[0]._id;
    this.props.history.push('/project/' + params.id + '/interface/col/' + currColId)
    if (currColId && currColId != 0) {
      await this.props.fetchCaseList(currColId);
      this.props.setColData({ currColId: +currColId, isShowCol: true })
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
    let { currColEnv } = this.state;
    const colEnv = this.props.currProject.env;
    currColEnv = currColEnv || colEnv[0].name;
    rows = rows.map((item) => {
      item.id = item._id;
      item._test_status = item.test_status;
      item.case_env = currColEnv;
      return item;
    })
    rows = rows.sort((n, o) => {
      return n.index - o.index;
    })
    this.setState({
      rows: rows,
      currColEnv
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
      
      let query = this.arrToObj(curitem.req_query);
      if(!query || typeof query !== 'object'){
        query = {};
      }
      let body = {};
      if(HTTP_METHOD[curitem.method].request_body){
        if(curitem.req_body_type === 'form'){
          body = this.arrToObj(curitem.req_body_form);
        }else {
          body = isJson(curitem.req_body_other);
        }
        
        if(!body || typeof body !== 'object'){
          body = {};
        }
      }

      let params = Object.assign({}, query, body);
      this.reports[curitem._id] = result;
      this.records[curitem._id] = {
        params: params,
        body: result.res_body
      };

      curitem = Object.assign({}, rows[i], { test_status: status });
      newRows = [].concat([], rows);
      newRows[i] = curitem;
      this.setState({
        rows: newRows
      })
      if(status === 'error') break;
    }
  }

  handleTest = (interfaceData) => {
    const { currProject } = this.props;
    const { case_env } = interfaceData;
    let path = URL.resolve(currProject.basepath, interfaceData.path);
    interfaceData.req_params = interfaceData.req_params || [];
    interfaceData.req_params.forEach(item => {
      path = path.replace(`:${item.name}`, item.value || `:${item.name}`);
    });
    const domains = currProject.env.concat();
    let currDomain = domains.find(item => item.name === case_env);
    if(!currDomain){
      currDomain = domains[0];
    }
    const urlObj = URL.parse(currDomain.domain);
    if(urlObj.pathname){
      if(urlObj.pathname[urlObj.pathname.length - 1] !== '/'){
        urlObj.pathname += '/'
      }
    }

    const href = URL.format({
      protocol: urlObj.protocol || 'http',
      host: urlObj.host,
      pathname: urlObj.pathname ? URL.resolve(urlObj.pathname, '.' + path) : path,
      query: this.getQueryObj(interfaceData.req_query)
    });


    return new Promise((resolve, reject) => {
      let result = { code: 400, msg: '数据异常', validRes: [] };
      let that = this;

      result.url = href;
      result.method = interfaceData.method;
      result.headers = that.getHeadersObj(interfaceData.req_headers);
      if(interfaceData.req_body_type === 'form'){
        result.body = that.arrToObj(interfaceData.req_body_form)
      }else{
        let reqBody = isJson(interfaceData.req_body_other);
        if(reqBody === false){
          result.body = this.handleValue(interfaceData.req_body_other)
        }else{
          result.body = JSON.stringify(this.handleJson(reqBody))
        }
        
      }
     
      window.crossRequest({
        url: href,
        method: interfaceData.method,
        headers: that.getHeadersObj(interfaceData.req_headers),
        data: result.body,
        success: (res, header) => {
          res = json_parse(res);
          result.res_header = header;
          result.res_body = res;
          if (res && typeof res === 'object') {
            let tpl = MockExtra(json_parse(interfaceData.res_body), {
              query: interfaceData.req_query,
              body: interfaceData.req_body_form
            })

            let validRes = [];
            if (interfaceData.mock_verify) {
              validRes = Mock.valid(tpl, res);
            }
            if (validRes.length === 0) {
              result.code = 0;
              result.validRes = [{ message: '验证通过' }];
              resolve(result);
            } else if (validRes.length > 0) {
              result.code = 1;
              result.validRes = validRes;
              resolve(result)
            }
          } else {
            reject(result)
          }
        },
        error: (err, header) => {
          try {
            err = json_parse(err);
          } catch (e) {
            console.log(e)
          }

          err = err || '请求异常';
          result.code = 400;
          result.res_header = header;
          result.res_body = err;
          reject(result)
        }
      })
    })
  }

  handleJson = (data)=>{
    if(!data){
      return data;
    }
    if(typeof data === 'string'){
      return this.handleValue(data);
    }else if(typeof data === 'object'){
      for(let i in data){
        data[i] = this.handleJson(data[i]);
      }
    }else{
      return data;
    }
    return data;    
  }

  handleValue = (val) => {
    if (!val || typeof val !== 'string') {
      return val;
    } else if (val[0] === '@') {
      return handleMockWord(val);
    } else if (val.indexOf('$.') === 0) {
      return simpleJsonPathParse(val, this.records);
    }
    return val;
  }

  arrToObj = (arr) => {
    arr = arr || [];
    const obj = {};
    arr.forEach(item => {
      if (item.name && item.enable && item.type !== 'file') {
        obj[item.name] = this.handleValue(item.value);
      }
    })
    return obj;
  }

  

  getQueryObj = (query) => {
    query = query || [];
    const queryObj = {};
    query.forEach(item => {
      if (item.name && item.enable) {
        queryObj[item.name] = this.handleValue(item.value);
      }
    })
    return queryObj;
  }
  getHeadersObj = (headers) => {
    headers = headers || [];
    const headersObj = {};
    headers.forEach(item => {
      if (item.name && item.value) {
        headersObj[item.name] = item.value;
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

    axios.post('/api/col/up_col_index', changes).then()
    if (rows) {
      this.setState({ rows });
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { interfaceColList } = nextProps;
    const { actionId: oldColId, id } = this.props.match.params
    let newColId = nextProps.match.params.actionId
    if (!interfaceColList.find(item => +item._id === +newColId)&&interfaceColList[0]._id) {
      this.props.history.push('/project/' + id + '/interface/col/' + interfaceColList[0]._id)
    } else if ((oldColId !== newColId) || interfaceColList !== this.props.interfaceColList) {
      if (newColId && newColId != 0) {
        await this.props.fetchCaseList(newColId);
        this.props.setColData({ currColId: +newColId, isShowCol: true })
        this.handleColdata(this.props.currCaseList)
      }
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

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  colEnvChange = (envName) => {
    let rows = [...this.state.rows];
    for(var i in rows){
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
            return <Link to={"/project/" + record.project_id + "/interface/case/" + record._id}>{record.casename}</Link>
          }
        ]
      }
    }, {
      header: {
        label: 'key',
        formatters: [() => {
          return <Tooltip title={<span>每个用例都有唯一的key，用于获取所匹配接口的响应数据，例如使用 <a href="https://yapi.ymfe.org/case.html#变量参数" className="link-tooltip" target="blank">变量参数</a> 功能</span>}>
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
          switch (rowData.test_status) {
            case 'ok':
              return <div ><Icon style={{ color: '#00a854' }} type="check-circle" /></div>
            case 'error':
              return <div ><Tooltip title="请求异常"><Icon type="info-circle" style={{ color: '#f04134' }} /></Tooltip></div>
            case 'invalid':
              return <div ><Tooltip title="返回数据校验未通过"><Icon type="exclamation-circle" style={{ color: '#ffbf00' }} /></Tooltip></div>
            case 'loading':
              return <div ><Spin /></div>
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
                <Link to={`/project/${record.project_id}/interface/api/${record.interface_id}`}>{record.path}</Link>
              </Tooltip>
            )
          }
        ]
      }
    }, {
      header: {
        label: '测试报告'

      },
      props: {
        style: {
          width: '100px'
        }
      },
      cell: {
        formatters: [(text, { rowData }) => {
          if (!this.reports[rowData.id]) {
            return null;
          }
          return <Button onClick={() => this.openReport(rowData.id)}>报告</Button>
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
        <h2 className="interface-title" style={{ display: 'inline-block', margin: "0 20px", marginBottom: '16px' }}>测试集合&nbsp;<a target="_blank" rel="noopener noreferrer" href="https://yapi.ymfe.org/case.html" >
          <Tooltip title="点击查看文档"><Icon type="question-circle-o" /></Tooltip>
        </a></h2>
        <div style={{ display: 'inline-block', margin: 0, marginBottom: '16px' }}>
          <Select value={currColEnv} style={{ width: "320px" }} onChange={this.colEnvChange}>
            {
              colEnv.map((item)=>{
                return <Option key={item._id} value={item.name}>{item.name+": "+item.domain}</Option>;
              })
            }
          </Select>
        </div>
        {this.state.hasPlugin?
          <Button type="primary" style={{ float: 'right' }} onClick={this.executeTests}>开始测试</Button>:
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
      </div>
    )
  }
}

export default InterfaceColContent
