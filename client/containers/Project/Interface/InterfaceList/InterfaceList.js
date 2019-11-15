import React, {PureComponent as Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Button, Checkbox, Icon, message, Modal, Select, Table, Tooltip, TreeSelect} from 'antd';
import AddInterfaceForm from './AddInterfaceForm';
import {
  fetchInterfaceCatList,
  fetchInterfaceList,
  fetchInterfaceListMenu
} from '../../../../reducer/modules/interface.js';
import {getProject} from '../../../../reducer/modules/project.js';
import {Link} from 'react-router-dom';
import variable from '../../../../constants/variable';
import './Edit.scss';
import Label from '../../../../components/Label/Label.js';
import {findMeInTree} from '../../../../common.js';

const Option = Select.Option;
const limit = 20;
const apistatusArr = [
  {
    text: '已发布',
    value: 'done'
  },
  {
    text: '设计中',
    value: 'design'
  },
  {
    text: '开发中',
    value: 'undone'
  },
  {
    text: '已提测',
    value: 'testing'
  },
  {
    text: '已过时',
    value: 'deprecated'
  },
  {
    text: '暂停开发',
    value: 'stoping'
  }
];
const apistatus = {
  "status": apistatusArr.map(item => {
    return item.value
  })
};

@connect(
  state => {
    return {
      curData: state.inter.curdata,
      curProject: state.project.currProject,
      catList: state.inter.list,
      totalTableList: state.inter.totalTableList,
      aggregate: state.inter.aggregate,
      catTableList: state.inter.catTableList,
      totalCount: state.inter.totalCount,
      count: state.inter.count
    };
  },
  {
    fetchInterfaceListMenu,
    fetchInterfaceList,
    fetchInterfaceCatList,
    getProject
  }
)
class InterfaceList extends Component {
  static propTypes = {
    curData: PropTypes.object,
    catList: PropTypes.array,
    match: PropTypes.object,
    curProject: PropTypes.object,
    history: PropTypes.object,
    fetchInterfaceListMenu: PropTypes.func,
    fetchInterfaceList: PropTypes.func,
    fetchInterfaceCatList: PropTypes.func,
    totalTableList: PropTypes.array,
    aggregate: PropTypes.array,
    catTableList: PropTypes.array,
    totalCount: PropTypes.number,
    count: PropTypes.number,
    getProject: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: [],
      catid: null,
      total: null,
      current: 1,
      filters: apistatus,
      checked:false,
      currentCat:{},
      isLoading: false
    };
    this.cancelSourceSet = new Set();
  }

  /**
   * 取消上一次的请求
   */
  cancelRequestBefore = () => {
    this.cancelSourceSet.forEach(v => {
      v.cancel();
    });
    this.cancelSourceSet.clear();
  };

  handleRequest = async props => {
    const { params } = props.match;
    this.cancelRequestBefore();
    const cancelSource = axios.CancelToken.source();
    this.cancelSourceSet.add(cancelSource);
    let res;
    this.setState({
      isLoading: true
    });
    if (!params.actionId) {
      let projectId = params.id;
      this.setState({
        catid: null
      });

      let option = {
        page: this.state.current,
        limit,
        project_id: projectId,
        status: this.state.filters.status.join(',')
      };
      res = await this.props.fetchInterfaceList(option, {
        cancelToken: cancelSource.token
      });
    } else if (isNaN(params.actionId)) {
      let catid = params.actionId.substr(4);
      this.setState({ catid: +catid });
      let option = {
        page: this.state.current,
        limit,
        catid,
        status: this.state.filters.status.join(',')
      };
      res = await this.props.fetchInterfaceCatList(option, {
        cancelToken: cancelSource.token
      });
    }
    if (axios.isCancel(res.payload)) return;
    this.setState({
      isLoading: false
    })
  };

  // 更新分类简介
  handleChangeInterfaceCat = (desc, name) => {
    let params = {
      catid: this.state.catid,
      name: name,
      desc: desc
    };

    axios.post('/api/interface/up_cat', params).then(async res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      let project_id = this.props.match.params.id;
      await this.props.getProject(project_id);
      await this.props.fetchInterfaceListMenu(project_id);
      message.success('接口集合简介更新成功');
    });
  };
  handleChange = (pagination, filters, sorter) => {
    this.setState(
      {
        sortedInfo: sorter,
        filters: (filters.status||[]).length > 0 ? filters : apistatus,
        pagination: pagination
      },
      () => this.handleRequest(this.props));
  };

  fineme=(list)=>{
    list.find(he=>{
      if('cat_'+he._id===this.actionId){
        this.setState(
          {
            currentCat:he
          }
        )
        return true;
      }
      if(he.children){
        this.fineme(he.children);
      }
      return this.state.currentCat._id===this.actionId;
    })
  }

  componentWillMount() {
    this.actionId = this.props.match.params.actionId;
    this.handleRequest(this.props);
  }

  componentWillReceiveProps(nextProps) {
    let _actionId = nextProps.match.params.actionId;
    this.fineme(nextProps.catList);
    if (this.actionId !== _actionId) {
      this.actionId = _actionId;
      this.setState(
        {
          current: 1,
          checked:false
        },
        () => this.handleRequest(nextProps)
      );
    }
  }

  componentWillUnmount() {
    this.cancelRequestBefore();
  }

  handleAddInterface = data => {
    data.project_id = this.props.curProject._id;
    data.catid=data.catids.pop();
    axios.post('/api/interface/add', data).then(res => {
      if (res.data.errcode !== 0) {
        return message.error(`${res.data.errmsg}, 你可以在左侧的接口列表中对接口进行删改`);
      }
      message.success('接口添加成功');
      let interfaceId = res.data.data._id;
      this.props.history.push('/project/' + data.project_id + '/interface/api/' + interfaceId);
      this.props.fetchInterfaceListMenu(data.project_id);
    });
  };

  changeInterfaceCat = async (id, catid) => {
    const params = {
      id: id,
      catid:catid
    };
    let result = await axios.post('/api/interface/up', params);
    if (result.data.errcode === 0) {
      message.success('修改成功');
      this.handleRequest(this.props);
      this.props.fetchInterfaceListMenu(this.props.curProject._id);
    } else {
      message.error(result.data.errmsg);
    }
  };

  changeInterfaceStatus = async value => {
    const params = {
      id: value.split('-')[0],
      status: value.split('-')[1]
    };
    let result = await axios.post('/api/interface/up', params);
    if (result.data.errcode === 0) {
      message.success('修改成功');
      this.props.fetchInterfaceListMenu(this.props.curProject._id);
      this.handleRequest(this.props);
    } else {
      message.error(result.data.errmsg);
    }
  };

  changePage = current => {
    this.setState(
      {
        current: current
      }
    );
  };





  onChangeCheckbox = async e => {

    let checked = e.target.checked;
    let childs = this.state.catid;
    this.setState({
      checked: checked?true:false
    });
    if (checked) {
      childs = e.target.childs;
    }
    let option = {
      page: this.state.current,
      limit,
      catid: childs,
      status: this.state.filters.status.join(',')
    };
    await this.props.fetchInterfaceCatList(option);

  };

  render() {
    let tag = this.props.curProject.tag;
    let filter = tag.map(item => {
      return { text: item.name, value: item.name };
    });

    const columns = [
      {
        title: '接口名称',
        dataIndex: 'title',
        key: 'title',
        width: 30,
        render: (text, item) => {
          return (
            <Link to={'/project/' + item.project_id + '/interface/api/' + item._id}>
              <span className="path">{text}</span>
            </Link>
          );
        }
      },
      {
        title: '接口路径',
        dataIndex: 'path',
        key: 'path',
        width: 50,
        render: (item, record) => {
          const path = this.props.curProject.basepath + item;
          let methodColor =
            variable.METHOD_COLOR[record.method ? record.method.toLowerCase() : 'get'] ||
            variable.METHOD_COLOR['get'];
          return (
            <div>
              <span
                style={{ color: methodColor.color, backgroundColor: methodColor.bac }}
                className="colValue"
              >
                {record.method}
              </span>
              <Tooltip title="开放接口" placement="topLeft">
                <span>{record.api_opened && <Icon className="opened" type="eye-o" />}</span>
              </Tooltip>
              <Tooltip title={path} placement="topLeft" overlayClassName="toolTip">
                <span className="path">{path}</span>
              </Tooltip>
            </div>
          );
        }
      },
      {
        title: '接口分类',
        dataIndex: 'catid',
        key: 'catid',
        width: 28,
        render: (item, record) => {
          return (
            <TreeSelect
              value={item + ''}
              className="select path"
              onChange={catid => this.changeInterfaceCat(record._id, catid)}
              treeData={this.props.catList}
            />
          );
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 24,
        render: (text, record) => {
          const key = record.key;
          return (
            <Select
              value={key + '-' + text}
              className="select"
              onChange={this.changeInterfaceStatus}
            >
              <Option value={key + '-done'}>
                <span className="tag-status done">已发布</span>
              </Option>
              <Option value={key + '-design'}>
                <span className="tag-status design">设计中</span>
              </Option>
              <Option value={key + '-undone'}>
                <span className="tag-status undone">开发中</span>
              </Option>
              <Option value={key + '-testing'}>
                <span className="tag-status testing">已提测</span>
              </Option>
              <Option value={key + '-deprecated'}>
                <span className="tag-status deprecated">已过时</span>
              </Option>
              <Option value={key + '-stoping'}>
                <span className="tag-status stoping">暂停开发</span>
              </Option>
            </Select>
          );
        },
        filters: apistatusArr,
        onFilter: (value, record) => record.status.indexOf(value) === 0
      },
      {
        title: 'tag',
        dataIndex: 'tag',
        key: 'tag',
        width: 14,
        render: text => {
          let textMsg = text.length > 0 ? text.join('\n') : '未设置';
          return <div className="table-desc">{textMsg}</div>;
        },
        filters: filter,
        onFilter: (value, record) => {
          return record.tag.indexOf(value) >= 0;
        }
      }
    ];
    let intername = '',
      desc = '',
      childs = '';
    let cat = this.props.curProject ? this.props.curProject.cat : [];

    if (cat) {
      let me = findMeInTree(cat, this.state.catid);
      intername = me?me.name:'';
      desc = me?me.desc:'';
      childs = me ? me.childs : '';
    }
    // const data = this.state.data ? this.state.data.map(item => {
    //   item.key = item._id;
    //   return item;
    // }) : [];
    let data = [];
    let total = 0;

    const { params } = this.props.match;
    if (!params.actionId) {
      data = this.props.totalTableList;
      total = this.props.totalCount;
    } else if (isNaN(params.actionId)) {
      data = this.props.catTableList;
      total = this.props.count;
    }
    let aggregate = this.props.aggregate;

    let aggregateMessage = JSON.stringify(aggregate.map(obj => {
      let types = apistatusArr.find(item => item.value === obj._id);
      return types.text + ': ' + obj.count + ' 个  ';
    }));

    data = data.map(item => {
      item.key = item._id;
      return item;
    });

    const pageConfig = {
      total: total,
      pageSize: limit,
      current: this.state.current,
      onChange: this.changePage
    };

    const isDisabled = this.props.catList.length === 0;

    // console.log(this.props.curProject.tag)

    return (
      <div style={{ padding: '24px' }}>
        <h2 className="interface-title" style={{ display: 'inline-block', margin: 0 }}>
          {intername ? intername : '全部接口'}共 ({total}) 个,其中：{aggregateMessage}
          {intername&&this.state.currentCat.children&&this.state.currentCat.children.length>0 ? (
            <Checkbox
              childs={childs}
              checked={this.state.checked}
              onChange={this.onChangeCheckbox}
            >包含子分类接口</Checkbox>) : ''}
        </h2>

        <Button
          style={{ float: 'right' }}
          disabled={isDisabled}
          type="primary"
          onClick={() => this.setState({ visible: true })}
        >
          添加接口
        </Button>
        <div style={{ marginTop: '10px' }}>
          <Label onChange={value => this.handleChangeInterfaceCat(value, intername)} desc={desc} />
        </div>
        <Table
          loading={this.state.isLoading}
          className="table-interfacelist"
          pagination={pageConfig}
          columns={columns}
          onChange={this.handleChange}
          dataSource={data}
        />
        {this.state.visible && (
          <Modal
            title="添加接口"
            visible={this.state.visible}
            onCancel={() => this.setState({ visible: false })}
            footer={null}
            className="addcatmodal"
          >
            <AddInterfaceForm
              catid={this.state.catid}
              catdata={cat}
              onCancel={() => this.setState({ visible: false })}
              onSubmit={this.handleAddInterface}
            />
          </Modal>
        )}
      </div>
    );
  }
}

export default InterfaceList;
