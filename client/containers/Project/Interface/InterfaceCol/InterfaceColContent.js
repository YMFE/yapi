import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { fetchInterfaceColList, fetchCaseList, setColData } from '../../../../reducer/modules/interfaceCol'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

// import { formatTime } from '../../../../common.js'
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import axios from 'axios'


@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      isShowCol: state.interfaceCol.isShowCol,
      currCaseList: state.interfaceCol.currCaseList
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
    isShowCol: PropTypes.bool
  }

  constructor(props) {
    super(props);

    this.state = {
      rows: []
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

  handleColdata = (rows)=>{
    rows = rows.map((item) => {
      item.id = item._id;
      return item;
    })
    rows = rows.sort((n, o)=>{
      return n.index>o.index
    })
    this.setState({
      rows: rows
    })
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
    rows.forEach((item, index)=>{
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

  componentWillReceiveProps(nextProps) {
    const { interfaceColList } = nextProps;
    const { actionId: oldColId, id } = this.props.match.params
    let newColId = nextProps.match.params.actionId
    if (!interfaceColList.find(item => +item._id === +newColId)) {
      this.props.history.push('/project/' + id + '/interface/col/' + interfaceColList[0]._id)
    } else if (oldColId !== newColId) {
      if (newColId && newColId != 0) {
        this.props.fetchCaseList(newColId);
        this.props.setColData({ currColId: +newColId, isShowCol: true })
        this.handleColdata(this.props.currCaseList)
      }

    }
  }

  render() {
    const columns = [{
      property: 'casename',
      header: {
        label: '用例名称'
      },
      cell: {
        formatters: [
          (text,{rowData}) => {
            let record = rowData;
            return <Link to={"/project/" + record.project_id + "/interface/case/" + record._id}>{record.casename}</Link>
          }            
        ]
      }
    }, {
      property: 'path',
      header: {
        label: '接口路径'
      },
      cell: {
        formatters: [
          (text,{rowData}) => {
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
        label: '请求方法'
      },
      property: 'method'
    }
    ];
    const { rows } = this.state;
    if (rows.length === 0) {
      return null;
    }
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
      <div>
        <div style={{ padding: "16px" }}>
          <h2 style={{ marginBottom: '10px' }}>测试集合</h2>
          <Table.Provider
            components={components}
            columns={resolvedColumns}
            style={{width:'100%', lineHeight: '30px'}}
          >
            <Table.Header
              style={{textAlign: 'left'}}
              headerRows={resolve.headerRows({ columns })}
            />

            <Table.Body
              rows={resolvedRows}
              rowKey="id"
              onRow={this.onRow}
            />
          </Table.Provider>
        </div>
      </div>
    )
  }
}

export default InterfaceColContent