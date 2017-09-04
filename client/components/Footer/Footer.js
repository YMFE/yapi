import './Footer.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd';
import { Icon } from 'antd'
class Footer extends Component {
  constructor(props) {
    super(props)
  }
  static propTypes = {
    footList: PropTypes.array
  }
  render () {
    return (
      <div className="footer-wrapper">
        <Row className="footer-container">
          {this.props.footList.map(function(item,i){
            return <FootItem key={ i } linkList={ item.linkList } title={ item.title } iconType={ item.iconType } ></FootItem>
          })}
        </Row>
      </div>
    )
  }
}

class FootItem extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    linkList: PropTypes.array,
    title: PropTypes.string,
    iconType: PropTypes.string
  }
  render () {
    return (
      <Col span={6}>
        <h4 className="title"><Icon type={ this.props.iconType } className="icon" />{this.props.title}</h4>
        { this.props.linkList.map(function(item,i){
          return (<p key={i}><a href={ item.itemLink } className="link">{ item.itemTitle }</a></p>);
        }) }
      </Col>
    );
  }
}

Footer.defaultProps = {
  footList: [
    {
      title: 'GitHub',
      iconType: 'github',
      linkList: [
        {
          itemTitle: '源码仓库',
          itemLink: 'https://github.com/YMFE/yapi'
        }
      ]

    },
    {
      title: '相关站点',
      iconType: 'link',
      linkList: [
        {
          itemTitle: 'YMFE',
          itemLink: 'http://ued.qunar.com/ymfe/about'
        },
        {
          itemTitle: 'UED',
          itemLink: 'http://ued.qunar.com/'
        },{
          itemTitle: '去哪儿网',
          itemLink: 'http://www.qunar.com/'
        }
      ]

    },
    {
      title: '其他项目',
      iconType: 'layout',
      linkList: [
        {
          itemTitle: 'Yo',
          itemLink: 'http://ued.qunar.com/hy2/yo/'
        },
        {
          itemTitle: 'YIcon',
          itemLink: 'http://ued.qunar.com/yicon/'
        },{
          itemTitle: 'YKit',
          itemLink: 'http://ued.qunar.com/ykit/'
        },{
          itemTitle: 'YDoc',
          itemLink: 'http://ued.qunar.com/ydoc/'
        }
      ]
    },
    {
      title: 'Copyright © 2017 YApi',
      iconType: 'layout',
      linkList: [
        {
          itemTitle: '版本： 1.0',
          itemLink: 'javascript:'
        }
      ]
    }
  ]
}

export default Footer
