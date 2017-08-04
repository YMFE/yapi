import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
const DockMonitorD = DockMonitor.default // 这里有 bug 不知道为啥非要使用 default

export default createDevTools(
  <DockMonitorD toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <LogMonitor.default />
  </DockMonitorD>
);
