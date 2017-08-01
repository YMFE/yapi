import './Breadcrumb.scss';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types'
import React, { Component } from 'react';

@withRouter
export default class BreadcrumbNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // breadcrumb: [{name:'首页', path: '/'}],
      hash: '',
      breadcrumb: []
    }
  }
  static propTypes = {
    location: PropTypes.object
  }

  getBreadcrumb = (pathSnippets) => {
    // 重置 state 中的 breadcrumb，防止重复渲染
    this.setState({
      breadcrumb: []
    });
    if (/project|group|add-interface/.test(pathSnippets[0])) {
      let type = pathSnippets[0] === 'add-interface' ? 'interface' : pathSnippets[0],
        id = pathSnippets[pathSnippets.length-1];
      if (pathSnippets.includes('add-interface') && !pathSnippets.includes('edit')) {
        type = 'project';
      }
      const params = { type, id };
      axios.get('/user/nav', {params: params}).then( (res) => {
        const data = res.data.data;
        // 依次填入group/projec/interface
        if (data.group_name) {
          this.setState({
            breadcrumb: this.state.breadcrumb.concat([{
              name: data.group_name,
              path: '/group/' + data.group_id
            }])
          });
        }
        if (data.project_name) {
          this.setState({
            breadcrumb: this.state.breadcrumb.concat([{
              name: data.project_name,
              path: '/project/' + data.project_id
            }])
          });
          // '添加接口'页面：根据project_id获取面包屑路径，并在结尾追加"添加接口"
          if (pathSnippets.includes('add-interface') && !pathSnippets.includes('edit')) {
            this.setState({
              breadcrumb: this.state.breadcrumb.concat([{
                name: '添加接口',
                path: '/add-interface/' + data.project_id
              }])
            });
          }
        }
        if (data.interface_name && pathSnippets.includes('edit')) {
          this.setState({
            breadcrumb: this.state.breadcrumb.concat([{
              name: data.interface_name,
              path: '/add-interface/edit/' + data.interface_id
            }])
          });
        }
      });
    } else if (pathSnippets[0] == 'user') {
      this.setState({
        breadcrumb: [{
          name: '个人中心',
          path: '/' + pathSnippets.join('/')
        }]
      });
    }
  }
  componentDidMount() {
    const pathSnippets = location.hash.split('#')[1].split('/').filter(i => i);
    this.getBreadcrumb(pathSnippets);
    this.setState({
      hash: location.hash.split('#')[1]
    })
  }
  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   hash: nextProps.location.pathname
    // })
    const pathSnippets = location.hash.split('#')[1].split('/').filter(i => i);
    // console.log(nextProps.location.pathname, this.props.location.pathname);
    if (nextProps.location.pathname !== this.props.location.pathname) {
      // console.log('in');
      this.getBreadcrumb(pathSnippets);
      this.setState({
        hash: nextProps.location.pathname
      })
    }
  }
  render () {
    // console.log(this.state.hash);
    const pathSnippets = location.hash.split('#')[1].split('/').filter(i => i);
    // 获取接口路径并分割
    // console.log(this.state);
    const extraBreadcrumbItems = this.state.breadcrumb.map((item) => {
      // const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return (
        <Breadcrumb.Item key={item.path}>
          <Link to={item.path}>
            {item.name}
          </Link>
        </Breadcrumb.Item>
      );
    });
    const breadcrumbItems = [(
      <Breadcrumb.Item key="home">
        <Link to="/">首页</Link>
      </Breadcrumb.Item>
    )].concat(extraBreadcrumbItems);
    if (pathSnippets.length) {
      return (
        <Breadcrumb className="breadcrumb-container">
          {breadcrumbItems}
        </Breadcrumb>
      )
    } else {
      return <span></span>;
    }
  }
}
