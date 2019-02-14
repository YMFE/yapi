import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const WikiView = props => {
  const { editorEable, onEditor, uid, username, editorTime, desc } = props;
  return (
    <div className="wiki-view-content">
      <div className="wiki-title">
        <Button icon="edit" onClick={onEditor} disabled={!editorEable}>
          编辑
        </Button>
        {username && (
          <div className="wiki-user">
            由{' '}
            <Link className="user-name" to={`/user/profile/${uid || 11}`}>
              {username}
            </Link>{' '}
            修改于 {editorTime}
          </div>
        )}
      </div>
      <div
        className="tui-editor-contents"
        dangerouslySetInnerHTML={{ __html: desc }}
      />
    </div>
  );
};

WikiView.propTypes = {
  editorEable: PropTypes.bool,
  onEditor: PropTypes.func,
  uid: PropTypes.number,
  username: PropTypes.string,
  editorTime: PropTypes.string,
  desc: PropTypes.string
};

export default WikiView;
