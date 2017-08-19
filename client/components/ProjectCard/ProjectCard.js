import './ProjectCard.scss';
import React, { Component } from 'react';
import { Card, Icon, Tooltip, message } from 'antd';
import { connect } from 'react-redux'
import { delFollow } from  '../../reducer/modules/follow';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

@connect(
  () => {
    return {}
  },
  {
    delFollow
  }
)
class ProjectCard extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    projectData: PropTypes.object,
    isFollowed: PropTypes.bool,
    callbackResult: PropTypes.func,
    delFollow: PropTypes.func
  }

  del = () => {
    console.log('del');
    const id = this.props.projectData.projectid;
    this.props.delFollow(id).then((res) => {
      if (res.payload.data.errcode === 0) {
        this.props.callbackResult();
        message.success('已取消关注！');
      }
    });
  }
  add() {
    console.log('add');
  }
  // <Link to={`/project/${projectData._id}`} className="card-link">
  //
  // </Link>

  // <Popconfirm placement="leftBottom" title={<Icon type="up" />} onConfirm={confirm} okText="确认" cancelText="取消">
  //   <Icon type="star-o" className="icon" onClick={this.clickHandle}/>
  // </Popconfirm>
  render() {
    const { projectData, isFollowed } = this.props;
    console.log(this.props);
    return (
      <div className="card-container">
        <Card bordered={false} bodyStyle={{padding: 16}} className="m-card">
          <div className="m-card-logo">
            <Icon type="area-chart" className="icon" />
            <p className="name">{projectData.name || projectData.projectname}</p>
          </div>
        </Card>
        <div className="card-btns">
          <Tooltip placement="rightTop" title={isFollowed ? '取消关注' : '添加关注'}>
            <Icon type={isFollowed ? 'star' : 'star-o'} className="icon" onClick={isFollowed ? this.del : this.add}/>
          </Tooltip>
        </div>
      </div>
    )
  }

}

export default ProjectCard
