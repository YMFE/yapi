import './ProjectCard.scss';
import React, { PureComponent as Component } from 'react';
import { Card, Icon, Tooltip } from 'antd';
import { connect } from 'react-redux'
import { delFollow, addFollow } from  '../../reducer/modules/follow';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { debounce } from '../../common';
import constants from '../../constants/variable.js';

@connect(
  state => {
    return {
      uid: state.user.uid
    }
  },
  {
    delFollow,
    addFollow
  }
)
@withRouter
class ProjectCard extends Component {
  constructor(props) {
    super(props);
    this.add = debounce(this.add, 400);
    this.del = debounce(this.del, 400);
  }

  static propTypes = {
    projectData: PropTypes.object,
    uid: PropTypes.number,
    inFollowPage: PropTypes.bool,
    callbackResult: PropTypes.func,
    history: PropTypes.object,
    delFollow: PropTypes.func,
    addFollow: PropTypes.func
  }

  del = () => {
    const id = this.props.projectData.projectid || this.props.projectData._id;
    this.props.delFollow(id).then((res) => {
      if (res.payload.data.errcode === 0) {
        this.props.callbackResult();
        // message.success('已取消关注！');  // 星号已做出反馈 无需重复提醒用户
      }
    });
  }

  add = () => {
    const { uid, projectData } = this.props;
    const param = {
      uid,
      projectid: projectData._id,
      projectname: projectData.name,
      icon: projectData.icon || constants.PROJECT_ICON[0],
      color: projectData.color || constants.PROJECT_COLOR.blue
    }
    this.props.addFollow(param).then((res) => {
      if (res.payload.data.errcode === 0) {
        this.props.callbackResult();
        // message.success('已添加关注！');  // 星号已做出反馈 无需重复提醒用户
      }
    });
  }

  render() {
    const { projectData, inFollowPage } = this.props;
    return (
      <div className="card-container">
        <Card bordered={false} className="m-card" onClick={() => this.props.history.push('/project/' + (projectData.projectid || projectData._id))}>
          <Icon type={projectData.icon || 'star-o'} className="ui-logo" style={{ backgroundColor: constants.PROJECT_COLOR[projectData.color] || constants.PROJECT_COLOR.blue }} />
          <h4 className="ui-title">{projectData.name || projectData.projectname}</h4>
        </Card>
        <div className="card-btns" onClick={projectData.follow || inFollowPage ? this.del : this.add}>
          <Tooltip placement="rightTop" title={projectData.follow || inFollowPage ? '取消关注' : '添加关注'}>
            <Icon type={projectData.follow || inFollowPage ? 'star' : 'star-o'} className={'icon ' + (projectData.follow || inFollowPage ? 'active' : '')}/>
          </Tooltip>
        </div>
      </div>
    )
  }

}

export default ProjectCard
