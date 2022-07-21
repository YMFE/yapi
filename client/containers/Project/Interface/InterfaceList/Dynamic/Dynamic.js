import './Dynamic.scss';
import React, { PureComponent as Component } from 'react';
import { Timeline, Spin, Avatar, Button, Modal } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import showDiffMsg from 'common/diff-view.js';
const jsondiffpatch = require('jsondiffpatch/dist/jsondiffpatch.umd.js');
const formattersHtml = jsondiffpatch.formatters.html;
import ErrMsg from 'client/components/ErrMsg/ErrMsg.js';
import { Link } from 'react-router-dom';
import { timeago } from 'common/utils.js';
import { formatTime } from 'client/common.js';
import { fetchNewsData, fetchMoreNews } from 'client/reducer/modules/news.js';

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

@connect(
    state => {
        return {
            uid: state.user.uid + '',
            curdata: state.inter.curdata,
            currProject: state.project.currProject,
            curpage: state.news.curpage,
            newsData: state.news.newsData
        }
    },
    {
        fetchNewsData,
        fetchMoreNews
    }
)

class Dynamic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bidden: '',
            loading: false,
            visible: false,
            curDiffData: {},
            apiList: []
        };
    }
    static propTypes = {
        fetchNewsData: PropTypes.func,
        fetchMoreNews: PropTypes.func,
        currProject: PropTypes.object,
        newsData: PropTypes.object,
        curpage: PropTypes.number,
        curdata: PropTypes.object,
        match: PropTypes.object

    };
    componentDidMount() {
        let currProject = this.props.currProject;
        console.log("componentDidMount=",this.props.curdata)
        this.props.fetchNewsData(currProject._id, 'project', 1, 10);
    }
    handleCancel = () => {
        this.setState({
            visible: false
        });
    };

    openDiff = data => {
        this.setState({
            curDiffData: data,
            visible: true
        });
    };
    getMore() {
        const that = this;
        console.log(that)
        if (that.props.curpage <= that.props.newsData.total) {
            that.setState({ loading: true });
            that.props
                .fetchMoreNews(
                    that.props.currProject._id,
                    'project',
                    that.props.curpage + 1,
                    10,
                    that.props.curdata._id
                )
                .then(function() {
                    that.setState({ loading: false });
                    if (that.props.newsData.total === that.props.curpage) {
                        that.setState({ bidden: 'logbidden' });
                    }
                });
        }
    }
    render() {
        let { currProject } = this.props;
        console.log('render',currProject)
        const curDiffData = this.state.curDiffData;
        let logType = {
            project: '项目',
            group: '分组',
            interface: '接口',
            interface_col: '接口集',
            user: '用户',
            other: '其他'
        };

        let data = this.props.newsData ? this.props.newsData.list : [];

        if (data && data.length) {
            data = data.map((item, i) => {
                let interfaceDiff = false;
                // 去掉了 && item.data.interface_id
                if (item.data && typeof item.data === 'object') {
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
                            <span className="logtype">{logType[item.type]}动态</span>
                            <span className="logtime">{formatTime(item.add_time)}</span>
                        </div>
                        <span className="logcontent" dangerouslySetInnerHTML={{ __html: item.content }} />
                        <div style={{ padding: '10px 0 0 10px' }}>
                            {interfaceDiff && <Button onClick={() => this.openDiff(item.data)}>改动详情</Button>}
                        </div>
                    </Timeline.Item>
                );
            });
        } else {
            data = '';
        }

        let pending =
            this.props.newsData.total <= this.props.curpage ? (
                <a className="logbidden">以上为全部内容</a>
            ) : (
                <a className="loggetMore" onClick={this.getMore.bind(this)}>
                    查看更多
                </a>
            );
        if (this.state.loading) {
            pending = <Spin />;
        }
        let diffView = showDiffMsg(jsondiffpatch, formattersHtml, curDiffData);

        return (
            <div className="g-row">
                <section className="news-box m-panel">
                    <section className="news-timeline">
                        <Modal
                            style={{ minWidth: '800px' }}
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
                </section>
            </div>
        );
    }
}

export default Dynamic;