import React, { PureComponent as Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Tabs, Layout } from 'antd';
import { Route, Switch, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';
// import _ from 'underscore';
const { Content, Sider } = Layout;

import './interface.scss';

import InterfaceMenu from './InterfaceList/InterfaceMenu.js';
import InterfaceList from './InterfaceList/InterfaceList.js';
import InterfaceContent from './InterfaceList/InterfaceContent.js';

import InterfaceColMenu from './InterfaceCol/InterfaceColMenu.js';
import InterfaceColContent from './InterfaceCol/InterfaceColContent.js';
import InterfaceCaseContent from './InterfaceCol/InterfaceCaseContent.js';
import { getProject } from '../../../reducer/modules/project';
import { setColData } from '../../../reducer/modules/interfaceCol.js';
const contentRouter = {
  path: '/project/:id/interface/:action/:actionId',
  exact: true
};

const InterfaceRoute = props => {
  let C;
  if (props.match.params.action === 'api') {
    if (!props.match.params.actionId) {
      C = InterfaceList;
    } else if (!isNaN(props.match.params.actionId)) {
      C = InterfaceContent;
    } else if (props.match.params.actionId.indexOf('cat_') === 0) {
      C = InterfaceList;
    }
  } else if (props.match.params.action === 'col') {
    C = InterfaceColContent;
  } else if (props.match.params.action === 'case') {
    C = InterfaceCaseContent;
  }
  return <C {...props} />;
};

InterfaceRoute.propTypes = {
  match: PropTypes.object
};

@connect(
  state => {
    return {
      isShowCol: state.interfaceCol.isShowCol
    };
  },
  {
    setColData,
    getProject
  }
)
class Interface extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    isShowCol: PropTypes.bool,
    getProject: PropTypes.func,
    setColData: PropTypes.func
    // fetchInterfaceColList: PropTypes.func
  };

  resizeBarRef = null;

  constructor(props) {
    super(props);
    // this.state = {
    //   curkey: this.props.match.params.action === 'api' ? 'api' : 'colOrCase'
    // }
    this.state = {
      isResizing: false,
      siderWidth: 300
    }
  }

  componentDidMount() {
    this.siderDOMNode = ReactDOM.findDOMNode(this.siderRef);
    document.addEventListener('mouseup', this.handleMouseUp);
    // document.addEventListener('mousemove', _.debounce(this.handleMouseMove, 100));
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }


  onChange = action => {
    let params = this.props.match.params;
    if (action === 'colOrCase') {
      action = this.props.isShowCol ? 'col' : 'case';
    }
    this.props.history.push('/project/' + params.id + '/interface/' + action);
  };
  async componentWillMount() {
    this.props.setColData({
      isShowCol: true
    });
    // await this.props.fetchInterfaceColList(this.props.match.params.id)
  }

  handleResizeMouseDown = () => {
    const { isResizing } = this.state;
    if (!isResizing) {
      document.body.style.userSelect = 'none';
      this.setState({
        isResizing: true
      })
    }
  }
  handleMouseMove = (e) => {
    const { isResizing, siderWidth } = this.state;
    if (!isResizing || !this.resizeBarRef || !this.siderDOMNode) return;

    const siderClientRect = this.siderDOMNode.getBoundingClientRect();
    this.resizeBarRef.style.position = 'fixed';
    this.resizeBarRef.style.left = `${siderClientRect.left + siderWidth}px`;
    this.resizeBarRef.style.height = `${siderClientRect.height}px`;
    const offsetX = e.screenX - (siderClientRect.left + siderWidth);
    let newWidth = siderWidth + offsetX;
    if (newWidth < 300) newWidth = 300;
    this.resizeBarRef.style.left = `${siderClientRect.left + newWidth}px`;
    this.setState({
      siderWidth: newWidth
    });
  }
  handleMouseUp = () => {
    const { isResizing } = this.state;
    this.resizeBarRef.style.position = '';
    this.resizeBarRef.style.left = '';
    this.resizeBarRef.style.height = '';
    if (isResizing) {
      document.body.style.userSelect = '';
      this.setState({
        isResizing: false
      })
    }
  }

  render() {
    const { action } = this.props.match.params;
    // const activeKey = this.state.curkey;
    const activeKey = action === 'api' ? 'api' : 'colOrCase';
    const { siderWidth } = this.state;

    return (
      <Layout style={{ minHeight: 'calc(100vh - 156px)', marginLeft: '24px', marginTop: '24px' }}>
        <Sider style={{ height: '100%' }} width={siderWidth} ref={ref => this.siderRef = ref}>
          <div className="left-menu">
            <Tabs type="card" className="tabs-large" activeKey={activeKey} onChange={this.onChange}>
              <Tabs.TabPane tab="接口列表" key="api" />
              <Tabs.TabPane tab="测试集合" key="colOrCase" />
            </Tabs>
            {activeKey === 'api' ? (
              <InterfaceMenu
                router={matchPath(this.props.location.pathname, contentRouter)}
                projectId={this.props.match.params.id}
              />
            ) : (
              <InterfaceColMenu
                router={matchPath(this.props.location.pathname, contentRouter)}
                projectId={this.props.match.params.id}
              />
            )}
          </div>
        </Sider>
        <div
          className="left-pannel-resizer"
          onMouseDown={this.handleResizeMouseDown}
          ref={ref => this.resizeBarRef = ref}
        ></div>
        <Layout>
          <Content
            style={{
              height: '100%',
              margin: '0 24px 0 16px',
              overflow: 'initial',
              backgroundColor: '#fff'
            }}
          >
            <div className="right-content">
              <Switch>
                <Route exact path="/project/:id/interface/:action" component={InterfaceRoute} />
                <Route {...contentRouter} component={InterfaceRoute} />
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Interface;
