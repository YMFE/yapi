import { message } from 'antd';

export default () => next => action => {
  if (!action) {
    return;
  }
  if (action.error) {
    message.error((action.payload && action.payload.message) || '服务器错误');
  } else if (
    action.payload &&
    action.payload.data &&
    action.payload.data.errcode &&
    action.payload.data.errcode !== 40011
  ) {
    message.error(action.payload.data.errmsg);
    throw new Error(action.payload.data.errmsg);
  }
  return next(action);
};
