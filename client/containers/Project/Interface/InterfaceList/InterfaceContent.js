import React from 'react'
import { Tabs } from 'antd';
import Edit from './Edit.js'
import View from './View.js'
import Run from './Run.js'

const TabPane = Tabs.TabPane;

const Content = () => {
  return <div className="interface-content">
    <Tabs defaultActiveKey="1"   >
      <TabPane tab="预览" key="1">
        <View />
      </TabPane>
      <TabPane tab="编辑" key="2">
        <Edit />
      </TabPane>
      <TabPane tab="运行" key="3">
        <Run />
      </TabPane>
    </Tabs>
  </div>
}

export default Content