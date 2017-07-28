import './Breadcrumb.scss';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
// import { withRouter } from 'react-router';
import React, { Component } from 'react';
// const breadcrumbNameMap = {
//   '/group': '分组',
//   '/apps/1': 'Application1',
//   '/apps/2': 'Application2',
//   '/apps/1/detail': 'Detail',
//   '/apps/2/detail': 'Detail'
// };
@withRouter
export default class BreadcrumbNavigation extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    // 获取接口路径并分割
    const pathSnippets = location.hash.split('#')[1].split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>
            {url}
          </Link>
        </Breadcrumb.Item>
      );
    });
    const breadcrumbItems = [(
      <Breadcrumb.Item key="home">
        <Link to="/">Home</Link>
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
