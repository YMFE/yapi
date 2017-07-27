import './Footer.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
class Footer extends Component {
  constructor(props) {
    super(props)
  }
  static propTypes = {
    footList: PropTypes.array
  }
  render () {
    const style = {
      'background': 'url(./image/footer-bac.jpg)'
    }
    return (
      <div className = 'footer' style = {style}>
       
        <div className = 'footContent'>
          { this.props.footList.map(function(item,i){
            return <FootItem key = { i } linkList = { item.linkList } title = { item.title } iconType = { item.iconType } ></FootItem>
          }) }
          <div className = 'copyRight'>
            <h4>Copyright © 2017</h4>
            YMFF出品 @ YMFF
          </div>
        </div>
        <div className='footerMask'></div>
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
      <div className = 'footItem'>
        <h4><Icon type= { this.props.iconType } style={{ fontSize: 16 }} />&nbsp;&nbsp; { this.props.title } </h4>
        { this.props.linkList.map(function(item,i){
          return (<div key = {i}>&nbsp;&nbsp;<a href = { item.itemLink }><span>{ item.itemTitle }</span></a></div>);
        }) }
      </div>
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
          itemLink: 'http://gitlab.corp.qunar.com/mfe/yapi.git'
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

    }
  ]
}

export default Footer
