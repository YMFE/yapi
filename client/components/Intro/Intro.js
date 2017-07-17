import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Icon } from 'antd'
import "./Intro.scss"

const IntroPart = (props) =>(
  <Col span={12} className="switch-content">
    <div className="icon-switch">
      <Icon type="smile-o" />
    </div>
    <div>
      <p><b>{props.title}</b></p>
      <p>{props.des}</p>
    </div>
  </Col>
)

IntroPart.propTypes = {
  title : PropTypes.string,
  des : PropTypes.string
}

class Intro extends React.Component{
  constructor(props){
    super(props);
  }
  static propTypes={
    intro : PropTypes.shape({
      title:PropTypes.string,
      des:PropTypes.string,
      img:PropTypes.string,
      detail:PropTypes.arrayOf(PropTypes.shape({
        title:PropTypes.string,
        des:PropTypes.string
      }))
    })
  }
  render(){
    const { intro } = this.props;
    return(
      <div className="intro-container">
        <Row>
          <Col span={12}>
            <div>
              <div className="img-container">
                <img src={intro.img}/>
              </div>
            </div>
          </Col>
          <Col span={12} className="des-container">
            <div>
              <div className="des-title">
                {intro.title}
              </div>
              <div className="des-detail">
                {intro.des}
              </div>
            </div>
            <div className="des-switch">
              {intro.detail.map(function(item,i){
                return(<IntroPart key={i} title={item.title} des={item.des}/>)
              })}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Intro;

