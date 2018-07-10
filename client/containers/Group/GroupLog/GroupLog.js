import React, { PureComponent as Component } from 'react';
import TimeTree from '../../../components/TimeLine/TimeLine';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Button } from 'antd'
@connect(state => {
  return {
    uid: state.user.uid + '',
    curGroupId: state.group.currGroup._id
  };
})
class GroupLog extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    uid: PropTypes.string,
    match: PropTypes.object,
    curGroupId: PropTypes.number
  };
  render() {
    return (
      <div className="g-row">
        <section className="news-box m-panel">
          <TimeTree type={'group'} typeid={this.props.curGroupId} />
        </section>
      </div>
    );
  }
}

export default GroupLog;
