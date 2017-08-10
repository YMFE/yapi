import './index.scss'
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Upload, Icon, message } from 'antd'
class Avatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl:""
    }
  }
  handleChange(info){
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl }));
    }
  }
  render() {
    const imageUrl = this.state.imageUrl;
    return <div className="avatar-box">
      <Upload 
        className="avatar-uploader"
        name="avatar"
        showUploadList={true}
        action="//jsonplaceholder.typicode.com/posts/"
        beforeUpload={beforeUpload}
        onChange={this.handleChange.bind(this)} >
        {
          imageUrl ?
            <img src={imageUrl} alt="" className="avatar" /> :
            <Icon type="plus" className="avatar-uploader-trigger" />
        }
      </Upload>
    </div>
  }
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default Avatar;
