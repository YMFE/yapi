import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Select, Tooltip, Icon } from 'antd'
import variable from '../../../../constants/variable'
import { connect } from 'react-redux'
import { fetchInterfaceListMenu } from '../../../../reducer/modules/interface.js'
import _ from 'lodash'
const Option = Select.Option
@connect(
  state => {
    return {
      projectList: state.project.projectList,
      list: state.inter.list
    }
  },
  {
    fetchInterfaceListMenu
  }
)
export default class ImportInterface extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    selectedRowKeys: [],
    categoryCount: {},
    project: this.props.currProjectId
  };

  static propTypes = {
    list: PropTypes.array,
    selectInterface: PropTypes.func,
    projectList: PropTypes.array,
    currProjectId: PropTypes.string,
    fetchInterfaceListMenu: PropTypes.func
  };

  async componentDidMount() {
    await this.props.fetchInterfaceListMenu(this.props.currProjectId, 'api')
  }

  // 切换项目
  onChange = async val => {
    this.setState({
      project: val,
      selectedRowKeys: [],
      categoryCount: {}
    })
    await this.props.fetchInterfaceListMenu(val)
  };

  render() {
    const { list, projectList } = this.props
    // const { selectedRowKeys } = this.state;
    /* const data = list.map(item => {
      return {
        key: 'category_' + item._id,
        title: item.name,
        isCategory: true,
        children: item.list
          ? item.list.map(e => {
              e.key = e._id;
              e.categoryKey = 'category_' + item._id;
              e.categoryLength = item.list.length;
              return e;
            })
          : []
      };
    }); */
    const arr = []
    const loop = (data)=>{
      data.forEach((v)=>{
        if(v&&v.list){
          arr.push('dir_'+v._id)
          return loop(v.list)

        }
        return arr.push('api_'+v._id)
      })
    }
    const filterArr = []
    const filterLoop = (data)=>{
      data.forEach(v=>{
        return filterArr.push(parseInt( v.substr(4)))
      })
    }
    const self = this
    const rowSelection = {
      // hideDefaultSelections: true,
      onChange: (selectedRowKeys, selectedRows) => {
        let filter =  _.filter(selectedRowKeys, function(o) {
          return !o.indexOf('api') 
        }) 
        filterLoop(filter)
        this.setState({
          selectedRowKeys:selectedRowKeys,
          queryArr:_.uniq(filterArr)
        })
      },
      onSelect: (record, selected, selectedRows) => {
        if(selected){ //选中状态
          if(record.itemType === 'cat'|| record.record_type === 2){ //
            loop(record.list)
            let ar = ['dir_'+record._id]
            const arrKey = _.concat(arr,ar)

            const arrKeySum = this.state.selectedRowKeys
              ?_.concat(this.state.selectedRowKeys,arrKey)
              :arrKey
            let filter =  _.filter(arrKeySum, function(o) {
              return !o.indexOf('api') 
            }) 
            filterLoop(filter)
            this.setState({
              selectedRowKeys:_.sortedUniq(arrKeySum),
              queryArr: _.uniq(filterArr)
            }) 
          }
        }else{//取消选中
          if(record.itemType === 'cat'|| record.record_type === 2){ //
            loop(record.list)
            let ar = ['dir_'+record._id]
            const arrKey = _.concat(arr,ar) //取消选中的keys
            const rowKeys = this.state.selectedRowKeys
            
            const deArr = _.difference(rowKeys,arrKey)
            let filter =  _.filter(deArr, function(o) {
              return !o.indexOf('api') 
            }) 
            filterLoop(filter)
            setTimeout(()=>{
              this.setState({
                selectedRowKeys:deArr,
                queryArr: _.uniq(filterArr)
              })
            })
          }
        }
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        if(selected){
          const arr = []
          const onSelectAllLoop = (data)=>{
            data.forEach((v)=>{
              if(v.itemType === 'cat'|| v.record_type === 2){
                arr.push('dir_'+v._id)
              }else{
                return arr.push('api_'+v._id)
              }
              
            })
          }
          onSelectAllLoop(changeRows)
          const arrKeySum = this.state.selectedRowKeys
              ?_.concat(this.state.selectedRowKeys,arr)
              :arr

            let filter=  _.filter(arrKeySum, function(o) { return !o.indexOf('api') }) 
            filterLoop(filter)
          this.setState({
            selectedRowKeys:_.sortedUniq(arrKeySum),
            queryArr: _.uniq(filterArr)
          })
        }else{
          this.setState({
            selectedRowKeys:[],
            queryArr:[]
          })
        }
      },
      selectedRowKeys: self.state.selectedRowKeys
    }
    self.props.selectInterface(
      self.state.queryArr,
      self.state.project
    )


    const columns = [
      {
        title: '接口名称',
        width: '40%',
        render: (text, record) => (
          <span>
            {record.title||record.name}
          </span>
        ),
        key: '_id'
      },
      {
        title: '接口路径',
        width: '50%',
        dataIndex: 'path',
        render: (text, record) => {
          let item = record.method
          if(record.record_type === 0 && record.interface_type === 'dubbo') {
            item = 'DUBBO'
          }
          let methodColor = variable.METHOD_COLOR[item ? item.toLowerCase() : 'get']
          if(record.record_type === 0) {
            if(record.interface_type === 'http') {
              return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
                <span
                  style={{
                    color: methodColor.color,
                    backgroundColor: methodColor.bac,
                    borderRadius: 4
                  }}
                  className="colValue"
                >{item}
                </span>
                <span>{record.path}</span>
              </div>)
            } else {
              return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
                <span
                  style={{
                    color: methodColor.color,
                    backgroundColor: methodColor.bac,
                    borderRadius: 4
                  }}
                  className="colValue"
                >
                  {item}
                </span>
                <span> METHOD: {record.r_method}</span>
                <span> FACADE: {record.r_facade}</span>
              </div>)
            }
          } else {
            return null
          }
        }
      },
      {
        title: (
          <span>
            状态{' '}
            <Tooltip title="筛选满足条件的接口集合">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        ),
        width: '40%',
        fixed:'right',
        dataIndex: 'status',
        render: (text, record) => {
          if(record.record_type !== 0) {
            return false
          }
          return (
            text &&
            (text === 'done' ? (
              <span className="tag-status done">已完成</span>
            ) : (
              <span className="tag-status undone">未完成</span>
            ))
          )
        },
        filters: [
          {
            text: '已完成',
            value: 'done'
          },
          {
            text: '未完成',
            value: 'undone'
          }
        ],
        onFilter: (value, record) => {
          let arr = record.list.filter(item => {
            return item.status.indexOf(value) === 0
          })
          return arr.length > 0
        }
      }
    ]

    return (
      <div>
        <div className="select-project">
          <span>选择要导入的项目： </span>
          <Select value={this.state.project} style={{ width: 200 }} onChange={this.onChange}>
            {projectList.map(item => {
              return item.projectname ? (
                ''
              ) : (
                <Option value={`${item._id}`} key={item._id}>
                  {item.name}
                </Option>
              )
            })}
          </Select>
        </div>
        <Table
          childrenColumnName='list'
          columns={columns} 
          scroll={{ x: 1000 }}
          rowSelection={rowSelection} 
          dataSource={list} pagination={false}
          rowKey={
            record => {
              if(record.itemType === 'cat' || record.record_type ===2){
                return 'dir_'+record._id
              }
              return 'api_'+record._id
            }
          
          } 
        />
      </div>
    )
  }
}