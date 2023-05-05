import React, { Component } from 'react'
import { Button, Drawer } from 'antd'
// import SingleTimeTree from '../DrawerButton/SingleTimeLine/SingleTimeLine'
import TimeLine from 'client/components/TimeLine/TimeLine'
class DrawerButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleLog: false,
    }
  }
  onCancel = () => {
    this.setState({ visibleLog: false })
  }
  onOk = () => {
    this.setState({ visibleLog: true })
  }
  render() {
    const { projectId, actionId, wikiId } = this.props
    return (
      <div className="drawer-div">
        <Button
          type="link"
          className="drawer-button"
          onClick={this.onOk}
        >
          修改历史
        </Button>
        <Drawer
          title="修改历史"
          placement="right"
          closable={true}
          onClose={this.onCancel}
          visible={this.state.visibleLog}
          width={'35%'}
          destroyOnClose={true}
          maskClosable={true}
        >
          <TimeLine
            type={'project'}
            typeid={projectId}
            seletedId={actionId === undefined ? 'wiki_' + wikiId : actionId}
            // wikiList={[]}
          />
        </Drawer>
      </div>
    )
  }
}

export default DrawerButton
