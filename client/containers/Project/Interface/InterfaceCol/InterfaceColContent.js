import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Tooltip, Icon, Button, Spin, Modal, message } from 'antd'
import { fetchInterfaceColList, fetchCaseList, setColData } from '../../../../reducer/modules/interfaceCol'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { handleMockWord, simpleJsonPathParse } from '../../../../common.js'
// import { formatTime } from '../../../../common.js'
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import axios from 'axios'
import URL from 'url';
import Mock from 'mockjs'
import json5 from 'json5'
import CaseReport from './CaseReport.js'
const MockExtra = require('common/mock-extra.js')

function json_parse(data) {
  try {
    return json5.parse(data)
  } catch (e) {
    return data
  }
}



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
      curCaseid: null
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

  }

  handleColdata = (rows) => {
    rows = rows.map((item) => {
      item.id = item._id;
      item._test_status = item.test_status;
      return item;
    })
    rows = rows.sort((n, o) => {
      return n.index > o.index
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
      let status = 'error';
      try {
        let result = await this.handleTest(curitem);
        if (result.code === 400) {
          status = 'error';
        } else if (result.code === 0) {
          status = 'ok';
        } else if (result.code === 1) {
          status = 'invalid'
        }
        this.reports[curitem._id] = result;
        this.records[curitem._id] = result.res_body;
      } catch (e) {
        status = 'error';
        console.error(e);
      }

      curitem = Object.assign({}, rows[i], { test_status: status });
      newRows = [].concat([], rows);
      newRows[i] = curitem;
      this.setState({
        rows: newRows
      })
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
    const urlObj = URL.parse(domains.find(item => item.name === case_env).domain);
    const href = URL.format({
      protocol: urlObj.protocol || 'http',
      host: urlObj.host,
      pathname: urlObj.pathname ? URL.resolve(urlObj.pathname, path) : path,
      query: this.getQueryObj(interfaceData.req_query)
    });


    return new Promise((resolve, reject) => {
      let result = { code: 400, msg: '数据异常', validRes: [] };
      let that = this;
      window.crossRequest({
        url: href,
        method: interfaceData.method,
        headers: that.getHeadersObj(interfaceData.req_headers),
        data: interfaceData.req_body_type === 'form' ? that.arrToObj(interfaceData.req_body_form) : interfaceData.req_body_other,
        success: (res, header) => {
          res = json_parse(res);
          result.url = href;
          result.method = interfaceData.method;
          result.headers = that.getHeadersObj(interfaceData.req_headers);
          result.body = interfaceData.req_body_type === 'form' ? that.arrToObj(interfaceData.req_body_form) : interfaceData.req_body_other
          result.res_header = header;
          result.res_body = res;
          if (res && typeof res === 'object') {
            let tpl = MockExtra(json_parse(interfaceData.res_body), {
              query: interfaceData.req_query,
              body: interfaceData.req_body_form
            })
            let validRes = Mock.valid(tpl, res);

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
        error: (res) => {
          result.code = 400;
          result.msg = '请求异常'
          reject(res)
        }
      })
    })
  }


  handleVarWord(val) {
    return simpleJsonPathParse(val, this.records)
  }

  handleValue(val) {
    if (!val || typeof val !== 'string') {
      return val;
    } else if (val[0] === '@') {
      return handleMockWord(val);
    } else if (val.indexOf('$.') === 0) {
      return this.handleVarWord(val);
    }
    return val;
  }

  arrToObj = (arr) => {
    arr = arr || [];
    const obj = {};
    arr.forEach(item => {
      if (item.name && item.type !== 'file') {
        obj[item.name] = this.handleValue(item.value);
      }
    })
    return obj;
  }

  getQueryObj = (query) => {
    query = query || [];
    const queryObj = {};
    query.forEach(item => {
      if (item.name) {
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
    if (!interfaceColList.find(item => +item._id === +newColId)) {
      this.props.history.push('/project/' + id + '/interface/col/' + interfaceColList[0]._id)
    } else if (oldColId !== newColId) {
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

  render() {
    const columns = [{
      property: 'casename',
      header: {
        label: '用例名称'
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
          return <Tooltip title="每个用例都有一个独一无二的key，可用来获取匹配的接口响应数据">
            Key</Tooltip>
        }]
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
      cell: {
        formatters: [(text, { rowData }) => {
          return <Button onClick={() => this.openReport(rowData.id)}>报告</Button>
        }]
      }
    }
    ];
    const { rows } = this.state;
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

    return (
      <div className="interface-col">
        <h2 style={{ marginBottom: '10px', display: 'inline-block' }}>测试集合&nbsp;<a target="_blank" rel="noopener noreferrer" href="https://yapi.ymfe.org/case.html" >
          <Tooltip title="点击查看文档"><Icon type="question-circle-o" /></Tooltip>
        </a></h2>
        <Button type="primary" style={{ float: 'right' }} onClick={this.executeTests}>开始测试</Button>
        <Table.Provider
          components={components}
          columns={resolvedColumns}
          style={{ width: '100%', lineHeight: '36px' }}
        >
          <Table.Header
            style={{ textAlign: 'left' }}
            headerRows={resolve.headerRows({ columns })}
          />

          <Table.Body
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