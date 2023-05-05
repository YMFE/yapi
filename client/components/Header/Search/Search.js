import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, Input, AutoComplete } from 'antd'
import './Search.scss'
import { withRouter } from 'react-router'
import axios from 'axios'
import { setCurrGroup, fetchGroupMsg } from '../../../reducer/modules/group'
import { changeMenuItem } from '../../../reducer/modules/menu'

import { fetchInterfaceListMenu } from '../../../reducer/modules/interface'
const Option = AutoComplete.Option
var debounceTimer = null
@connect(
  state => ({
    groupList: state.group.groupList,
    projectList: state.project.projectList,
  }),
  {
    setCurrGroup,
    changeMenuItem,
    fetchGroupMsg,
    fetchInterfaceListMenu,
  },
)
@withRouter
export default class Srch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
    }
  }

  static propTypes = {
    groupList: PropTypes.array,
    projectList: PropTypes.array,
    router: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    setCurrGroup: PropTypes.func,
    changeMenuItem: PropTypes.func,
    fetchInterfaceListMenu: PropTypes.func,
    fetchGroupMsg: PropTypes.func,
  }

  onSelect = async (value, option) => {
    if (option.props.type === '分组') {
      this.props.changeMenuItem('/group')
      this.props.history.push('/group/' + option.props['id'])
      this.props.setCurrGroup({
        group_name: value,
        _id: option.props['id'] - 0,
      })
    } else if (option.props.type === '项目') {
      await this.props.fetchGroupMsg(option.props['projectid'])
      this.props.history.push('/project/' + option.props['id'])
    } else if (option.props.type === '接口') {
      await this.props.fetchInterfaceListMenu(option.props['projectid'])
      this.props.history.push(
        '/project/' +
          option.props['projectid'] +
          '/interface/api/' +
          option.props['id'],
      )
    } else if (option.props.type === '文档') {
      this.props.history.push(
        '/project/' +
          option.props['projectid'] +
          '/wiki/page/' +
          option.props['id'],
      )
    }
  }

  debounceSearch = value => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      this.handleSearch(value)
    }, 500)
  }

  handleSearch = value => {
    axios
      .get('/api/project/search?q=' + value)
      .then(res => {
        const dataSource = []
        if (res.data && res.data.errcode === 0) {
          for (let title in res.data.data) {
            res.data.data[title].map(item => {
              switch (title) {
                case 'group':
                  dataSource.push(
                    <Option
                      key={`分组${item._id}`}
                      type="分组"
                      value={`${item.groupName}`}
                      id={`${item._id}`}
                    >
                      {/* <Icon type="team" /> */}
                      {`分组: ${item.groupName}`}
                    </Option>,
                  )
                  break
                case 'project':
                  dataSource.push(
                    <Option
                      key={`项目${item._id}`}
                      type="项目"
                      id={`${item._id}`}
                      projectid={`${item.groupId}`}
                    >
                      {/* <Icon type="project" /> */}
                      {`项目: ${item.name}`}
                    </Option>,
                  )
                  break
                case 'interface':
                  dataSource.push(
                    <Option
                      key={`接口${item._id}`}
                      type="接口"
                      id={`${item._id}`}
                      projectid={`${item.projectId}`}
                    >
                      {/* <Icon type="api" /> */}
                      {`接口: [${item.project_name}] ${item.title}`}
                    </Option>,
                  )
                  break
                case 'doc':
                  dataSource.push(
                    <Option
                      key={`文档${item._id}`}
                      type="文档"
                      id={`${item._id}`}
                      projectid={`${item.project_id}`}
                    >
                      {/* <Icon type="file-text" /> */}
                      {`文档: [${item.project_name}] ${item.title}`}
                    </Option>,
                  )
                  break
                default:
                  break
              }
            })
          }
        }
        this.setState({
          dataSource: dataSource,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const { dataSource } = this.state

    return (
      <div className="search-wrapper">
        <AutoComplete
          className="search-dropdown"
          dataSource={dataSource}
          style={{ width: '100%' }}
          defaultActiveFirstOption={false}
          onSelect={this.onSelect}
          onSearch={this.debounceSearch}
          // filterOption={(inputValue, option) =>
          //   option.props.children
          //     .toUpperCase()
          //     .indexOf(inputValue.toUpperCase()) !== -1
          // }
        >
          <Input
            prefix={<Icon type="search" className="srch-icon" />}
            placeholder="搜索公开的分组/项目/接口/文档"
            className="search-input"
            allowClear
          />
        </AutoComplete>
      </div>
    )
  }
}
