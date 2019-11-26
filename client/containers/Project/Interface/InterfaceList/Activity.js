import "./Activity.scss";
import "jsondiffpatch/dist/formatters-styles/annotated.css";
import "jsondiffpatch/dist/formatters-styles/html.css";

import { Avatar, Button, Modal, Spin, Timeline } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import React, { PureComponent as Component } from "react";
import { Link } from "react-router-dom";

import showDiffMsg from "../../../../../common/diff-view.js";
import { timeago } from "../../../../../common/utils.js";
import { formatTime } from "../../../../common.js";
import ErrMsg from "../../../../components/ErrMsg/ErrMsg.js";

import { connect } from "react-redux";
const jsondiffpatch = require("jsondiffpatch/dist/jsondiffpatch.umd.js");
const formattersHtml = jsondiffpatch.formatters.html;

const AddDiffView = props => {
  const { title, content, className } = props;

  if (!content) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="title">{title}</h3>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

AddDiffView.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string
};

@connect(state => {
  return {
    curData: state.inter.curdata,
    currProject: state.project.currProject
  };
})
class Activity extends Component {
  static propTypes = {
    curData: PropTypes.object,
    currProject: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      curDiffData: {},
      newsList: [],
      curPage: 0,
      total: 1
    };
    this.curSelectValue = "";
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  fetchNewsData = async () => {
    const { curPage, newsList } = this.state;
    const res = await axios.get("/api/log/list", {
      params: {
        typeid: this.props.currProject._id,
        type: "project",
        page: curPage + 1,
        limit: 10,
        selectValue: this.props.curData._id
      }
    });

    const list = [...newsList, ...res.data.data.list];
    list.sort(function(a, b) {
      return b.add_time - a.add_time;
    });
    this.setState({
      curPage: curPage + 1,
      newsList: list,
      total: res.data.data.total
    });
    console.log(res.data);
  };

  componentDidMount() {
    this.fetchNewsData();
  }

  openDiff = data => {
    this.setState({
      curDiffData: data,
      visible: true
    });
  };

  render() {
    let data = this.state.newsList;
    const { total, curPage } = this.state;
    // let data = this.props.newsData ? this.props.newsData.list : [];
    console.log("newsList", total, curPage);
    const curDiffData = this.state.curDiffData;
    let logType = {
      project: "项目",
      group: "分组",
      interface: "接口",
      interface_col: "接口集",
      user: "用户",
      other: "其他"
    };

    if (data && data.length) {
      data = data.map((item, i) => {
        let interfaceDiff = false;
        // 去掉了 && item.data.interface_id
        if (item.data && typeof item.data === "object") {
          interfaceDiff = true;
        }
        return (
          <Timeline.Item
            dot={
              <Link to={`/user/profile/${item.uid}`}>
                <Avatar src={`/api/user/avatar?uid=${item.uid}`} />
              </Link>
            }
            key={i}
          >
            <div className="logMesHeade">
              <span className="logoTimeago">{timeago(item.add_time)}</span>
              {/*<span className="logusername"><Link to={`/user/profile/${item.uid}`}><Icon type="user" />{item.username}</Link></span>*/}
              <span className="logtype">{logType[item.type]}动态</span>
              <span className="logtime">{formatTime(item.add_time)}</span>
            </div>
            <span
              className="logcontent"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
            <div style={{ padding: "10px 0 0 10px" }}>
              {interfaceDiff && (
                <Button onClick={() => this.openDiff(item.data)}>
                  改动详情
                </Button>
              )}
            </div>
          </Timeline.Item>
        );
      });
    } else {
      data = "";
    }
    let pending =
      total <= curPage ? (
        <a className="logbidden">以上为全部内容</a>
      ) : (
        <a className="loggetMore" onClick={this.fetchNewsData}>
          查看更多
        </a>
      );
    if (this.state.loading) {
      pending = <Spin />;
    }
    let diffView = showDiffMsg(jsondiffpatch, formattersHtml, curDiffData);

    return (
      <div className="interface-list-activity-box">
        <section className="news-timeline">
          <Modal
            style={{ minWidth: "800px" }}
            title="Api 改动日志"
            visible={this.state.visible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <i>注： 绿色代表新增内容，红色代表删除内容</i>
            <div className="project-interface-change-content">
              {diffView.map((item, index) => {
                return (
                  <AddDiffView
                    className="item-content"
                    title={item.title}
                    key={index}
                    content={item.content}
                  />
                );
              })}
              {diffView.length === 0 && <ErrMsg type="noChange" />}
            </div>
          </Modal>
          {data ? (
            <Timeline className="news-content" pending={pending}>
              {data}
            </Timeline>
          ) : (
            <ErrMsg type="noData" />
          )}
        </section>
      </div>
    );
  }
}

export default Activity;
