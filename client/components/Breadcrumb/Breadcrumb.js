import './Breadcrumb.scss';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import axios from 'axios';
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
  getBreadcrumb = (pathSnippets) => {
    console.log(pathSnippets);

    if (/['project'|'group'|'add-interface']/.test(pathSnippets)) {
      const type = pathSnippets[0],
        id = pathSnippets[1];
      const params = {
        type,
        id
      }
      axios.get('/user/nav', {params: params}).then( res => {
        console.log(res);
      });
    }
  }
  componentDidMount() {
    this.setState({
      hash: location.hash
    })
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    // hash改变的时候才render
    if (nextState.hash !== this.state.hash) {
      return true;
    } else {
      return false;
    }
  }
  render () {
    // 获取接口路径并分割
    const pathSnippets = location.hash.split('#')[1].split('/').filter(i => i);
    this.getBreadcrumb(pathSnippets);
    const extraBreadcrumbItems = this.state.breadcrumb.map((item, index) => {
      // const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      console.log(index);
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
